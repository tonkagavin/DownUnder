import { describe, expect, it } from 'vitest';
import { classifyLabelText, mergeExtractionPolicy } from './index.js';

describe('classifyLabelText', () => {
  it('extracts a contraceptive-efficacy sentence with a span pointer', () => {
    const statements = classifyLabelText({
      setId: 'set-1',
      section: 'drugInteractions',
      text: 'Rifampin may reduce the effectiveness of hormonal contraceptives. Monitor blood pressure monthly.'
    });
    expect(statements[0]?.statementType).toBe('reducesContraceptiveEfficacy');
    expect(statements[0]?.span.toLowerCase()).toContain('hormonal contracept');
  });

  it('does not override a known table finding', () => {
    const statements = classifyLabelText({
      setId: 'set-1',
      section: 'drugInteractions',
      text: 'May reduce the effectiveness of hormonal contraceptives.'
    });
    expect(mergeExtractionPolicy({ hasKnownTableFinding: true, statements })).toEqual([]);
  });
});
