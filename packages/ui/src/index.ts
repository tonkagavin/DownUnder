import type { Outcome } from '@downunder/types';
import { NOT_MEDICAL_ADVICE } from '@downunder/types';

// Blush / berry / plum palette for a student-facing health app.
// Primary is dusty berry (pink, not neon). Secondary is plum for contrast
// and hierarchy. Outcome colors stay independent of the brand so risk is
// never "the pink button" (icon + label + distinct color, WCAG 2.2 AA).
export const tokens = {
  color: {
    bg: '#FBF3F6',
    surface: '#FFFFFF',
    surfaceMuted: '#F8E4EB',
    ink: '#3A2432',
    muted: '#7A4F5E',
    line: '#F0C9D6',
    accent: '#C13A66',
    accentDeep: '#8E2450',
    secondary: '#6B3A58',
    onAccent: '#FFFFFF',
    outcome: {
      knownInteraction: { bg: '#F8D9C8', ink: '#8A3210', icon: '!', label: 'Known interaction — act' },
      possibleInteraction: { bg: '#F7E6C4', ink: '#7A5208', icon: '!', label: 'Possible interaction — check' },
      noneKnownInSources: { bg: '#E4E0F2', ink: '#4A3D78', icon: 'i', label: 'No known interaction in our sources' },
      insufficientInformation: { bg: '#EBE4E6', ink: '#5A4A4E', icon: '?', label: 'Not enough information — ask a pharmacist' }
    }
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 12, md: 18, lg: 28, pill: 999 },
  type: { body: 16, small: 14, title: 22, display: 30 },
  target: 48
} as const;

export const outcomeCopy: Record<Outcome, { label: string; next: string }> = {
  knownInteraction: {
    label: 'Known interaction — act',
    next: 'Read what to do, then ask a pharmacist or clinician before changing anything.'
  },
  possibleInteraction: {
    label: 'Possible interaction — check',
    next: 'Check with a pharmacist before relying on your method alone.'
  },
  noneKnownInSources: {
    label: 'No known interaction in our sources',
    next: 'Keep using your method as directed. Ask if anything changes.'
  },
  insufficientInformation: {
    label: 'Not enough information — ask a pharmacist',
    next: 'Ask a pharmacist. This does not mean the combination is fine.'
  }
};

export const disclaimers = {
  notMedicalAdvice: NOT_MEDICAL_ADVICE,
  scope: 'DownUnder checks birth control against other medications. It does not check every drug against every drug.',
  neverSafe: 'A result of “no known interaction in our sources” is not the same as “safe”.'
};

export const teachBackOptions = [
  { id: 'barrier', label: 'Use condoms too' },
  { id: 'pharmacist', label: 'Talk to a pharmacist' },
  { id: 'prescriber', label: 'Ask my prescriber' }
] as const;

export const whatWeStore = [
  'your birth control method',
  'your other medication list',
  'your age',
  'whether you smoke',
  'a few eligibility facts you choose to share (migraine with aura, blood pressure, clot history, breastfeeding)',
  'your check results'
] as const;

export const methodVisual: Record<
  string,
  { glyph: string; short: string }
> = {
  chcPill: { glyph: 'Pi', short: 'Daily combined pill' },
  chcPatch: { glyph: 'Pa', short: 'Weekly patch' },
  chcRing: { glyph: 'Ri', short: 'Monthly ring' },
  pop: { glyph: 'Mi', short: 'Mini-pill' },
  otcNorgestrel: { glyph: 'Op', short: 'Opill, no prescription' },
  implant: { glyph: 'Im', short: 'Arm implant' },
  dmpa: { glyph: 'Sh', short: 'The shot' },
  lngIud: { glyph: 'IU', short: 'Hormonal IUD' },
  copperIud: { glyph: 'Cu', short: 'Copper IUD' },
  none: { glyph: 'No', short: 'No method right now' },
  notSure: { glyph: '?', short: 'Not sure yet' }
};
