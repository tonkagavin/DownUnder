import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import initSqlJs from 'sql.js';
import { birthControlSeed, commonMedsSeed } from './seedData.js';

const backendRoot = process.cwd().endsWith('/backend') ? process.cwd() : path.resolve(process.cwd(), 'backend');
const dbFilePath = path.resolve(backendRoot, 'db/downunder.sqlite');
const schemaPath = path.resolve(backendRoot, 'db/schema.sql');

let dbInstance: any;

const ensureSeedData = () => {
  const bcCount = dbInstance.exec('SELECT COUNT(*) as count FROM birthControlMethods;')[0].values[0][0] as number;
  if (bcCount === 0) {
    const stmt = dbInstance.prepare(
      'INSERT INTO birthControlMethods (name, category, defaultRiskNote, rxcui) VALUES (?, ?, ?, ?);'
    );
    birthControlSeed.forEach((item) => stmt.run([item.name, item.category, item.defaultRiskNote, item.rxcui]));
    stmt.free();
  }

  const medCount = dbInstance.exec('SELECT COUNT(*) as count FROM medicationsCatalog;')[0].values[0][0] as number;
  if (medCount === 0) {
    const stmt = dbInstance.prepare('INSERT INTO medicationsCatalog (name, className) VALUES (?, ?);');
    commonMedsSeed.forEach((item) => stmt.run([item.name, item.className]));
    stmt.free();
  }
};

const persist = () => {
  const data = dbInstance.export();
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  fs.writeFileSync(dbFilePath, Buffer.from(data));
};

export const getDb = async () => {
  if (dbInstance) return dbInstance;

  const require = createRequire(import.meta.url);
  const wasmDir = path.dirname(require.resolve('sql.js/dist/sql-wasm.wasm'));

  const SQL = await initSqlJs({
    locateFile: (file: string) => path.resolve(wasmDir, file)
  });

  if (fs.existsSync(dbFilePath)) {
    const buffer = fs.readFileSync(dbFilePath);
    dbInstance = new SQL.Database(buffer);
  } else {
    dbInstance = new SQL.Database();
  }

  const schema = fs.readFileSync(schemaPath, 'utf8');
  dbInstance.run(schema);
  ensureSeedData();
  persist();
  return dbInstance;
};

export const saveDb = () => {
  if (dbInstance) persist();
};
