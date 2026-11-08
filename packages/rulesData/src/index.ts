import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import type { Direction, Mechanism, MethodCategory, Outcome } from '@downunder/types';

const tablesDir = join(dirname(fileURLToPath(import.meta.url)), '../tables');

const readYaml = <T>(name: string): T => {
  const raw = readFileSync(join(tablesDir, name), 'utf8');
  return parse(raw) as T;
};

export type EvidenceRow = {
  type: 'guideline' | 'label' | 'extraction';
  source: string;
  section: string;
};

export type MethodRow = {
  code: MethodCategory;
  name: string;
  plainName: string;
  route: string;
  hormones: string[];
  susceptibility: {
    hepaticInduction: boolean;
    giAbsorption: boolean;
    potassium: boolean;
  };
  reliabilityClass: 'high' | 'moderate' | 'low' | 'none' | 'unknown';
  note: string;
};

export type InducerRow = {
  id: string;
  rxcui: string;
  name: string;
  strength: 'strong' | 'moderate' | 'weak';
  objectMethodCategories: MethodCategory[];
  notAffectedMethods: MethodCategory[];
  direction: Direction;
  mechanism: Mechanism;
  severity: Outcome;
  why: string;
  whatToDo: string;
  durationNote: string | null;
  alternativesNote: string | null;
  evidence: EvidenceRow[];
};

export type ReverseEffectRow = {
  id: string;
  rxcui: string;
  name: string;
  affectedMethodCategories: MethodCategory[];
  direction: Direction;
  mechanism: Mechanism;
  severity: Outcome;
  why: string;
  whatToDo: string;
  durationNote: string | null;
  alternativesNote: string | null;
  evidence: EvidenceRow[];
};

export type AbsorptionRow = {
  id: string;
  rxcui: string;
  name: string;
  objectMethodCategories: MethodCategory[];
  direction: Direction;
  mechanism: Mechanism;
  severity: Outcome;
  why: string;
  whatToDo: string;
  durationNote: string | null;
  alternativesNote: string | null;
  evidence: EvidenceRow[];
};

export type MecRow = {
  id: string;
  condition: string;
  methodCategories: MethodCategory[];
  mecCategory: number;
  direction: Direction;
  severity: Outcome;
  why: string;
  whatToDo: string;
  evidence: EvidenceRow[];
};

export type NeedsContraceptionRow = {
  id: string;
  rxcui: string;
  name: string;
  reliabilityRequired: 'high' | 'moderate';
  direction: Direction;
  mechanism: Mechanism;
  severity: Outcome;
  why: string;
  whatToDo: string;
  vulnerableMethods: MethodCategory[];
  evidence: EvidenceRow[];
};

export type EcRow = {
  id: string;
  rxcui: string;
  name: string;
  direction: Direction;
  mechanism: Mechanism;
  severity: Outcome;
  why: string;
  whatToDo: string;
  evidence: EvidenceRow[];
};

export type TableMeta = {
  version: string;
  effectiveDate: string;
  source: string;
  reviewedBy: string;
  reviewDue: string;
};

const methodsFile = readYaml<TableMeta & { methods: MethodRow[] }>('methods.yaml');
const inducersFile = readYaml<TableMeta & { inducers: InducerRow[] }>('inducers.yaml');
const reverseFile = readYaml<TableMeta & { reverseEffects: ReverseEffectRow[] }>('reverseEffects.yaml');
const absorptionFile = readYaml<TableMeta & { absorption: AbsorptionRow[] }>('absorption.yaml');
const mecFile = readYaml<TableMeta & { mecConditions: MecRow[] }>('mecConditions.yaml');
const needsFile = readYaml<TableMeta & { needsContraception: NeedsContraceptionRow[] }>(
  'needsContraception.yaml'
);
const ecFile = readYaml<TableMeta & { ecInteractions: EcRow[] }>('ecInteractions.yaml');

export const RULES_DATA_VERSION = methodsFile.version;

export const methods = methodsFile.methods;
export const inducers = inducersFile.inducers;
export const reverseEffects = reverseFile.reverseEffects;
export const absorption = absorptionFile.absorption;
export const mecConditions = mecFile.mecConditions;
export const needsContraception = needsFile.needsContraception;
export const ecInteractions = ecFile.ecInteractions;

export const methodByCode = new Map(methods.map((row) => [row.code, row]));
export const inducerByRxcui = new Map(inducers.map((row) => [row.rxcui, row]));
export const reverseByRxcui = new Map(reverseEffects.map((row) => [row.rxcui, row]));
export const absorptionByRxcui = new Map(absorption.map((row) => [row.rxcui, row]));
export const needsByRxcui = new Map(needsContraception.map((row) => [row.rxcui, row]));
export const ecByRxcui = new Map(ecInteractions.map((row) => [row.rxcui, row]));

export const allIngredientRxcuis = (): string[] => {
  const set = new Set<string>();
  for (const row of [...inducers, ...reverseEffects, ...absorption, ...needsContraception, ...ecInteractions]) {
    set.add(row.rxcui);
  }
  return [...set];
};

export const snapshot = {
  version: RULES_DATA_VERSION,
  methods,
  inducers,
  reverseEffects,
  absorption,
  mecConditions,
  needsContraception,
  ecInteractions
};
