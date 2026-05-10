export const birthControlSeed = [
  { name: 'Combined Oral Contraceptive Pill', category: 'pill', defaultRiskNote: 'Some medications can reduce efficacy.', rxcui: '259255' },
  { name: 'Progestin-Only Pill', category: 'pill', defaultRiskNote: 'Check enzyme-inducing medications.', rxcui: '316047' },
  { name: 'Hormonal IUD', category: 'iud', defaultRiskNote: 'Generally fewer systemic interactions.', rxcui: null },
  { name: 'Copper IUD', category: 'iud', defaultRiskNote: 'No hormone interactions expected.', rxcui: null },
  { name: 'Birth Control Patch', category: 'patch', defaultRiskNote: 'May be affected by enzyme inducers.', rxcui: '753542' },
  { name: 'Vaginal Ring', category: 'ring', defaultRiskNote: 'May be affected by enzyme inducers.', rxcui: '748856' },
  { name: 'Depo-Provera Shot', category: 'injection', defaultRiskNote: 'Discuss interaction concerns with clinician.', rxcui: '1011752' },
  { name: 'Implant', category: 'implant', defaultRiskNote: 'Some anticonvulsants may lower efficacy.', rxcui: null }
];

export const commonMedsSeed = [
  { name: 'Ibuprofen', className: 'NSAID' },
  { name: 'Acetaminophen', className: 'Analgesic' },
  { name: 'Amoxicillin', className: 'Antibiotic' },
  { name: 'Doxycycline', className: 'Antibiotic' },
  { name: 'Sertraline', className: 'SSRI' },
  { name: 'Fluoxetine', className: 'SSRI' },
  { name: 'Lamotrigine', className: 'Anticonvulsant' },
  { name: 'Carbamazepine', className: 'Anticonvulsant' },
  { name: 'St Johns Wort', className: 'Supplement' },
  { name: 'Rifampin', className: 'Antibiotic' }
];
