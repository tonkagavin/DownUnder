import type { AgeBand } from '@downunder/types';

export const ageBandFromYears = (ageYears: number | null | undefined): AgeBand => {
  if (ageYears == null) return 'unknown';
  return ageYears >= 35 ? 'age35Plus' : 'under35';
};
