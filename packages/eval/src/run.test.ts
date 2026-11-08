import { describe, expect, it } from 'vitest';
import { runGoldSet } from './run.js';

describe('gold set v0', () => {
  it('has zero dangerous misses', () => {
    const report = runGoldSet();
    expect(report.total).toBeGreaterThanOrEqual(50);
    expect(report.dangerousMisses).toBe(0);
    expect(report.mismatches).toEqual([]);
  });
});
