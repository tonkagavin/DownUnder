import { describe, expect, it } from 'vitest';
import { guidanceByRisk, scoreRiskFromTexts } from './interactionEngine.js';

describe('interactionEngine', () => {
  it('scores high risk when contraindicated language exists', () => {
    expect(scoreRiskFromTexts(['contraindicated with hormonal contraceptives'])).toBe('High');
  });

  it('scores caution when monitor language exists', () => {
    expect(scoreRiskFromTexts(['monitor for increased side effects'])).toBe('Caution');
  });

  it('returns unknown when there is no evidence text', () => {
    expect(scoreRiskFromTexts([''])).toBe('Unknown');
  });

  it('returns guidance text for each risk', () => {
    expect(guidanceByRisk('Low')).toContain('No major interaction signals');
  });
});
