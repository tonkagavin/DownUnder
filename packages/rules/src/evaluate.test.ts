import { describe, expect, it } from 'vitest';
import { evaluateCheck } from './evaluate.js';
import type { HealthFacts, NormalizedMedication } from '@downunder/types';

const facts = (over: Partial<HealthFacts> = {}): HealthFacts => ({
  ageYears: 22,
  ageBand: 'under35',
  smoker: false,
  bmiBand: 'under30',
  conditionFlags: [],
  ...over
});

const med = (name: string, rxcui: string, resolved = true): NormalizedMedication => ({
  displayName: name,
  rxcuiInput: rxcui,
  ingredientRxcuis: resolved ? [rxcui] : [],
  ingredientNames: resolved ? [name] : [],
  resolved
});

const present = (rxcui: string) => ({ [rxcui]: 'present' as const });

describe('evaluateCheck', () => {
  it('flags rifampin as knownInteraction with combined pill', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      searchedMedication: med('rifampin', '9384'),
      healthFacts: facts(),
      labelStatusByIngredient: present('9384')
    });
    expect(result.overall).toBe('knownInteraction');
    expect(result.findings[0]?.direction).toBe('medReducesMethodEfficacy');
    expect(result.findings[0]?.ruleId).toBe('inducer.rifampin.chc');
    expect(result.why.toLowerCase()).toContain('less effective');
    expect(result.why.toLowerCase()).not.toContain('safe');
  });

  it('does not treat copper IUD as affected by rifampin', () => {
    const result = evaluateCheck({
      methodCode: 'copperIud',
      medications: [],
      searchedMedication: med('rifampin', '9384'),
      healthFacts: facts(),
      labelStatusByIngredient: present('9384')
    });
    expect(result.overall).toBe('noneKnownInSources');
    expect(result.why.toLowerCase()).toContain('not affected');
  });

  it('flags lamotrigine reverse effect with combined pill', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [med('sertraline', '36437')],
      searchedMedication: med('lamotrigine', '28439'),
      healthFacts: facts(),
      labelStatusByIngredient: { '28439': 'present', '36437': 'present' }
    });
    expect(result.overall).toBe('knownInteraction');
    expect(result.findings[0]?.direction).toBe('methodAltersMedLevels');
    expect(result.checkedAgainst.join(' ')).toMatch(/sertraline/i);
  });

  it('returns noneKnownInSources for amoxicillin plus pill when label is present', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      searchedMedication: med('amoxicillin', '723'),
      healthFacts: facts(),
      labelStatusByIngredient: present('723')
    });
    expect(result.overall).toBe('noneKnownInSources');
    expect(result.why.toLowerCase()).toContain('no interaction');
    expect(result.why.toLowerCase()).not.toMatch(/\bsafe\b/);
  });

  it('returns insufficientInformation when the product is unresolved', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      searchedMedication: med('mystery herb', null as unknown as string, false),
      healthFacts: facts(),
      labelStatusByIngredient: {}
    });
    expect(result.overall).toBe('insufficientInformation');
  });

  it('returns insufficientInformation when the label fetch failed and there is no table hit', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      searchedMedication: med('amoxicillin', '723'),
      healthFacts: facts(),
      labelStatusByIngredient: { '723': 'failed' }
    });
    expect(result.overall).toBe('insufficientInformation');
    expect(result.findings.some((finding) => finding.outcome === 'noneKnownInSources')).toBe(false);
  });

  it('flags smoking at 35+ with combined pill', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      healthFacts: facts({ ageYears: 36, ageBand: 'age35Plus', smoker: true }),
      labelStatusByIngredient: {}
    });
    expect(result.findings.some((finding) => finding.ruleId === 'mec.smoking.age35.chc')).toBe(true);
  });

  it('flags isotretinoin when no method is selected', () => {
    const result = evaluateCheck({
      methodCode: 'none',
      medications: [],
      searchedMedication: med('isotretinoin', '6064'),
      healthFacts: facts(),
      labelStatusByIngredient: present('6064')
    });
    expect(result.overall).toBe('knownInteraction');
    expect(result.findings[0]?.direction).toBe('medRequiresReliableContraception');
  });

  it('flags tirzepatide absorption with oral pill', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      searchedMedication: med('tirzepatide', '2601723'),
      healthFacts: facts(),
      labelStatusByIngredient: present('2601723')
    });
    expect(result.overall).toBe('knownInteraction');
    expect(result.findings[0]?.direction).toBe('medImpairsMethodAbsorption');
  });

  it('lets extraction add possibleInteraction but not override a known table row', () => {
    const withTable = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      searchedMedication: med('rifampin', '9384'),
      healthFacts: facts(),
      labelStatusByIngredient: present('9384'),
      extractions: [
        {
          setId: 'abc',
          section: 'drugInteractions',
          span: 'may reduce contraceptive efficacy',
          statementType: 'reducesContraceptiveEfficacy',
          score: 0.9,
          modelVersion: 'extract-0.1'
        }
      ]
    });
    expect(withTable.findings.some((finding) => finding.fromExtraction)).toBe(false);
    expect(withTable.overall).toBe('knownInteraction');
  });

  it('never uses the words safe, protected, or Low', () => {
    const result = evaluateCheck({
      methodCode: 'chcPill',
      medications: [],
      searchedMedication: med('amoxicillin', '723'),
      healthFacts: facts(),
      labelStatusByIngredient: present('723')
    });
    const blob = JSON.stringify(result).toLowerCase();
    expect(blob).not.toMatch(/\bsafe\b/);
    expect(blob).not.toMatch(/\bprotected\b/);
    expect(blob).not.toContain('"low"');
  });
});
