import { Router } from 'express';
import { z } from 'zod';
import { getDb, saveDb } from '../lib/db.js';
import { getDrugLabelInteractions } from '../services/openfdaClient.js';
import { guidanceByRisk, scoreRiskFromTexts } from '../services/interactionEngine.js';
import { getInteractionsForRxcuis, searchMedicationByName } from '../services/rxnavClient.js';

export const interactionRouter = Router();

interactionRouter.get('/medications/search', async (req, res) => {
  const query = String(req.query.q ?? '').trim();
  if (query.length < 2) return res.json({ medications: [] });

  try {
    const medications = await searchMedicationByName(query);
    return res.json({ medications });
  } catch {
    return res.json({ medications: [] });
  }
});

interactionRouter.post('/check', async (req, res) => {
  const schema = z.object({ medicationName: z.string().min(2), medicationRxcui: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid interaction request payload.' });

  const db = await getDb();
  const profileRows = db.exec('SELECT id FROM profile WHERE id = 1;');
  if (!profileRows.length) return res.status(400).json({ error: 'Create your profile first.' });

  const bcRows = db.exec(
    'SELECT bcm.name, bcm.rxcui FROM profileBirthControl pbc JOIN birthControlMethods bcm ON bcm.id = pbc.birthControlMethodId WHERE pbc.profileId = 1;'
  );
  const profileMedsRows = db.exec('SELECT name, rxcui FROM profileMedications;');

  const searched = parsed.data;
  const searchedRxcui =
    searched.medicationRxcui ??
    (await searchMedicationByName(searched.medicationName)).find(
      (item: { name: string; rxcui: string }) => item.name.toLowerCase() === searched.medicationName.toLowerCase()
    )
      ?.rxcui;

  const bcName = bcRows.length ? String(bcRows[0].values[0][0]) : 'No birth control selected';
  const bcRxcui = bcRows.length ? (bcRows[0].values[0][1] ? String(bcRows[0].values[0][1]) : null) : null;

  const profileMeds = profileMedsRows.length
    ? profileMedsRows[0].values.map((row: any[]) => ({ name: String(row[0]), rxcui: row[1] ? String(row[1]) : null }))
    : [];

  const compareRxcuis = [searchedRxcui, bcRxcui, ...profileMeds.map((med: { rxcui: string | null }) => med.rxcui)].filter(
    Boolean
  ) as string[];

  let rxnavText = '';
  if (compareRxcuis.length >= 2) {
    const interactions = await getInteractionsForRxcuis(compareRxcuis);
    rxnavText = JSON.stringify(interactions);
  }

  const fdaText = await getDrugLabelInteractions(searched.medicationName);
  const mentionsBirthControl = fdaText.toLowerCase().includes('contracept') || fdaText.toLowerCase().includes('ethinyl estradiol');
  const mentionsProfileMeds = profileMeds.filter((med: { name: string }) =>
    fdaText.toLowerCase().includes(med.name.toLowerCase())
  );

  const riskLevel = scoreRiskFromTexts([
    rxnavText,
    mentionsBirthControl ? 'reduce contraceptive efficacy' : '',
    mentionsProfileMeds.length ? 'interaction monitor caution' : '',
    fdaText
  ]);

  const summary = guidanceByRisk(riskLevel);

  db.run('INSERT INTO interactionChecks (searchedMedication, checkedAt, riskLevel, summary) VALUES (?, ?, ?, ?);', [
    searched.medicationName,
    new Date().toISOString(),
    riskLevel,
    summary
  ]);
  saveDb();

  return res.json({
    checkedMedication: searched.medicationName,
    birthControl: bcName,
    comparedWithProfileMeds: profileMeds.map((med: { name: string }) => med.name),
    riskLevel,
    summary,
    disclaimers: [
      'This tool is educational and not a diagnosis.',
      'Always confirm medication safety with a licensed clinician or pharmacist.'
    ],
    sources: ['https://rxnav.nlm.nih.gov', 'https://open.fda.gov/apis/drug/label/']
  });
});
