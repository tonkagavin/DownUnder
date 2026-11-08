import { describe, expect, it } from 'vitest';
import { inducers, methods, reverseEffects, RULES_DATA_VERSION } from './index.js';

describe('rules data', () => {
  it('loads camelCase tables', () => {
    expect(RULES_DATA_VERSION).toBe('2026.11');
    expect(methods.find((row) => row.code === 'chcPill')?.plainName).toBe('Combined pill');
    expect(inducers.length).toBeGreaterThanOrEqual(12);
    expect(reverseEffects[0]?.id).toBe('reverse.lamotrigine.chc');
  });
});
