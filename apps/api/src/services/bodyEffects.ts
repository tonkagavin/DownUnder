import type { BodyEffect, LabelSections, NormalizedMedication } from '@downunder/types';
import type { LabelStatus } from '@downunder/rules';

const SECTIONS: { key: keyof LabelSections; title: string }[] = [
  { key: 'drugInteractions', title: 'With birth control' },
  { key: 'boxedWarning', title: 'Boxed warning' },
  { key: 'adverseReactions', title: 'Adverse reactions' },
  { key: 'warningsAndCautions', title: 'Warnings' },
  { key: 'contraindications', title: 'Do not use if' }
];

const METHOD_LINK =
  /contracept|birth control|hormonal|ethinyl|estradiol|progestin|backup method|barrier method|enzyme induc|intrauterine|iud|implant|vaginal ring|combined pill|mini-?pill|menstrual/i;

const NOT_AN_EFFECT = /no (hormonal )?contraceptive interaction|no adverse effect|is not described|none (known|described)/i;

const sentences = (text: string): string[] => {
  const clean = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = clean
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 20);
  if (parts.length > 0) return parts;
  return clean.length > 20 ? [clean] : [];
};

export const collectBodyEffects = (
  medications: NormalizedMedication[],
  labels: Map<string, { status: LabelStatus; label: LabelSections | null }>,
  scope: 'method' | 'label' = 'label'
): BodyEffect[] => {
  const out: BodyEffect[] = [];
  const seen = new Set<string>();

  for (const med of medications) {
    if (seen.has(med.displayName.toLowerCase())) continue;
    seen.add(med.displayName.toLowerCase());

    if (!med.resolved || med.ingredientRxcuis.length === 0) {
      out.push({
        medicationName: med.displayName,
        section: 'Adverse reactions',
        effects: [],
        setId: null,
        source: 'FDA label',
        note: `We could not match ${med.displayName} to a label, so we cannot list its adverse effects. That does not mean it has none. Ask a pharmacist.`
      });
      continue;
    }

    const label = med.ingredientRxcuis.map((rxcui) => labels.get(rxcui)?.label).find(Boolean) ?? null;
    const status = med.ingredientRxcuis.map((rxcui) => labels.get(rxcui)?.status).find((item) => item && item !== 'missing');
    const source = label?.setId.startsWith('demo-') ? 'FDA label (demo excerpt)' : 'FDA label';

    if (!label) {
      out.push({
        medicationName: med.displayName,
        section: 'Adverse reactions',
        effects: [],
        setId: null,
        source: 'FDA label',
        note:
          status === 'failed'
            ? `We could not read the label for ${med.displayName}. That does not mean it has no adverse effects. Ask a pharmacist.`
            : `No adverse-effect list for ${med.displayName} was in the sources we could read. That does not mean it has none. Ask a pharmacist.`
      });
      continue;
    }

    let any = false;
    for (const section of SECTIONS) {
      const text = label[section.key];
      if (typeof text !== 'string' || !text.trim()) continue;
      const effects = sentences(text).filter((line) => scope === 'label' || (METHOD_LINK.test(line) && !NOT_AN_EFFECT.test(line)));
      if (effects.length === 0) continue;
      any = true;
      out.push({
        medicationName: med.displayName,
        section: section.title,
        effects,
        setId: label.setId,
        source,
        note:
          scope === 'method'
            ? 'The label ties this to birth control or to this kind of method. It is not a prediction, and it is not the rest of the label.'
            : 'Reported on the label for this medicine, including effects that have nothing to do with birth control. This is not a prediction of what will happen to you.'
      });
    }

    if (!any && scope === 'label') {
      out.push({
        medicationName: med.displayName,
        section: 'Adverse reactions',
        effects: [],
        setId: label.setId,
        source,
        note: `The label we have for ${med.displayName} does not include an adverse-effect list. That does not mean the medicine has none. Ask a pharmacist.`
      });
    }
  }

  return out;
};
