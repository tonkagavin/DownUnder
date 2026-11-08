import cors from '@fastify/cors';
import Fastify from 'fastify';
import { and, desc, eq } from 'drizzle-orm';
import { methods as methodRows, snapshot } from '@downunder/rules-data';
import { classifyLabelText } from '@downunder/extract';
import {
  addMedicationSchema,
  askRequestSchema,
  checkResultSchema,
  CONSENT_VERSION,
  createCheckSchema,
  createReviewSchema,
  putProfileSchema,
  saveConsentSchema
} from '@downunder/types';
import { db, migrate } from './db/client.js';
import {
  analyticsDaily,
  auditEvents,
  checks,
  clinicianReviews,
  consents,
  profiles,
  profileMedications,
  profileMethods
} from './db/schema.js';
import { DEMO_PROFILE_ID, DEMO_USER_ID, seed } from './db/seed.js';
import { ensureProfileContext } from './lib/ensureProfile.js';
import { id } from './lib/ids.js';
import { answerQuestion } from './services/askService.js';
import { runCheck } from './services/checkService.js';
import { collectBodyEffects } from './services/bodyEffects.js';
import { getLabelForIngredient } from './services/openFdaClient.js';
import { resolveMedication, searchMedicationByName } from './services/rxnavClient.js';

const audit = async (actor: string, action: string, objectType: string, objectId: string) => {
  await db.insert(auditEvents).values({
    id: id('aud'),
    actor,
    action,
    objectType,
    objectId,
    tenantId: 'tenant-demo',
    ipHash: null,
    at: new Date()
  });
};

const demoUser = (request: { headers: Record<string, unknown> }): string =>
  String(request.headers['x-user-id'] ?? request.headers['x-demo-user-id'] ?? DEMO_USER_ID);

