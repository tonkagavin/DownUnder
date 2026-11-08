import { evaluateCheck } from '@downunder/rules';
import type { HealthFacts, Outcome } from '@downunder/types';
import { defaultFacts, goldSet } from './goldSet.js';

const facts = (over?: Partial<HealthFacts>): HealthFacts => ({ ...defaultFacts, ...over });

export type EvalReport = {
  total: number;
  dangerousMisses: number;
  abstentionRate: number;
  byOutcome: Record<Outcome, { expected: number; predicted: number; correct: number }>;
  mismatches: { id: string; expected: Outcome; predicted: Outcome; note: string }[];
};

export const runGoldSet = (): EvalReport => {
  const byOutcome: EvalReport['byOutcome'] = {
    knownInteraction: { expected: 0, predicted: 0, correct: 0 },
    possibleInteraction: { expected: 0, predicted: 0, correct: 0 },
    noneKnownInSources: { expected: 0, predicted: 0, correct: 0 },
    insufficientInformation: { expected: 0, predicted: 0, correct: 0 }
  };
  const mismatches: EvalReport['mismatches'] = [];
  let dangerousMisses = 0;
  let abstentions = 0;

  for (const item of goldSet) {
    const result = evaluateCheck({
      methodCode: item.methodCategory,
      medications: (item.profileMeds ?? []).map((med) => ({
        displayName: med.name,
        rxcuiInput: med.rxcui,
        ingredientRxcuis: [med.rxcui],
        ingredientNames: [med.name],
        resolved: true
      })),
      searchedMedication: {
        displayName: item.medicationName,
        rxcuiInput: item.rxcui,
        ingredientRxcuis: item.resolved && item.rxcui ? [item.rxcui] : [],
        ingredientNames: item.resolved ? [item.medicationName] : [],
        resolved: item.resolved
      },
      healthFacts: facts(item.healthFacts),
      labelStatusByIngredient: item.rxcui ? { [item.rxcui]: item.labelStatus } : {}
    });

    byOutcome[item.expectedOutcome].expected += 1;
    byOutcome[result.overall].predicted += 1;
    if (result.overall === item.expectedOutcome) byOutcome[item.expectedOutcome].correct += 1;
    else {
      mismatches.push({
        id: item.id,
        expected: item.expectedOutcome,
        predicted: result.overall,
        note: item.note
      });
    }
    if (item.dangerousIfMissed && result.overall === 'noneKnownInSources') dangerousMisses += 1;
    if (result.overall === 'insufficientInformation') abstentions += 1;
  }

  return {
    total: goldSet.length,
    dangerousMisses,
    abstentionRate: abstentions / goldSet.length,
    byOutcome,
    mismatches
  };
};

const report = runGoldSet();
const lines = [
  `# Gold set v0 report`,
  ``,
  `Items: ${report.total}`,
  `Dangerous misses (known/possible expected, noneKnown predicted): ${report.dangerousMisses}`,
  `Abstention rate: ${(report.abstentionRate * 100).toFixed(1)}%`,
  ``,
  `| Outcome | Expected | Predicted | Correct |`,
  `|---|---:|---:|---:|`,
  ...Object.entries(report.byOutcome).map(
    ([outcome, row]) => `| ${outcome} | ${row.expected} | ${row.predicted} | ${row.correct} |`
  ),
  ``,
  report.mismatches.length ? `Mismatches:` : `No mismatches.`,
  ...report.mismatches.map((row) => `- ${row.id}: expected ${row.expected}, got ${row.predicted} (${row.note})`)
];

console.log(lines.join('\n'));

if (report.dangerousMisses > 0) {
  process.exitCode = 1;
}
