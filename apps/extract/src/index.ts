import type { ExtractionStatement, ExtractionStatementType } from '@downunder/types';

export const EXTRACT_MODEL_VERSION = 'pattern-classifier-0.1';

type Pattern = {
  type: ExtractionStatementType;
  re: RegExp;
};

const patterns: Pattern[] = [
  {
    type: 'reducesContraceptiveEfficacy',
    re: /reduc(e|es|ing) (the )?effectiveness of (hormonal )?contracept|decrease.{0,40}contracept|enzyme induc/i
  },
  {
    type: 'backupMethodRecommended',
    re: /additional (nonhormonal )?method of contraception|backup (contracept|method)|barrier method/i
  },
  {
    type: 'contraindicatedWithContraceptive',
    re: /contraindicated.{0,60}(ethinyl estradiol|hormonal contracept|oral contracept)/i
  },
  {
    type: 'contraceptionRequiredDuringUse',
    re: /effective contraception.{0,40}(required|recommended)|avoid pregnancy|two forms of contraception/i
  },
  {
    type: 'altersOtherDrugLevels',
    re: /oral contracept.{0,80}(decrease|increase|lower).{0,40}(lamotrigine|concentration|level)/i
  }
];

const sentences = (text: string): string[] =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 20);

export const classifyLabelText = (input: {
  setId: string;
  section: string;
  text: string;
}): ExtractionStatement[] => {
  const out: ExtractionStatement[] = [];
  for (const span of sentences(input.text)) {
    for (const pattern of patterns) {
      if (!pattern.re.test(span)) continue;
      out.push({
        setId: input.setId,
        section: input.section,
        span,
        statementType: pattern.type,
        score: 0.78,
        modelVersion: EXTRACT_MODEL_VERSION
      });
      break;
    }
  }
  return out;
};

export const mergeExtractionPolicy = (args: {
  hasKnownTableFinding: boolean;
  statements: ExtractionStatement[];
}): ExtractionStatement[] => {
  if (args.hasKnownTableFinding) return [];
  return args.statements.filter((statement) => statement.score >= 0.6);
};