export const buildApp = async () => {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });

  app.get('/api/health', async () => ({ ok: true, service: 'downunder-api' }));

  app.get('/api/catalog/methods', async () => ({
    methods: methodRows.map((row) => ({
      code: row.code,
      name: row.name,
      plainName: row.plainName,
      route: row.route,
      hormones: row.hormones,
      note: row.note,
      reliabilityClass: row.reliabilityClass
    }))
  }));

  app.get('/api/catalog/rulesSnapshot', async () => snapshot);

  app.get('/api/medications/search', async (request) => {
    const q = String((request.query as { q?: string }).q ?? '');
    const medications = await searchMedicationByName(q);
    return { medications };
  });

  app.post('/api/medications/resolve', async (request, reply) => {
    const body = request.body as { displayName?: string; rxcui?: string };
    if (!body.displayName) return reply.code(400).send({ error: 'displayName required' });
    const medication = await resolveMedication({ displayName: body.displayName, rxcui: body.rxcui });
    return { medication };
  });

  const serializeProfile = async (userId: string) => {
    const ctx = await ensureProfileContext(userId);
    return {
      profile: {
        id: ctx.profile.id,
        displayName: ctx.profile.displayName,
        healthFacts: ctx.healthFacts,
        methodCode: ctx.methodCode,
        methodStartedOn: null,
        medications: ctx.meds
          .filter((row) => row.active)
          .map((row) => ({
            id: row.id,
            displayName: row.displayName,
            rxcuiInput: row.rxcuiInput,
            ingredientRxcuis: row.ingredientRxcuis,
            source: row.source as 'search' | 'manual' | 'import',
            active: row.active,
            resolved: row.resolved
          }))
      }
    };
  };

  app.get('/api/profile', async (request) => serializeProfile(demoUser(request)));

  app.put('/api/profile', async (request, reply) => {
    const parsed = putProfileSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid profile' });
    const userId = demoUser(request);
    const ctx = await ensureProfileContext(userId);
    const ageYears = parsed.data.ageYears ?? ctx.profile.ageYears;
    await db
      .update(profiles)
      .set({
        displayName: parsed.data.displayName ?? ctx.profile.displayName,
        ageYears,
        smoker: parsed.data.smoker ?? ctx.profile.smoker,
        bmiBand: parsed.data.bmiBand ?? ctx.profile.bmiBand,
        conditionFlags: parsed.data.conditionFlags ?? ctx.profile.conditionFlags
      })
      .where(eq(profiles.id, ctx.profile.id));
    if (parsed.data.methodCode !== undefined) {
      await db.update(profileMethods).set({ endedOn: new Date().toISOString().slice(0, 10) }).where(eq(profileMethods.profileId, ctx.profile.id));
      if (parsed.data.methodCode) {
        await db.insert(profileMethods).values({
          id: id('pm'),
          profileId: ctx.profile.id,
          methodCode: parsed.data.methodCode,
          startedOn: new Date().toISOString().slice(0, 10),
          endedOn: null
        });
      }
    }
    await audit(userId, 'profile.write', 'profile', ctx.profile.id);
    return serializeProfile(userId);
  });

  app.post('/api/profile/medications', async (request, reply) => {
    const parsed = addMedicationSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid medication' });
    const userId = demoUser(request);
    const ctx = await ensureProfileContext(userId);
    const resolved = await resolveMedication({ displayName: parsed.data.displayName, rxcui: parsed.data.rxcuiInput });
    await db.insert(profileMedications).values({
      id: id('med'),
      profileId: ctx.profile.id,
      rxcuiInput: resolved.rxcuiInput,
      ingredientRxcuis: resolved.ingredientRxcuis,
      ingredientNames: resolved.ingredientNames,
      displayName: parsed.data.displayName,
      source: parsed.data.source ?? 'search',
      active: true,
      resolved: resolved.resolved
    });
    await audit(userId, 'profile.medication.add', 'profileMedication', ctx.profile.id);
    return serializeProfile(userId);
  });

  app.get('/api/profile/medications/:id/effects', async (request, reply) => {
    const { id: medId } = request.params as { id: string };
    const userId = demoUser(request);
    const ctx = await ensureProfileContext(userId);
    const rows = await db.select().from(profileMedications).where(eq(profileMedications.id, medId)).limit(1);
    const med = rows[0];
    if (!med || med.profileId !== ctx.profile.id || !med.active) return reply.code(404).send({ error: 'Medication not found' });
    const normalized = await resolveMedication({ displayName: med.displayName, rxcui: med.rxcuiInput ?? undefined });
    const labels = new Map<string, Awaited<ReturnType<typeof getLabelForIngredient>>>();
    for (const rxcui of normalized.ingredientRxcuis) {
      labels.set(rxcui, await getLabelForIngredient(rxcui));
    }
    return { effects: collectBodyEffects([{ ...normalized, displayName: med.displayName }], labels, 'label') };
  });

  app.delete('/api/profile/medications/:id', async (request) => {
    const { id: medId } = request.params as { id: string };
    await db.update(profileMedications).set({ active: false }).where(eq(profileMedications.id, medId));
    return serializeProfile(demoUser(request));
  });

  const actorLabel = (actor: string, userId: string) => {
    if (actor === userId || actor === DEMO_USER_ID) return 'You';
    if (actor === 'demo-reyes') return 'Dr. Reyes (campus clinician)';
    return 'Campus system';
  };

  const actionLabel = (action: string) => {
    if (action === 'profile.write') return 'Updated your profile';
    if (action === 'profile.medication.add') return 'Added a medication';
    if (action === 'check.completed') return 'Ran a check';
    if (action === 'review.recorded') return 'A clinician reviewed a check';
    if (action === 'consent.write') return 'Updated consent';
    if (action === 'privacy.export') return 'Exported your data';
    if (action === 'profile.delete') return 'Deleted your stored data';
    return action;
  };

  const loadConsent = async (userId: string) => {
    const rows = await db.select().from(consents).where(eq(consents.userId, userId));
    const granted = (purpose: string) =>
      rows.some((row) => row.purpose === purpose && row.grantedAt && !row.revokedAt);
    const modeRow = rows.find((row) => row.purpose === 'savedProfile');
    return {
      analytics: granted('analytics'),
      clinicShare: granted('clinicShare'),
      mode: granted('savedProfile') ? ('saved' as const) : granted('service') ? ('guest' as const) : ('unknown' as const),
      version: modeRow?.version ?? CONSENT_VERSION
    };
  };

  const upsertConsent = async (userId: string, purpose: string, granted: boolean) => {
    const existing = await db
      .select()
      .from(consents)
      .where(and(eq(consents.userId, userId), eq(consents.purpose, purpose)))
      .limit(1);
    const now = new Date();
    if (existing[0]) {
      await db
        .update(consents)
        .set({
          version: CONSENT_VERSION,
          grantedAt: granted ? now : existing[0].grantedAt,
          revokedAt: granted ? null : now
        })
        .where(eq(consents.id, existing[0].id));
      return;
    }
    await db.insert(consents).values({
      id: id('con'),
      userId,
      purpose,
      version: CONSENT_VERSION,
      grantedAt: granted ? now : null,
      revokedAt: granted ? null : now
    });
  };

  app.get('/api/consent', async (request) => ({ consents: await loadConsent(demoUser(request)) }));

  app.put('/api/consent', async (request, reply) => {
    const parsed = saveConsentSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid consent' });
    const userId = demoUser(request);
    await upsertConsent(userId, 'service', true);
    await upsertConsent(userId, 'savedProfile', parsed.data.mode === 'saved');
    await upsertConsent(userId, 'analytics', parsed.data.analytics);
    await upsertConsent(userId, 'clinicShare', parsed.data.clinicShare);
    await audit(userId, 'consent.write', 'consent', userId);
    return { consents: await loadConsent(userId) };
  });

  app.get('/api/privacy/export', async (request) => {
    const userId = demoUser(request);
    const { profile } = await serializeProfile(userId);
    const ctx = await ensureProfileContext(userId);
    const rows = await db.select().from(checks).where(eq(checks.profileId, ctx.profile.id)).orderBy(desc(checks.createdAt));
    await audit(userId, 'privacy.export', 'profile', ctx.profile.id);
    return {
      export: {
        exportedAt: new Date().toISOString(),
        whatWeStore: [
          'your birth control method',
          'your other medication list',
          'your age',
          'whether you smoke',
          'eligibility facts you choose to share',
          'your check results'
        ],
        profile,
        consents: await loadConsent(userId),
        checks: rows.map((row) => row.result)
      }
    };
  });

  app.get('/api/privacy/log', async (request) => {
    const userId = demoUser(request);
    const rows = await db.select().from(auditEvents).where(eq(auditEvents.actor, userId)).orderBy(desc(auditEvents.at));
    const clinician = await db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.actor, 'demo-reyes'))
      .orderBy(desc(auditEvents.at));
    const merged = [...rows, ...clinician]
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, 40)
      .map((row) => ({
        id: row.id,
        who: actorLabel(row.actor, userId),
        action: actionLabel(row.action),
        at: row.at.toISOString()
      }));
    return { log: merged };
  });

  app.post('/api/privacy/delete', async (request) => {
    const userId = demoUser(request);
    const ctx = await ensureProfileContext(userId);
    const today = new Date().toISOString().slice(0, 10);
    await db.update(profileMedications).set({ active: false }).where(eq(profileMedications.profileId, ctx.profile.id));
    await db.update(profileMethods).set({ endedOn: today }).where(eq(profileMethods.profileId, ctx.profile.id));
    await db
      .update(profiles)
      .set({ smoker: false, conditionFlags: [], displayName: ctx.profile.displayName })
      .where(eq(profiles.id, ctx.profile.id));
    await db.delete(checks).where(eq(checks.profileId, ctx.profile.id));
    await audit(userId, 'profile.delete', 'profile', ctx.profile.id);
    return { ok: true, message: 'Your method, medications, health facts, and check results are deleted. Audit records required by law are kept without your medication names.' };
  });

  app.post('/api/checks', async (request, reply) => {
    const parsed = createCheckSchema.safeParse(request.body ?? {});
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid check' });
    const userId = demoUser(request);
    try {
      await ensureProfileContext(userId);
      const check = await runCheck({
        userId,
        requestedBy: 'patient',
        searched: parsed.data.searchedMedication
          ? { displayName: parsed.data.searchedMedication.displayName, rxcui: parsed.data.searchedMedication.rxcui }
          : undefined,
        checkWholeList: parsed.data.checkWholeList
      });
      await audit(userId, 'check.completed', 'check', check.id);
      return { check: checkResultSchema.parse(check) };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'We could not complete this check. That does not mean it is fine. Ask a pharmacist, or try again later.'
      });
    }
  });

  app.get('/api/checks', async (request) => {
    const ctx = await ensureProfileContext(demoUser(request));
    const rows = await db
      .select()
      .from(checks)
      .where(eq(checks.profileId, ctx.profile.id))
      .orderBy(desc(checks.createdAt));
    return {
      checks: rows.map((row) => ({
        ...(row.result as object),
        createdAt: row.createdAt.toISOString()
      }))
    };
  });

  app.get('/api/checks/:id', async (request, reply) => {
    const { id: checkId } = request.params as { id: string };
    const rows = await db.select().from(checks).where(eq(checks.id, checkId)).limit(1);
    if (!rows[0]) return reply.code(404).send({ error: 'Check not found' });
    return { check: rows[0].result };
  });

  app.post('/api/checks/:id/review', async (request, reply) => {
    const parsed = createReviewSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid review' });
    const { id: checkId } = request.params as { id: string };
    await db.insert(clinicianReviews).values({
      id: id('rev'),
      checkId,
      clinicianId: 'demo-reyes',
      outcome: parsed.data.outcome,
      note: parsed.data.note ?? null,
      createdAt: new Date()
    });
    await audit('demo-reyes', 'review.recorded', 'check', checkId);
    return { ok: true };
  });

  app.get('/api/clinician/worklist', async () => {
    const rows = await db.select().from(checks).where(eq(checks.profileId, DEMO_PROFILE_ID));
    const reviews = await db.select().from(clinicianReviews);
    const reviewed = new Set(reviews.map((row) => row.checkId));
    return {
      items: rows
        .map((row) => {
          const result = row.result as { why: string; overall: string };
          const snapshot = row.inputsSnapshot as { methodCode?: string; searched?: { displayName?: string } };
          return {
            checkId: row.id,
            overall: result.overall,
            why: result.why,
            createdAt: row.createdAt.toISOString(),
            reviewed: reviewed.has(row.id),
            methodCode: snapshot.methodCode ?? null,
            searchedName: snapshot.searched?.displayName ?? null
          };
        })
        .reverse()
    };
  });

  app.get('/api/admin/analytics', async () => {
    const rows = await db.select().from(analyticsDaily);
    return {
      metrics: rows.map((row) => ({
        metric: row.metric,
        value: row.value < 10 && row.metric !== 'abstentionRatePct' ? 0 : row.value,
        suppressed: row.value < 10 && row.metric !== 'abstentionRatePct'
      })),
      note: 'Counts under 10 are suppressed. Coming: live tenant data from real checks.'
    };
  });

  app.post('/api/ask', async (request, reply) => {
    const parsed = askRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid question' });
    let check = undefined;
    if (parsed.data.checkId) {
      const rows = await db.select().from(checks).where(eq(checks.id, parsed.data.checkId)).limit(1);
      check = rows[0]?.result as Parameters<typeof answerQuestion>[1];
    }
    const ask = answerQuestion(parsed.data.question, check);
    return { ask };
  });

  app.post('/api/extract/run', async (request, reply) => {
    const body = request.body as { rxcui?: string };
    if (!body.rxcui) return reply.code(400).send({ error: 'rxcui required' });
    const { label } = await getLabelForIngredient(body.rxcui);
    if (!label) return { statements: [], note: 'No cached or live label.' };
    const text = [label.drugInteractions, label.warningsAndCautions].filter(Boolean).join(' ');
    const statements = classifyLabelText({ setId: label.setId, section: 'drugInteractions', text });
    return { statements, label };
  });

  app.addHook('onReady', async () => {
    await migrate();
    await seed();
  });

  return app;
};
