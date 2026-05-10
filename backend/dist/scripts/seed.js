import { getDb, saveDb } from '../lib/db.js';
await getDb();
saveDb();
console.log('Seeded DownUnder SQLite database.');
