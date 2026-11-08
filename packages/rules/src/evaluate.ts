import {
  absorption,
  ecInteractions,
  inducers,
  mecConditions,
  methodByCode,
  needsContraception,
  reverseEffects,
  RULES_DATA_VERSION
} from '@downunder/rules-data';
import type {
  CheckResult,
  Evidence,
  ExtractionStatement,
  Finding,
  HealthFacts,
  MethodCategory,
  NormalizedMedication,
  Outcome
} from '@downunder/types';
import { ENGINE_VERSION, NOT_MEDICAL_ADVICE } from '@downunder/types';

export { ENGINE_VERSION };

export type LabelStatus = 'present' | 'missing' | 'failed' | 'notRequested';

export type CheckInput = {
  methodCode: MethodCategory | null;
  medications: NormalizedMedication[];
  searchedMedication?: NormalizedMedication;
  healthFacts: HealthFacts;
  labelStatusByIngredient: Record<string, LabelStatus>;
  extractions?: ExtractionStatement[];
  checkId?: string;
  sourcesUpdated?: string;
};

const fill = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');

export const fillTemplate = fill;

const rank: Record<Outcome, number> = {
  knownInteraction: 4,
  possibleInteraction: 3,
  insufficientInformation: 2,
  noneKnownInSources: 1
};

export const overallFromFindings = (findings: Finding[]): Outcome => {
  if (findings.length === 0) return 'insufficientInformation';
  return findings.reduce((best, finding) => (rank[finding.outcome] > rank[best] ? finding.outcome : best), findings[0].outcome);
};

const toEvidence = (
  rows: { type: 'guideline' | 'label' | 'extraction'; source: string; section: string }[],
  ruleId: string
): Evidence[] =>
  rows.map((row) => ({
    type: row.type,
    source: row.source,
    section: row.section,
    setId: null,
    effectiveTime: null,
    quote: null,
    ruleId
  }));

const medIngredients = (med: NormalizedMedication): { rxcui: string; name: string }[] => {
  if (med.ingredientRxcuis.length === 0) return [];
  return med.ingredientRxcuis.map((rxcui, index) => ({
    rxcui,
    name: med.ingredientNames[index] ?? med.displayName
  }));
};

const methodPlainName = (code: MethodCategory | null): string => {
  if (!code) return 'birth control';
  return methodByCode.get(code)?.plainName ?? code;
};

const labelOk = (status: LabelStatus | undefined): boolean => status === 'present';
const labelFailed = (status: LabelStatus | undefined): boolean => status === 'failed' || status === 'missing';

const noneKnownFinding = (subject: string, objectName: string, id: string): Finding => ({
  id,
  outcome: 'noneKnownInSources',
  direction: null,
  mechanism: null,
  subjectName: subject,
  objectName,
  why: `We found no interaction between ${subject} and ${objectName} in the sources we check (listed below).`,
  whatToDo: 'Keep using your method as directed. Ask a pharmacist if anything changes.',
  durationNote: null,
  alternativesNote: null,
  evidence: [
    {
      type: 'guideline',
      source: 'FSRH_CEU_DI_2022',
      section: 'Most medicines do not affect hormonal contraception',
      setId: null,
      effectiveTime: null,
      quote: null,
      ruleId: null
    }
  ],
  evidenceGrade: 'guideline',
  ruleId: null,
  fromExtraction: false
});

const insufficientFinding = (subject: string, objectName: string, reason: string, id: string): Finding => ({
  id,
  outcome: 'insufficientInformation',
  direction: null,
  mechanism: null,
  subjectName: subject,
  objectName,
  why: `We could not check ${subject} reliably because ${reason}.`,
  whatToDo: 'That does not mean it is fine to combine. Ask a pharmacist, or try again later.',
  durationNote: null,
  alternativesNote: null,
  evidence: [],
  evidenceGrade: 'label',
  ruleId: null,
  fromExtraction: false
});

const extractionToPossible = (
  statement: ExtractionStatement,
  subject: string,
  objectName: string
): Finding => ({
  id: `extract.${statement.setId}.${statement.statementType}`,
  outcome: 'possibleInteraction',
  direction: statement.statementType === 'altersOtherDrugLevels' ? 'methodAltersMedLevels' : 'medReducesMethodEfficacy',
  mechanism: 'unknown',
  subjectName: subject,
  objectName,
  why: `The label for ${subject} mentions ${statement.span.slice(0, 140)}. It may matter for your ${objectName}.`,
  whatToDo: `Check with a pharmacist before relying on your ${objectName}.`,
  durationNote: null,
  alternativesNote: null,
  evidence: [
    {
      type: 'extraction',
      source: 'openFDA',
      section: statement.section,
      setId: statement.setId,
      effectiveTime: null,
      quote: statement.span,
      ruleId: null
    }
  ],
  evidenceGrade: 'extractionOnly',
  ruleId: null,
  fromExtraction: true
});

