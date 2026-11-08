import { inducers, methods, reverseEffects, absorption, needsContraception } from '@downunder/rules-data';
import type { AskResponse, CheckResult } from '@downunder/types';
import { NOT_MEDICAL_ADVICE } from '@downunder/types';

const REFUSALS: { re: RegExp; reason: string; text: string }[] = [
  {
    re: /\b(diagnos|what do i have|is this cancer)\b/i,
    reason: 'diagnosis',
    text: 'DownUnder cannot diagnose. Ask a pharmacist or clinician about symptoms.'
  },
  {
    re: /\b(dose|how much should i take|mg)\b/i,
    reason: 'dosing',
    text: 'DownUnder cannot advise a dose. Ask a pharmacist or the prescriber.'
  },
  {
    re: /\b(should i stop|should i start|should i switch|get pregnant|abort)\b/i,
    reason: 'directive',
    text: 'DownUnder cannot tell you to start, stop, or switch a medicine or method. Ask a pharmacist or clinician.'
  },
  {
    re: /\b(911|overdose|poison|suicide|emergency)\b/i,
    reason: 'emergency',
    text: 'If this is an emergency, call 911 or poison control. DownUnder is not an emergency service.'
  }
];

type Row = {
  id: string;
  name: string;
  why: string;
  source: string;
  section: string;
};

const rows = (): Row[] => [
  ...inducers.map((row) => ({
    id: row.id,
    name: row.name,
    why: row.why,
    source: row.evidence[0]?.source ?? 'rules',
    section: row.evidence[0]?.section ?? ''
  })),
  ...reverseEffects.map((row) => ({
    id: row.id,
    name: row.name,
    why: row.why,
    source: row.evidence[0]?.source ?? 'rules',
    section: row.evidence[0]?.section ?? ''
  })),
  ...absorption.map((row) => ({
    id: row.id,
    name: row.name,
    why: row.why,
    source: row.evidence[0]?.source ?? 'rules',
    section: row.evidence[0]?.section ?? ''
  })),
  ...needsContraception.map((row) => ({
    id: row.id,
    name: row.name,
    why: row.why,
    source: row.evidence[0]?.source ?? 'rules',
    section: row.evidence[0]?.section ?? ''
  })),
  ...methods.map((row) => ({
    id: `method.${row.code}`,
    name: row.plainName,
    why: row.note,
    source: 'US_MEC_2024',
    section: 'methods'
  }))
];

export const answerQuestion = (question: string, check?: CheckResult): AskResponse => {
  for (const refusal of REFUSALS) {
    if (refusal.re.test(question)) {
      return {
        kind: 'refusal',
        text: refusal.text,
        citations: [],
        refusedReason: refusal.reason,
        notMedicalAdvice: NOT_MEDICAL_ADVICE
      };
    }
  }

  if (/\b(adverse|side effect|side effects|do to (me|my body|your body))\b/i.test(question) && check) {
    const listed = (check.bodyEffects ?? []).filter((item) => item.effects.length > 0);
    if (listed.length === 0) {
      return {
        kind: 'checkNarration',
        text: 'This check does not have an adverse-effect list from the label. That does not mean the medicine has no adverse effects. Ask a pharmacist.',
        citations: [],
        refusedReason: null,
        notMedicalAdvice: NOT_MEDICAL_ADVICE
      };
    }
    const text = listed
      .map((item) => `${item.medicationName} (${item.section}): ${item.effects.slice(0, 3).join(' ')}`)
      .join(' ');
    return {
      kind: 'checkNarration',
      text: `${text} These are effects the label reports. They are not a prediction for you, and they are separate from whether the medicine changes how well birth control works.`,
      citations: listed.map((item) => ({
        ruleId: null,
        source: item.source,
        section: item.section,
        setId: item.setId,
        quote: item.effects[0] ?? null
      })),
      refusedReason: null,
      notMedicalAdvice: NOT_MEDICAL_ADVICE
    };
  }

  if (/\b(my list|what i take|with what i take|my birth control|my pill)\b/i.test(question) && check) {
    return {
      kind: 'checkNarration',
      text: `${check.why} ${check.whatToDo}`,
      citations: check.findings.flatMap((finding) =>
        finding.evidence.map((item) => ({
          ruleId: item.ruleId,
          source: item.source,
          section: item.section,
          setId: item.setId,
          quote: item.quote
        }))
      ),
      refusedReason: null,
      notMedicalAdvice: NOT_MEDICAL_ADVICE
    };
  }

  const q = question.toLowerCase();
  const hits = rows().filter((row) => q.includes(row.name.toLowerCase()) || row.name.toLowerCase().split(' ').every((part) => q.includes(part)));
  if (!hits.length) {
    return {
      kind: 'refusal',
      text: 'I can only answer from our reviewed tables and from the adverse effects on a check you already ran. Try naming a medicine and a method, or ask about adverse effects after a check. For anything else, ask a pharmacist.',
      citations: [],
      refusedReason: 'outOfScope',
      notMedicalAdvice: NOT_MEDICAL_ADVICE
    };
  }

  const hit = hits[0];
  const method = methods.find((row) => q.includes(row.plainName.toLowerCase()) || q.includes(row.name.toLowerCase()));
  const text = hit.why.replace('{drug}', hit.name).replace('{method}', method?.plainName ?? 'hormonal method');
  return {
    kind: 'answer',
    text,
    citations: [
      {
        ruleId: hit.id,
        source: hit.source,
        section: hit.section,
        setId: null,
        quote: text
      }
    ],
    refusedReason: null,
    notMedicalAdvice: NOT_MEDICAL_ADVICE
  };
};
