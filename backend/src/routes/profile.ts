import { Router } from 'express';
import { z } from 'zod';
import { getDb, saveDb } from '../lib/db.js';

export const profileRouter = Router();

const profileSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(12).max(60),
  heightCm: z.number().min(100).max(230),
  weightKg: z.number().min(30).max(250),
  smoker: z.boolean(),
  conditionsNotes: z.string().max(500).default(''),
  birthControlMethodId: z.number().int().nullable()
});

profileRouter.get('/', async (_req, res) => {
  const db = await getDb();
  const rows = db.exec('SELECT * FROM profile WHERE id = 1;');
  const bcRows = db.exec('SELECT birthControlMethodId FROM profileBirthControl WHERE profileId = 1;');
  const medsRows = db.exec('SELECT id, name, rxcui, className FROM profileMedications ORDER BY name;');

  if (rows.length === 0) {
    return res.json({ profile: null, medications: [] });
  }

  const profileValues = rows[0].values[0];
  const profile = {
    id: Number(profileValues[0]),
    name: String(profileValues[1]),
    age: Number(profileValues[2]),
    heightCm: Number(profileValues[3]),
    weightKg: Number(profileValues[4]),
    smoker: Boolean(profileValues[5]),
    conditionsNotes: String(profileValues[6] ?? ''),
    birthControlMethodId: bcRows.length ? Number(bcRows[0].values[0][0]) : null
  };

  const medications = medsRows.length
    ? medsRows[0].values.map((row: any[]) => ({
        id: Number(row[0]),
        name: String(row[1]),
        rxcui: row[2] ? String(row[2]) : null,
        className: String(row[3] ?? '')
      }))
    : [];

  return res.json({ profile, medications });
});

profileRouter.put('/', async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid profile payload.' });
  }

  const body = parsed.data;
  const db = await getDb();

  db.run('DELETE FROM profile WHERE id = 1;');
  db.run('DELETE FROM profileBirthControl WHERE profileId = 1;');

  db.run(
    'INSERT INTO profile (id, name, age, heightCm, weightKg, smoker, conditionsNotes) VALUES (1, ?, ?, ?, ?, ?, ?);',
    [body.name, body.age, body.heightCm, body.weightKg, body.smoker ? 1 : 0, body.conditionsNotes]
  );

  if (body.birthControlMethodId) {
    db.run('INSERT INTO profileBirthControl (profileId, birthControlMethodId) VALUES (1, ?);', [body.birthControlMethodId]);
  }

  saveDb();
  return res.json({ ok: true });
});

profileRouter.post('/medications', async (req, res) => {
  const schema = z.object({ name: z.string().min(1), rxcui: z.string().optional(), className: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid medication payload.' });
  }

  const db = await getDb();
  db.run('INSERT INTO profileMedications (name, rxcui, className) VALUES (?, ?, ?);', [
    parsed.data.name,
    parsed.data.rxcui ?? null,
    parsed.data.className ?? ''
  ]);
  saveDb();
  return res.json({ ok: true });
});

profileRouter.delete('/medications/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid medication id.' });

  const db = await getDb();
  db.run('DELETE FROM profileMedications WHERE id = ?;', [id]);
  saveDb();
  return res.json({ ok: true });
});
