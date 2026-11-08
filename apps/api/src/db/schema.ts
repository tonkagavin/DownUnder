import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  privacyRegime: text('privacyRegime').notNull(),
  dataRegion: text('dataRegion').notNull(),
  retentionDays: integer('retentionDays').notNull()
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenantId'),
  role: text('role').notNull(),
  authSubject: text('authSubject').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull()
});

export const consents = pgTable('consents', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  purpose: text('purpose').notNull(),
  version: text('version').notNull(),
  grantedAt: timestamp('grantedAt', { withTimezone: true }),
  revokedAt: timestamp('revokedAt', { withTimezone: true })
});

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  displayName: text('displayName'),
  dobYearMonth: text('dobYearMonth'),
  ageYears: integer('ageYears'),
  smoker: boolean('smoker').notNull().default(false),
  bmiBand: text('bmiBand').notNull().default('unknown'),
  conditionFlags: jsonb('conditionFlags').$type<string[]>().notNull()
});

export const profileMethods = pgTable('profileMethods', {
  id: text('id').primaryKey(),
  profileId: text('profileId').notNull(),
  methodCode: text('methodCode').notNull(),
  startedOn: text('startedOn'),
  endedOn: text('endedOn')
});

export const profileMedications = pgTable('profileMedications', {
  id: text('id').primaryKey(),
  profileId: text('profileId').notNull(),
  rxcuiInput: text('rxcuiInput'),
  ingredientRxcuis: jsonb('ingredientRxcuis').$type<string[]>().notNull(),
  ingredientNames: jsonb('ingredientNames').$type<string[]>().notNull(),
  displayName: text('displayName').notNull(),
  source: text('source').notNull(),
  active: boolean('active').notNull().default(true),
  resolved: boolean('resolved').notNull().default(false)
});

export const checks = pgTable('checks', {
  id: text('id').primaryKey(),
  profileId: text('profileId').notNull(),
  requestedBy: text('requestedBy').notNull(),
  engineVersion: text('engineVersion').notNull(),
  rulesVersion: text('rulesVersion').notNull(),
  inputsSnapshot: jsonb('inputsSnapshot').notNull(),
  findings: jsonb('findings').notNull(),
  overall: text('overall').notNull(),
  result: jsonb('result').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull()
});

export const clinicianReviews = pgTable('clinicianReviews', {
  id: text('id').primaryKey(),
  checkId: text('checkId').notNull(),
  clinicianId: text('clinicianId').notNull(),
  outcome: text('outcome').notNull(),
  note: text('note'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull()
});

export const labelCache = pgTable('labelCache', {
  setId: text('setId').primaryKey(),
  rxcui: jsonb('rxcui').$type<string[]>().notNull(),
  ingredientRxcuis: jsonb('ingredientRxcuis').$type<string[]>().notNull(),
  effectiveTime: text('effectiveTime'),
  sections: jsonb('sections').notNull(),
  fetchedAt: timestamp('fetchedAt', { withTimezone: true }).notNull()
});

export const extractions = pgTable('extractions', {
  id: text('id').primaryKey(),
  setId: text('setId').notNull(),
  section: text('section').notNull(),
  span: text('span').notNull(),
  statementType: text('statementType').notNull(),
  score: integer('score').notNull(),
  modelVersion: text('modelVersion').notNull()
});

export const rulesReleases = pgTable('rulesReleases', {
  version: text('version').primaryKey(),
  gitSha: text('gitSha').notNull(),
  reviewedBy: text('reviewedBy').notNull(),
  releasedAt: timestamp('releasedAt', { withTimezone: true }).notNull()
});

export const auditEvents = pgTable('auditEvents', {
  id: text('id').primaryKey(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  objectType: text('objectType').notNull(),
  objectId: text('objectId').notNull(),
  tenantId: text('tenantId'),
  ipHash: text('ipHash'),
  at: timestamp('at', { withTimezone: true }).notNull()
});

export const analyticsDaily = pgTable('analyticsDaily', {
  id: text('id').primaryKey(),
  tenantId: text('tenantId').notNull(),
  date: text('date').notNull(),
  metric: text('metric').notNull(),
  value: integer('value').notNull()
});

export const rxnormCache = pgTable('rxnormCache', {
  rxcui: text('rxcui').primaryKey(),
  displayName: text('displayName').notNull(),
  ingredientRxcuis: jsonb('ingredientRxcuis').$type<string[]>().notNull(),
  ingredientNames: jsonb('ingredientNames').$type<string[]>().notNull(),
  fetchedAt: timestamp('fetchedAt', { withTimezone: true }).notNull()
});
