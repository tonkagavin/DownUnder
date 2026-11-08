import { eq } from 'drizzle-orm';
import { RULES_DATA_VERSION } from '@downunder/rules-data';
import { db, migrate } from './client.js';
import {
  analyticsDaily,
  consents,
  profiles,
  profileMedications,
  profileMethods,
  rulesReleases,
  tenants,
  users
} from './schema.js';
import { seedDemoLabels } from '../services/openFdaClient.js';

export const DEMO_USER_ID = 'demo-maya';
export const DEMO_PROFILE_ID = 'profile-maya';

export const seed = async (): Promise<void> => {
  await migrate();
  await db
    .insert(tenants)
    .values({
      id: 'tenant-demo',
      name: 'Demo campus health',
      type: 'campus',
      privacyRegime: 'ferpa',
      dataRegion: 'us',
      retentionDays: 90
    })
    .onConflictDoNothing();

  await db
    .insert(users)
    .values({
      id: DEMO_USER_ID,
      tenantId: 'tenant-demo',
      role: 'patient',
      authSubject: 'maya@demo.local',
      createdAt: new Date()
    })
    .onConflictDoNothing();

  await db
    .insert(users)
    .values({
      id: 'demo-reyes',
      tenantId: 'tenant-demo',
      role: 'clinician',
      authSubject: 'reyes@demo.local',
      createdAt: new Date()
    })
    .onConflictDoNothing();

  const existing = await db.select().from(profiles).where(eq(profiles.id, DEMO_PROFILE_ID)).limit(1);
  if (!existing.length) {
    await db.insert(profiles).values({
      id: DEMO_PROFILE_ID,
      userId: DEMO_USER_ID,
      displayName: 'Maya',
      dobYearMonth: '2006-03',
      ageYears: 20,
      smoker: false,
      bmiBand: 'under30',
      conditionFlags: []
    });
    await db.insert(profileMethods).values({
      id: 'pm-maya-pill',
      profileId: DEMO_PROFILE_ID,
      methodCode: 'chcPill',
      startedOn: '2025-08-01',
      endedOn: null
    });
    await db.insert(profileMedications).values({
      id: 'med-maya-sertraline',
      profileId: DEMO_PROFILE_ID,
      rxcuiInput: '36437',
      ingredientRxcuis: ['36437'],
      ingredientNames: ['sertraline'],
      displayName: 'sertraline (Zoloft)',
      source: 'search',
      active: true,
      resolved: true
    });
    await db.insert(consents).values({
      id: 'consent-maya-service',
      userId: DEMO_USER_ID,
      purpose: 'service',
      version: '2026.11',
      grantedAt: new Date(),
      revokedAt: null
    });
  }

  await db
    .insert(rulesReleases)
    .values({
      version: RULES_DATA_VERSION,
      gitSha: 'beta-build',
      reviewedBy: 'pending',
      releasedAt: new Date()
    })
    .onConflictDoNothing();

  const metrics = [
    { metric: 'checksThisWeek', value: 42 },
    { metric: 'knownInteractionFlags', value: 11 },
    { metric: 'possibleInteractionFlags', value: 8 },
    { metric: 'noneKnownInSources', value: 19 },
    { metric: 'insufficientInformation', value: 4 },
    { metric: 'abstentionRatePct', value: 10 }
  ];
  for (const row of metrics) {
    await db
      .insert(analyticsDaily)
      .values({
        id: `an-${row.metric}`,
        tenantId: 'tenant-demo',
        date: '2026-11-07',
        metric: row.metric,
        value: row.value
      })
      .onConflictDoNothing();
  }

  await seedDemoLabels();
};

if (process.argv[1]?.includes('seed')) {
  seed().then(() => {
    console.log('Seeded demo campus, Maya profile, labels, analytics.');
    process.exit(0);
  });
}
