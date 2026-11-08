import type { HealthFacts, MethodCategory, Outcome } from '@downunder/types';

export type GoldItem = {
  id: string;
  medicationName: string;
  rxcui: string | null;
  resolved: boolean;
  methodCategory: MethodCategory;
  healthFacts?: Partial<HealthFacts>;
  profileMeds?: { name: string; rxcui: string }[];
  labelStatus: 'present' | 'missing' | 'failed';
  expectedOutcome: Outcome;
  expectedDirection?: string;
  dangerousIfMissed: boolean;
  note: string;
};

const base: HealthFacts = {
  ageYears: 22,
  ageBand: 'under35',
  smoker: false,
  bmiBand: 'under30',
  conditionFlags: []
};

export const defaultFacts = base;

export const goldSet: GoldItem[] = [
  { id: 'g1', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', expectedDirection: 'medReducesMethodEfficacy', dangerousIfMissed: true, note: 'strong inducer vs CHC' },
  { id: 'g2', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'chcPatch', labelStatus: 'present', expectedOutcome: 'knownInteraction', expectedDirection: 'medReducesMethodEfficacy', dangerousIfMissed: true, note: 'strong inducer vs patch' },
  { id: 'g3', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'chcRing', labelStatus: 'present', expectedOutcome: 'knownInteraction', expectedDirection: 'medReducesMethodEfficacy', dangerousIfMissed: true, note: 'strong inducer vs ring' },
  { id: 'g4', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'pop', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer vs POP' },
  { id: 'g5', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'implant', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer vs implant' },
  { id: 'g6', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'copperIud', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'IUD not affected' },
  { id: 'g7', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'lngIud', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'LNG IUD not affected' },
  { id: 'g8', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'dmpa', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'shot not affected' },
  { id: 'g9', medicationName: 'carbamazepine', rxcui: '2002', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g10', medicationName: 'phenytoin', rxcui: '8183', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g11', medicationName: 'phenobarbital', rxcui: '8134', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g12', medicationName: 'primidone', rxcui: '8691', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g13', medicationName: 'oxcarbazepine', rxcui: '32624', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g14', medicationName: 'topiramate', rxcui: '38404', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g15', medicationName: 'efavirenz', rxcui: '195085', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g16', medicationName: "St John's wort", rxcui: '285158', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'herbal inducer' },
  { id: 'g17', medicationName: 'griseofulvin', rxcui: '50852', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'possibleInteraction', dangerousIfMissed: false, note: 'weak inducer' },
  { id: 'g18', medicationName: 'bosentan', rxcui: '203591', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g19', medicationName: 'modafinil', rxcui: '30125', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'possibleInteraction', dangerousIfMissed: false, note: 'weak inducer' },
  { id: 'g20', medicationName: 'rifabutin', rxcui: '55672', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'inducer' },
  { id: 'g21', medicationName: 'lamotrigine', rxcui: '28439', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', expectedDirection: 'methodAltersMedLevels', dangerousIfMissed: true, note: 'reverse effect' },
  { id: 'g22', medicationName: 'lamotrigine', rxcui: '28439', resolved: true, methodCategory: 'copperIud', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'IUD does not lower lamotrigine' },
  { id: 'g23', medicationName: 'tirzepatide', rxcui: '2601723', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', expectedDirection: 'medImpairsMethodAbsorption', dangerousIfMissed: true, note: 'GLP-1 oral absorption' },
  { id: 'g24', medicationName: 'tirzepatide', rxcui: '2601723', resolved: true, methodCategory: 'lngIud', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'non-oral method' },
  { id: 'g25', medicationName: 'semaglutide', rxcui: '1991302', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'possibleInteraction', dangerousIfMissed: false, note: 'GLP-1 possible' },
  { id: 'g26', medicationName: 'orlistat', rxcui: '37925', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'possibleInteraction', dangerousIfMissed: false, note: 'absorption' },
  { id: 'g27', medicationName: 'isotretinoin', rxcui: '6064', resolved: true, methodCategory: 'none', labelStatus: 'present', expectedOutcome: 'knownInteraction', expectedDirection: 'medRequiresReliableContraception', dangerousIfMissed: true, note: 'iPLEDGE' },
  { id: 'g28', medicationName: 'mycophenolate', rxcui: '7145', resolved: true, methodCategory: 'none', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'REMS' },
  { id: 'g29', medicationName: 'valproate', rxcui: '11118', resolved: true, methodCategory: 'none', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'teratogen' },
  { id: 'g30', medicationName: 'methotrexate', rxcui: '6851', resolved: true, methodCategory: 'none', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'teratogen' },
  { id: 'g31', medicationName: 'amoxicillin', rxcui: '723', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'boring antibiotic' },
  { id: 'g32', medicationName: 'doxycycline', rxcui: '3640', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'boring antibiotic' },
  { id: 'g33', medicationName: 'ibuprofen', rxcui: '5640', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'boring NSAID' },
  { id: 'g34', medicationName: 'sertraline', rxcui: '36437', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'boring SSRI' },
  { id: 'g35', medicationName: 'acetaminophen', rxcui: '161', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'boring analgesic' },
  { id: 'g36', medicationName: 'cetirizine', rxcui: '20610', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'boring antihistamine' },
  { id: 'g37', medicationName: 'amoxicillin', rxcui: '723', resolved: true, methodCategory: 'chcPill', labelStatus: 'failed', expectedOutcome: 'insufficientInformation', dangerousIfMissed: false, note: 'fail-safe on label failure' },
  { id: 'g38', medicationName: 'unlabeled supplement', rxcui: null, resolved: false, methodCategory: 'chcPill', labelStatus: 'missing', expectedOutcome: 'insufficientInformation', dangerousIfMissed: false, note: 'unresolved supplement' },
  { id: 'g39', medicationName: 'rifampin', rxcui: '9384', resolved: true, methodCategory: 'otcNorgestrel', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'Opill is POP-like' },
  { id: 'g40', medicationName: 'carbamazepine', rxcui: '2002', resolved: true, methodCategory: 'copperIud', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'IUD not affected' },
  {
    id: 'g41',
    medicationName: 'amoxicillin',
    rxcui: '723',
    resolved: true,
    methodCategory: 'chcPill',
    labelStatus: 'present',
    expectedOutcome: 'knownInteraction',
    dangerousIfMissed: true,
    note: 'MEC smoking 35+',
    healthFacts: { ageYears: 36, ageBand: 'age35Plus', smoker: true }
  },
  {
    id: 'g42',
    medicationName: 'sertraline',
    rxcui: '36437',
    resolved: true,
    methodCategory: 'chcPill',
    labelStatus: 'present',
    expectedOutcome: 'knownInteraction',
    dangerousIfMissed: true,
    note: 'migraine with aura',
    healthFacts: { conditionFlags: ['migraineWithAura'] }
  },
  { id: 'g43', medicationName: 'ulipristal', rxcui: '1007672', resolved: true, methodCategory: 'chcPill', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'EC then hormonal' },
  { id: 'g44', medicationName: 'thalidomide', rxcui: '10432', resolved: true, methodCategory: 'none', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'REMS' },
  { id: 'g45', medicationName: 'modafinil', rxcui: '30125', resolved: true, methodCategory: 'copperIud', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'IUD not affected by weak inducer' },
  { id: 'g46', medicationName: 'efavirenz', rxcui: '195085', resolved: true, methodCategory: 'dmpa', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'shot not affected' },
  { id: 'g47', medicationName: 'griseofulvin', rxcui: '50852', resolved: true, methodCategory: 'implant', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'implant not in weak list' },
  { id: 'g48', medicationName: 'lamotrigine', rxcui: '28439', resolved: true, methodCategory: 'pop', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'POP does not lower lamotrigine in our table' },
  { id: 'g49', medicationName: 'tirzepatide', rxcui: '2601723', resolved: true, methodCategory: 'chcPatch', labelStatus: 'present', expectedOutcome: 'noneKnownInSources', dangerousIfMissed: false, note: 'patch is non-oral' },
  { id: 'g50', medicationName: 'isotretinoin', rxcui: '6064', resolved: true, methodCategory: 'notSure', labelStatus: 'present', expectedOutcome: 'knownInteraction', dangerousIfMissed: true, note: 'unknown method still flags needs-contraception' }
];
