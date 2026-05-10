import { Router } from 'express';
import { getDb } from '../lib/db.js';

export const catalogRouter = Router();

catalogRouter.get('/birth-control', async (_req, res) => {
  const db = await getDb();
  const rows = db.exec('SELECT id, name, category, defaultRiskNote, rxcui FROM birthControlMethods ORDER BY name;');
  const methods = rows.length
    ? rows[0].values.map((row: any[]) => ({
        id: Number(row[0]),
        name: String(row[1]),
        category: String(row[2]),
        defaultRiskNote: String(row[3]),
        rxcui: row[4] ? String(row[4]) : null
      }))
    : [];
  return res.json({ methods });
});

catalogRouter.get('/medications', async (_req, res) => {
  const db = await getDb();
  const rows = db.exec('SELECT id, name, className FROM medicationsCatalog ORDER BY name;');
  const medications = rows.length
    ? rows[0].values.map((row: any[]) => ({ id: Number(row[0]), name: String(row[1]), className: String(row[2]) }))
    : [];
  return res.json({ medications });
});
