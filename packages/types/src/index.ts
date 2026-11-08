import { z } from 'zod';

export const NOT_MEDICAL_ADVICE =
  'This is information from published labels and guidelines, not medical advice. Confirm with a pharmacist or clinician before changing anything.';

export const outcomeSchema = z.enum([
  'knownInteraction',
  'possibleInteraction',
  'noneKnownInSources',
  'insufficientInformation'
]);
export type Outcome = z.infer<typeof outcomeSchema>;

export const directionSchema = z.enum([
  'medReducesMethodEfficacy',
  'methodAltersMedLevels',
  'medImpairsMethodAbsorption',
  'methodContraindicatedByCondition',
  'medRequiresReliableContraception',
  'medMedInteractionContraceptionRelevant'
]);
export type Direction = z.infer<typeof directionSchema>;

export const mechanismSchema = z.enum([
  'cyp3a4Induction',
  'ugtInduction',
  'giAbsorption',
  'potassium',
  'pharmacodynamic',
  'teratogenicRisk',
  'unknown'
]);
export type Mechanism = z.infer<typeof mechanismSchema>;

export const evidenceGradeSchema = z.enum([
  'guideline',
  'label',
  'extractionOnly',
  'classInferred'
]);
export type EvidenceGrade = z.infer<typeof evidenceGradeSchema>;

export const methodCategorySchema = z.enum([
  'chcPill',
  'chcPatch',
  'chcRing',
  'pop',
  'implant',
  'dmpa',
  'lngIud',
  'copperIud',
  'otcNorgestrel',
  'ecLevonorgestrel',
  'ecUlipristal',
  'none',
  'notSure'
]);
export type MethodCategory = z.infer<typeof methodCategorySchema>;

export const conditionFlagSchema = z.enum([
  'migraineWithAura',
  'hypertension',
  'vteHistory',
  'breastfeeding'
]);
export type ConditionFlag = z.infer<typeof conditionFlagSchema>;

export const bmiBandSchema = z.enum(['under30', 'bmi30Plus', 'unknown']);
export type BmiBand = z.infer<typeof bmiBandSchema>;

export const ageBandSchema = z.enum(['under35', 'age35Plus', 'unknown']);
export type AgeBand = z.infer<typeof ageBandSchema>;

export const healthFactsSchema = z.object({
  ageYears: z.number().int().min(13).max(60).nullable(),
  ageBand: ageBandSchema,
  smoker: z.boolean(),
  bmiBand: bmiBandSchema,
  conditionFlags: z.array(conditionFlagSchema)
});
export type HealthFacts = z.infer<typeof healthFactsSchema>;

export const normalizedMedicationSchema = z.object({
  displayName: z.string(),
  rxcuiInput: z.string().nullable(),
  ingredientRxcuis: z.array(z.string()),
  ingredientNames: z.array(z.string()),
  resolved: z.boolean()
});
export type NormalizedMedication = z.infer<typeof normalizedMedicationSchema>;

export const evidenceSchema = z.object({
  type: z.enum(['guideline', 'label', 'extraction']),
  source: z.string(),
  section: z.string().nullable(),
  setId: z.string().nullable(),
  effectiveTime: z.string().nullable(),
  quote: z.string().nullable(),
  ruleId: z.string().nullable()
});
export type Evidence = z.infer<typeof evidenceSchema>;

export const findingSchema = z.object({
  id: z.string(),
  outcome: outcomeSchema,
  direction: directionSchema.nullable(),
  mechanism: mechanismSchema.nullable(),
  subjectName: z.string(),
  objectName: z.string(),
  why: z.string(),
  whatToDo: z.string(),
  durationNote: z.string().nullable(),
  alternativesNote: z.string().nullable(),
  evidence: z.array(evidenceSchema),
  evidenceGrade: evidenceGradeSchema,
  ruleId: z.string().nullable(),
  fromExtraction: z.boolean()
});
export type Finding = z.infer<typeof findingSchema>;

export const bodyEffectSchema = z.object({
  medicationName: z.string(),
  section: z.string(),
  effects: z.array(z.string()),
  setId: z.string().nullable(),
  source: z.string(),
  note: z.string()
});
export type BodyEffect = z.infer<typeof bodyEffectSchema>;

export const checkResultSchema = z.object({
  id: z.string(),
  overall: outcomeSchema,
  why: z.string(),
  whatToDo: z.string(),
  findings: z.array(findingSchema),
  bodyEffects: z.array(bodyEffectSchema).default([]),
  checkedAgainst: z.array(z.string()),
  notChecked: z.array(z.string()),
  rulesVersion: z.string(),
  engineVersion: z.string(),
  sourcesUpdated: z.string(),
  notMedicalAdvice: z.string(),
  createdAt: z.string().optional()
});
export type CheckResult = z.infer<typeof checkResultSchema>;

export const methodCardSchema = z.object({
  code: methodCategorySchema,
  name: z.string(),
  plainName: z.string(),
  route: z.string(),
  hormones: z.array(z.string()),
  note: z.string(),
  reliabilityClass: z.enum(['high', 'moderate', 'low', 'none', 'unknown'])
});
export type MethodCard = z.infer<typeof methodCardSchema>;

export const medicationSearchHitSchema = z.object({
  rxcui: z.string(),
  name: z.string(),
  tty: z.string()
});
export type MedicationSearchHit = z.infer<typeof medicationSearchHitSchema>;

export const profileMedicationSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  rxcuiInput: z.string().nullable(),
  ingredientRxcuis: z.array(z.string()),
  source: z.enum(['search', 'manual', 'import']),
  active: z.boolean(),
  resolved: z.boolean()
});
export type ProfileMedication = z.infer<typeof profileMedicationSchema>;

