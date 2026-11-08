import { eq } from 'drizzle-orm';
import { classifyLabelText, mergeExtractionPolicy } from '@downunder/extract';
import { evaluateCheck, type LabelStatus } from '@downunder/rules';
import type { CheckResult, HealthFacts, MethodCategory, NormalizedMedication } from '@downunder/types';
import { db } from '../db/client.js';
import { checks, extractions as extractionsTable, profiles, profileMedications, profileMethods } from '../db/schema.js';
import { ageBandFromYears } from '../lib/ageBand.js';
import { id } from '../lib/ids.js';
import { collectBodyEffects } from './bodyEffects.js';
import { getLabelForIngredient } from './openFdaClient.js';
import { resolveMedication } from './rxnavClient.js';

export const loadProfileContext = async (userId: string) => {
  const profileRows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  const profile = profileRows[0];
  if (!profile) throw Object.assign(new Error('Create a profile first.'), { statusCode: 400 });
  const methods = await db.select().from(profileMethods).where(eq(profileMethods.profileId, profile.id));
  const current = methods.find((row) => !row.endedOn);
  const meds = await db.select().from(profileMedications).where(eq(profileMedications.profileId, profile.id));
  const healthFacts: HealthFacts = {
    ageYears: profile.ageYears,
    ageBand: ageBandFromYears(profile.ageYears),
    smoker: profile.smoker,
    bmiBand: (profile.bmiBand as HealthFacts['bmiBand']) ?? 'unknown',
    conditionFlags: (profile.conditionFlags ?? []) as HealthFacts['conditionFlags']
  };
  return { profile, methodCode: (current?.methodCode ?? null) as MethodCategory | null, meds, healthFacts };
};

export const runCheck = async (input: {
  userId: string;
  requestedBy: string;
  searched?: { displayName: string; rxcui?: string };
  checkWholeList?: boolean;
}): Promise<CheckResult> => {
  const ctx = await loadProfileContext(input.userId);
  const profileMeds: NormalizedMedication[] = await Promise.all(
    ctx.meds
      .filter((row) => row.active)
      .map((row) =>
        resolveMedication({ displayName: row.displayName, rxcui: row.rxcuiInput }).then((resolved) => ({
          ...resolved,
          displayName: row.displayName
        }))
      )
  );

  const searched = input.searched
    ? await resolveMedication({ displayName: input.searched.displayName, rxcui: input.searched.rxcui })
    : undefined;

  const toResolve = searched ? [searched, ...profileMeds] : profileMeds;
  const labelStatusByIngredient: Record<string, LabelStatus> = {};
  const labelsByIngredient = new Map<string, { status: LabelStatus; label: Awaited<ReturnType<typeof getLabelForIngredient>>['label'] }>();
  const extractionStatements = [];

  for (const med of toResolve) {
    for (const rxcui of med.ingredientRxcuis) {
      const { status, label } = await getLabelForIngredient(rxcui);
      labelStatusByIngredient[rxcui] = status;
      labelsByIngredient.set(rxcui, { status, label });
      if (label) {
        const texts = [label.drugInteractions, label.warningsAndCautions, label.useInSpecificPopulations].filter(
          Boolean
        ) as string[];
        for (const text of texts) {
          extractionStatements.push(
            ...classifyLabelText({
              setId: label.setId,
              section: 'drugInteractions',
              text
            })
          );
        }
      }
    }
  }

  const preview = evaluateCheck({
    methodCode: ctx.methodCode,
    medications: profileMeds,
    searchedMedication: searched,
    healthFacts: ctx.healthFacts,
    labelStatusByIngredient,
    extractions: []
  });
  const allowed = mergeExtractionPolicy({
    hasKnownTableFinding: preview.findings.some((finding) => finding.outcome === 'knownInteraction'),
    statements: extractionStatements
  });

  const checkId = id('chk');
  const result = evaluateCheck({
    methodCode: ctx.methodCode,
    medications: profileMeds,
    searchedMedication: searched,
    healthFacts: ctx.healthFacts,
    labelStatusByIngredient,
    extractions: allowed,
    checkId,
    sourcesUpdated: new Date().toISOString().slice(0, 10)
  });
  result.bodyEffects = collectBodyEffects(toResolve, labelsByIngredient, 'method');

  for (const statement of allowed) {
    await db.insert(extractionsTable).values({
      id: id('ext'),
      setId: statement.setId,
      section: statement.section,
      span: statement.span,
      statementType: statement.statementType,
      score: Math.round(statement.score * 100),
      modelVersion: statement.modelVersion
    });
  }

  await db.insert(checks).values({
    id: checkId,
    profileId: ctx.profile.id,
    requestedBy: input.requestedBy,
    engineVersion: result.engineVersion,
    rulesVersion: result.rulesVersion,
    inputsSnapshot: { methodCode: ctx.methodCode, searched, profileMeds, healthFacts: ctx.healthFacts },
    findings: result.findings,
    overall: result.overall,
    result,
    createdAt: new Date()
  });

  return result;
};
