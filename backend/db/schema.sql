CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  heightCm REAL NOT NULL,
  weightKg REAL NOT NULL,
  smoker INTEGER NOT NULL DEFAULT 0,
  conditionsNotes TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS birthControlMethods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  defaultRiskNote TEXT NOT NULL,
  rxcui TEXT
);

CREATE TABLE IF NOT EXISTS profileBirthControl (
  profileId INTEGER PRIMARY KEY,
  birthControlMethodId INTEGER NOT NULL,
  FOREIGN KEY (profileId) REFERENCES profile(id),
  FOREIGN KEY (birthControlMethodId) REFERENCES birthControlMethods(id)
);

CREATE TABLE IF NOT EXISTS medicationsCatalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  className TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profileMedications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  rxcui TEXT,
  className TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS interactionChecks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  searchedMedication TEXT NOT NULL,
  checkedAt TEXT NOT NULL,
  riskLevel TEXT NOT NULL,
  summary TEXT NOT NULL
);