export const profileSchema = z.object({
  id: z.string(),
  displayName: z.string().nullable(),
  healthFacts: healthFactsSchema,
  methodCode: methodCategorySchema.nullable(),
  methodStartedOn: z.string().nullable(),
  medications: z.array(profileMedicationSchema)
});
export type Profile = z.infer<typeof profileSchema>;

export const putProfileSchema = z.object({
  displayName: z.string().max(80).nullable().optional(),
  ageYears: z.number().int().min(13).max(60).nullable().optional(),
  smoker: z.boolean().optional(),
  bmiBand: bmiBandSchema.optional(),
  conditionFlags: z.array(conditionFlagSchema).optional(),
  methodCode: methodCategorySchema.nullable().optional()
});
export type PutProfile = z.infer<typeof putProfileSchema>;

export const addMedicationSchema = z.object({
  displayName: z.string().min(1),
  rxcuiInput: z.string().optional(),
  source: z.enum(['search', 'manual', 'import']).optional()
});
export type AddMedication = z.infer<typeof addMedicationSchema>;

export const createCheckSchema = z.object({
  profileId: z.string().optional(),
  searchedMedication: z
    .object({
      displayName: z.string().min(1),
      rxcui: z.string().optional()
    })
    .optional(),
  checkWholeList: z.boolean().optional()
});
export type CreateCheck = z.infer<typeof createCheckSchema>;

export const reviewOutcomeSchema = z.enum(['confirmed', 'dismissed', 'advised']);
export type ReviewOutcome = z.infer<typeof reviewOutcomeSchema>;

export const createReviewSchema = z.object({
  outcome: reviewOutcomeSchema,
  note: z.string().max(2000).optional()
});
export type CreateReview = z.infer<typeof createReviewSchema>;

export const askRequestSchema = z.object({
  question: z.string().min(2).max(500),
  checkId: z.string().optional()
});
export type AskRequest = z.infer<typeof askRequestSchema>;

export const askCitationSchema = z.object({
  ruleId: z.string().nullable(),
  source: z.string(),
  section: z.string().nullable(),
  setId: z.string().nullable(),
  quote: z.string().nullable()
});
export type AskCitation = z.infer<typeof askCitationSchema>;

export const askResponseSchema = z.object({
  kind: z.enum(['answer', 'refusal', 'checkNarration']),
  text: z.string(),
  citations: z.array(askCitationSchema),
  refusedReason: z.string().nullable(),
  notMedicalAdvice: z.string()
});
export type AskResponse = z.infer<typeof askResponseSchema>;

export const clinicianReviewSchema = z.object({
  id: z.string(),
  checkId: z.string(),
  outcome: reviewOutcomeSchema,
  note: z.string().nullable(),
  createdAt: z.string()
});
export type ClinicianReview = z.infer<typeof clinicianReviewSchema>;

export const worklistItemSchema = z.object({
  checkId: z.string(),
  overall: outcomeSchema,
  why: z.string(),
  createdAt: z.string(),
  reviewed: z.boolean(),
  methodCode: z.string().nullable(),
  searchedName: z.string().nullable()
});
export type WorklistItem = z.infer<typeof worklistItemSchema>;

export const analyticsMetricSchema = z.object({
  metric: z.string(),
  value: z.number(),
  suppressed: z.boolean()
});
export type AnalyticsMetric = z.infer<typeof analyticsMetricSchema>;

export const extractionStatementTypeSchema = z.enum([
  'reducesContraceptiveEfficacy',
  'backupMethodRecommended',
  'contraindicatedWithContraceptive',
  'contraceptionRequiredDuringUse',
  'altersOtherDrugLevels'
]);
export type ExtractionStatementType = z.infer<typeof extractionStatementTypeSchema>;

export const extractionStatementSchema = z.object({
  setId: z.string(),
  section: z.string(),
  span: z.string(),
  statementType: extractionStatementTypeSchema,
  score: z.number(),
  modelVersion: z.string()
});
export type ExtractionStatement = z.infer<typeof extractionStatementSchema>;

export const labelSectionsSchema = z.object({
  setId: z.string(),
  rxcui: z.array(z.string()),
  ingredientRxcuis: z.array(z.string()),
  effectiveTime: z.string().nullable(),
  drugInteractions: z.string().nullable(),
  contraindications: z.string().nullable(),
  warningsAndCautions: z.string().nullable(),
  boxedWarning: z.string().nullable(),
  adverseReactions: z.string().nullable(),
  useInSpecificPopulations: z.string().nullable()
});
export type LabelSections = z.infer<typeof labelSectionsSchema>;

export const ENGINE_VERSION = '2.0.0';
export const RULES_VERSION = '2026.11';
export const CONSENT_VERSION = '2026.11';

export const saveConsentSchema = z.object({
  analytics: z.boolean(),
  clinicShare: z.boolean(),
  mode: z.enum(['guest', 'saved'])
});
export type SaveConsent = z.infer<typeof saveConsentSchema>;

export const consentStateSchema = z.object({
  analytics: z.boolean(),
  clinicShare: z.boolean(),
  mode: z.enum(['guest', 'saved', 'unknown']),
  version: z.string()
});
export type ConsentState = z.infer<typeof consentStateSchema>;

export const accessLogEntrySchema = z.object({
  id: z.string(),
  who: z.string(),
  action: z.string(),
  at: z.string()
});
export type AccessLogEntry = z.infer<typeof accessLogEntrySchema>;

export const privacyExportSchema = z.object({
  exportedAt: z.string(),
  whatWeStore: z.array(z.string()),
  profile: profileSchema,
  consents: consentStateSchema,
  checks: z.array(checkResultSchema)
});
export type PrivacyExport = z.infer<typeof privacyExportSchema>;
