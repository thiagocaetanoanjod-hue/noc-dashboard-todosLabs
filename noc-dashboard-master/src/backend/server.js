// backend/server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'node:url';

const app = express();
const port = globalThis.process.env.PORT || 3000;

const origensPermitidas = (globalThis.process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origem, callback) => {
    if (!origem || origensPermitidas.includes(origem)) return callback(null, true);
    return callback(new Error('Origem não autorizada pelo CORS.'));
  },
}));
app.use(express.json());

const databasePath = fileURLToPath(new URL('./noc_database.sqlite', import.meta.url));
const db = new sqlite3.Database(databasePath);

// Endpoint de leitura que consolida infraestrutura, base NOC e frota.
app.get('/api/dados', (req, res) => {
  const payload = { infraestrutura: [], frota: [], noc: {} };

  // IDs 1 a 5 são os links de infraestrutura; ID 0 é a Base NOC.
  db.all('SELECT * FROM infraestrutura WHERE id > 0', [], (err, rowsInfra) => {
    if (err) return res.status(500).json({ error: err.message });
    payload.infraestrutura = rowsInfra;

    db.get('SELECT latitude, longitude FROM infraestrutura WHERE id = 0', [], (err, rowNoc) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rowNoc) payload.noc = rowNoc;

      db.all('SELECT * FROM frota', [], (err, rowsFrota) => {
        if (err) return res.status(500).json({ error: err.message });
        payload.frota = rowsFrota;
        res.json(payload);
      });
    });
  });
});

// Rastreadores enviam atualizações de posição e velocidade para este endpoint.
app.put('/api/telemetria/:id', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, vel } = req.body;
  const query = `UPDATE frota
    SET latitude = ?, longitude = ?, vel = ?, ultima_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?`;

  db.run(query, [latitude, longitude, vel, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      message: 'Coordenadas do veículo atualizadas no SQL!',
      linhasAfetadas: this.changes
    });
  });
});

app.listen(port, () => {
  console.log(`API do NOC rodando perfeitamente em http://localhost:${port}`);
});
