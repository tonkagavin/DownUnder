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
      text: 'I can only answer from our reviewed interaction tables and labels. Try naming a medicine and a method, or run a check against your profile. For anything else, ask a pharmacist.',
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
