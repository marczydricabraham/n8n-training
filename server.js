const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(express.json());

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

app.get('/users', (req, res) => {
  res.json(readDb().users);
});

function deliver(collection, req, res) {
  const db = readDb();
  const record = {
    id: String(db[collection].length + 1),
    ...req.body,
    received_at: new Date().toISOString(),
  };
  db[collection].push(record);
  writeDb(db);
  res.status(201).json(record);
}

app.post('/crm', (req, res) => deliver('crm', req, res));
app.get('/crm', (req, res) => res.json(readDb().crm));
app.post('/analytics', (req, res) => deliver('analytics', req, res));
app.get('/analytics', (req, res) => res.json(readDb().analytics));

app.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`);
});