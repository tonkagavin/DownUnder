export type Profile = {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  smoker: boolean;
  conditionsNotes: string;
  birthControlMethodId: number | null;
};

export type MedicationSearchResult = {
  name: string;
  rxcui: string;
  tty: string;
};

export type InteractionResponse = {
  checkedMedication: string;
  birthControl: string;
  comparedWithProfileMeds: string[];
  riskLevel: 'High' | 'Caution' | 'Low' | 'Unknown';
  summary: string;
  disclaimers: string[];
  sources: string[];
};
