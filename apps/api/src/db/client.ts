import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DOWNUNDER_DB ?? join(here, '../../data/downunder');
mkdirSync(dirname(dataDir), { recursive: true });

export const pglite = new PGlite(dataDir);
export const db = drizzle(pglite, { schema });

let migrated = false;

export const migrate = async (): Promise<void> => {
  if (migrated) return;
  await pglite.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id text PRIMARY KEY,
      name text NOT NULL,
      type text NOT NULL,
      "privacyRegime" text NOT NULL,
      "dataRegion" text NOT NULL,
      "retentionDays" integer NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      "tenantId" text,
      role text NOT NULL,
      "authSubject" text NOT NULL,
      "createdAt" timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS consents (
      id text PRIMARY KEY,
      "userId" text NOT NULL,
      purpose text NOT NULL,
      version text NOT NULL,
      "grantedAt" timestamptz,
      "revokedAt" timestamptz
    );
    CREATE TABLE IF NOT EXISTS profiles (
      id text PRIMARY KEY,
      "userId" text NOT NULL,
      "displayName" text,
      "dobYearMonth" text,
      "ageYears" integer,
      smoker boolean NOT NULL DEFAULT false,
      "bmiBand" text NOT NULL DEFAULT 'unknown',
      "conditionFlags" jsonb NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "profileMethods" (
      id text PRIMARY KEY,
      "profileId" text NOT NULL,
      "methodCode" text NOT NULL,
      "startedOn" text,
      "endedOn" text
    );
    CREATE TABLE IF NOT EXISTS "profileMedications" (
      id text PRIMARY KEY,
      "profileId" text NOT NULL,
      "rxcuiInput" text,
      "ingredientRxcuis" jsonb NOT NULL,
      "ingredientNames" jsonb NOT NULL,
      "displayName" text NOT NULL,
      source text NOT NULL,
      active boolean NOT NULL DEFAULT true,
      resolved boolean NOT NULL DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS checks (
      id text PRIMARY KEY,
      "profileId" text NOT NULL,
      "requestedBy" text NOT NULL,
      "engineVersion" text NOT NULL,
      "rulesVersion" text NOT NULL,
      "inputsSnapshot" jsonb NOT NULL,
      findings jsonb NOT NULL,
      overall text NOT NULL,
      result jsonb NOT NULL,
      "createdAt" timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "clinicianReviews" (
      id text PRIMARY KEY,
      "checkId" text NOT NULL,
      "clinicianId" text NOT NULL,
      outcome text NOT NULL,
      note text,
      "createdAt" timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "labelCache" (
      "setId" text PRIMARY KEY,
      rxcui jsonb NOT NULL,
      "ingredientRxcuis" jsonb NOT NULL,
      "effectiveTime" text,
      sections jsonb NOT NULL,
      "fetchedAt" timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS extractions (
      id text PRIMARY KEY,
      "setId" text NOT NULL,
      section text NOT NULL,
      span text NOT NULL,
      "statementType" text NOT NULL,
      score integer NOT NULL,
      "modelVersion" text NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "rulesReleases" (
      version text PRIMARY KEY,
      "gitSha" text NOT NULL,
      "reviewedBy" text NOT NULL,
      "releasedAt" timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "auditEvents" (
      id text PRIMARY KEY,
      actor text NOT NULL,
      action text NOT NULL,
      "objectType" text NOT NULL,
      "objectId" text NOT NULL,
      "tenantId" text,
      "ipHash" text,
      at timestamptz NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "analyticsDaily" (
      id text PRIMARY KEY,
      "tenantId" text NOT NULL,
      date text NOT NULL,
      metric text NOT NULL,
      value integer NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "rxnormCache" (
      rxcui text PRIMARY KEY,
      "displayName" text NOT NULL,
      "ingredientRxcuis" jsonb NOT NULL,
      "ingredientNames" jsonb NOT NULL,
      "fetchedAt" timestamptz NOT NULL
    );
  `);
  migrated = true;
};
