export type RiskLevel = 'High' | 'Caution' | 'Low' | 'Unknown';

export type Profile = {
  id: number;
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  smoker: boolean;
  conditionsNotes: string;
  birthControlMethodId: number | null;
};

export type ProfileMedication = {
  id: number;
  name: string;
  rxcui: string | null;
  className: string;
};