const conditionActive = (facts: HealthFacts, condition: string): boolean => {
  if (condition === 'smokingAge35Plus') return facts.smoker && facts.ageBand === 'age35Plus';
  if (condition === 'migraineWithAura') return facts.conditionFlags.includes('migraineWithAura');
  if (condition === 'hypertension') return facts.conditionFlags.includes('hypertension');
  if (condition === 'vteHistory') return facts.conditionFlags.includes('vteHistory');
  return false;
};

export const evaluateCheck = (input: CheckInput): CheckResult => {
  const methodCode = input.methodCode;
  const methodName = methodPlainName(methodCode);
  const findings: Finding[] = [];
  const checkedAgainst: string[] = [];
  const notChecked: string[] = [];

  if (methodCode && methodCode !== 'none' && methodCode !== 'notSure') {
    checkedAgainst.push(methodName);
  } else if (methodCode === 'none') {
    checkedAgainst.push('no method selected');
  } else {
    notChecked.push('a named birth control method (select one for a method-aware result)');
  }

  const profileMeds = input.medications;
  const focusMeds: NormalizedMedication[] = input.searchedMedication
    ? [input.searchedMedication, ...profileMeds.filter((med) => med.rxcuiInput !== input.searchedMedication?.rxcuiInput)]
    : profileMeds;

  if (input.searchedMedication) {
    checkedAgainst.push(input.searchedMedication.displayName);
  }
  for (const med of profileMeds) {
    checkedAgainst.push(med.displayName);
  }

  notChecked.push('a full check of every medicine against every other medicine');

  for (const med of focusMeds) {
    if (!med.resolved || med.ingredientRxcuis.length === 0) {
      findings.push(
        insufficientFinding(med.displayName, methodName, 'we could not identify this product reliably', `unresolved.${med.displayName}`)
      );
      notChecked.push(`${med.displayName} (no product match)`);
      continue;
    }

    const ingredients = medIngredients(med);
    let tableHit = false;

    for (const ingredient of ingredients) {
      const inducer = inducers.find((row) => row.rxcui === ingredient.rxcui);
      if (inducer && methodCode && inducer.objectMethodCategories.includes(methodCode)) {
        tableHit = true;
        findings.push({
          id: inducer.id,
          outcome: inducer.severity,
          direction: inducer.direction,
          mechanism: inducer.mechanism,
          subjectName: ingredient.name,
          objectName: methodName,
          why: fill(inducer.why, { drug: ingredient.name, method: methodName }),
          whatToDo: fill(inducer.whatToDo, { drug: ingredient.name, method: methodName }),
          durationNote: inducer.durationNote ? fill(inducer.durationNote, { drug: ingredient.name, method: methodName }) : null,
          alternativesNote: inducer.alternativesNote,
          evidence: toEvidence(inducer.evidence, inducer.id),
          evidenceGrade: 'guideline',
          ruleId: inducer.id,
          fromExtraction: false
        });
      } else if (inducer && methodCode && inducer.notAffectedMethods.includes(methodCode)) {
        tableHit = true;
        findings.push({
          id: `${inducer.id}.notAffected`,
          outcome: 'noneKnownInSources',
          direction: inducer.direction,
          mechanism: inducer.mechanism,
          subjectName: ingredient.name,
          objectName: methodName,
          why: `${ingredient.name} can affect some hormonal methods, but ${methodName} is not affected this way.`,
          whatToDo: 'Keep using your method as directed. Ask a pharmacist if anything changes.',
          durationNote: null,
          alternativesNote: inducer.alternativesNote,
          evidence: toEvidence(inducer.evidence, inducer.id),
          evidenceGrade: 'guideline',
          ruleId: inducer.id,
          fromExtraction: false
        });
      }

      const reverse = reverseEffects.find((row) => row.rxcui === ingredient.rxcui);
      if (reverse && methodCode && reverse.affectedMethodCategories.includes(methodCode)) {
        tableHit = true;
        findings.push({
          id: reverse.id,
          outcome: reverse.severity,
          direction: reverse.direction,
          mechanism: reverse.mechanism,
          subjectName: methodName,
          objectName: ingredient.name,
          why: fill(reverse.why, { drug: ingredient.name, method: methodName }),
          whatToDo: fill(reverse.whatToDo, { drug: ingredient.name, method: methodName }),
          durationNote: reverse.durationNote,
          alternativesNote: reverse.alternativesNote,
          evidence: toEvidence(reverse.evidence, reverse.id),
          evidenceGrade: 'guideline',
          ruleId: reverse.id,
          fromExtraction: false
        });
      }

      const absorb = absorption.find((row) => row.rxcui === ingredient.rxcui);
      if (absorb && methodCode && absorb.objectMethodCategories.includes(methodCode)) {
        tableHit = true;
        findings.push({
          id: absorb.id,
          outcome: absorb.severity,
          direction: absorb.direction,
          mechanism: absorb.mechanism,
          subjectName: ingredient.name,
          objectName: methodName,
          why: fill(absorb.why, { drug: ingredient.name, method: methodName }),
          whatToDo: fill(absorb.whatToDo, { drug: ingredient.name, method: methodName }),
          durationNote: absorb.durationNote,
          alternativesNote: absorb.alternativesNote,
          evidence: toEvidence(absorb.evidence, absorb.id),
          evidenceGrade: 'label',
          ruleId: absorb.id,
          fromExtraction: false
        });
      }

      const needs = needsContraception.find((row) => row.rxcui === ingredient.rxcui);
      if (needs) {
        const methodIsVulnerable =
          !methodCode || needs.vulnerableMethods.includes(methodCode) || methodByCode.get(methodCode)?.reliabilityClass !== 'high';
        if (methodIsVulnerable) {
          tableHit = true;
          findings.push({
            id: needs.id,
            outcome: needs.severity,
            direction: needs.direction,
            mechanism: needs.mechanism,
            subjectName: ingredient.name,
            objectName: methodName,
            why: fill(needs.why, { drug: ingredient.name, method: methodName }),
            whatToDo: fill(needs.whatToDo, { drug: ingredient.name, method: methodName }),
            durationNote: null,
            alternativesNote: null,
            evidence: toEvidence(needs.evidence, needs.id),
            evidenceGrade: 'guideline',
            ruleId: needs.id,
            fromExtraction: false
          });
        }
      }

      const ec = ecInteractions.find((row) => row.rxcui === ingredient.rxcui);
      if (ec) {
        tableHit = true;
        findings.push({
          id: ec.id,
          outcome: ec.severity,
          direction: ec.direction,
          mechanism: ec.mechanism,
          subjectName: ingredient.name,
          objectName: methodName,
          why: fill(ec.why, { drug: ingredient.name, method: methodName }),
          whatToDo: fill(ec.whatToDo, { drug: ingredient.name, method: methodName }),
          durationNote: null,
          alternativesNote: null,
          evidence: toEvidence(ec.evidence, ec.id),
          evidenceGrade: 'guideline',
          ruleId: ec.id,
          fromExtraction: false
        });
      }

      const status = input.labelStatusByIngredient[ingredient.rxcui];
      if (labelFailed(status) && !tableHit) {
        findings.push(
          insufficientFinding(
            ingredient.name,
            methodName,
            'we could not read the official label right now',
            `labelFail.${ingredient.rxcui}`
          )
        );
      }
    }

    const anyIngredientFailed = ingredients.some((ingredient) => labelFailed(input.labelStatusByIngredient[ingredient.rxcui]));
    const allLabelsPresent = ingredients.every((ingredient) => labelOk(input.labelStatusByIngredient[ingredient.rxcui]));
    const medHasTableFinding = findings.some(
      (finding) => finding.subjectName === med.displayName || ingredients.some((ingredient) => finding.subjectName === ingredient.name)
    );

    if (!medHasTableFinding && !anyIngredientFailed && allLabelsPresent && methodCode && methodCode !== 'notSure') {
      findings.push(noneKnownFinding(med.displayName, methodName, `none.${med.displayName}`));
    } else if (!medHasTableFinding && !allLabelsPresent && !anyIngredientFailed) {
      findings.push(
        insufficientFinding(med.displayName, methodName, 'a label was not available for this product', `noLabel.${med.displayName}`)
      );
    }
  }

  if (methodCode) {
    for (const row of mecConditions) {
      if (row.methodCategories.includes(methodCode) && conditionActive(input.healthFacts, row.condition)) {
        findings.push({
          id: row.id,
          outcome: row.severity,
          direction: row.direction,
          mechanism: 'pharmacodynamic',
          subjectName: row.condition,
          objectName: methodName,
          why: row.why,
          whatToDo: row.whatToDo,
          durationNote: null,
          alternativesNote: null,
          evidence: toEvidence(row.evidence, row.id),
          evidenceGrade: 'guideline',
          ruleId: row.id,
          fromExtraction: false
        });
      }
    }
  }

  if (input.extractions) {
    for (const statement of input.extractions) {
      if (statement.score < 0.6) continue;
      const alreadyKnown = findings.some((finding) => finding.outcome === 'knownInteraction' && !finding.fromExtraction);
      if (alreadyKnown) continue;
      const subject = input.searchedMedication?.displayName ?? 'this medicine';
      findings.push(extractionToPossible(statement, subject, methodName));
    }
  }

  const unique: Finding[] = [];
  const seen = new Set<string>();
  for (const finding of findings) {
    if (seen.has(finding.id)) continue;
    seen.add(finding.id);
    unique.push(finding);
  }

  unique.sort((a, b) => rank[b.outcome] - rank[a.outcome]);
  const overall = overallFromFindings(unique);
  const top = unique[0];

  return {
    id: input.checkId ?? 'preview',
    overall,
    why: top?.why ?? 'We could not complete this check.',
    whatToDo: top?.whatToDo ?? 'Ask a pharmacist.',
    findings: unique,
    bodyEffects: [],
    checkedAgainst: [...new Set(checkedAgainst)],
    notChecked: [...new Set(notChecked)],
    rulesVersion: RULES_DATA_VERSION,
    engineVersion: ENGINE_VERSION,
    sourcesUpdated: input.sourcesUpdated ?? RULES_DATA_VERSION,
    notMedicalAdvice: NOT_MEDICAL_ADVICE
  };
};
