// src/backend/migracao.js
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'node:url';

const databasePath = fileURLToPath(new URL('./noc_database.sqlite', import.meta.url));
const db = new sqlite3.Database(databasePath);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const all = (sql) => new Promise((resolve, reject) => {
  db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
});

try {
  await run(`CREATE TABLE IF NOT EXISTS infraestrutura (
    id INTEGER PRIMARY KEY,
    tipo TEXT,
    target TEXT,
    latencia TEXT,
    latitude TEXT,
    longitude TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS frota (
    id TEXT PRIMARY KEY,
    modelo TEXT,
    tipo TEXT,
    vel TEXT,
    latitude TEXT,
    longitude TEXT,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Atualiza bancos criados antes da funcionalidade de geolocalização.
  const colunasFrota = new Set((await all('PRAGMA table_info(frota)')).map(({ name }) => name));
  if (!colunasFrota.has('latitude')) await run('ALTER TABLE frota ADD COLUMN latitude TEXT');
  if (!colunasFrota.has('longitude')) await run('ALTER TABLE frota ADD COLUMN longitude TEXT');
  if (!colunasFrota.has('ultima_atualizacao')) {
    await run('ALTER TABLE frota ADD COLUMN ultima_atualizacao DATETIME');
  }

  const colunasInfra = new Set((await all('PRAGMA table_info(infraestrutura)')).map(({ name }) => name));
  if (!colunasInfra.has('latitude')) await run('ALTER TABLE infraestrutura ADD COLUMN latitude TEXT');
  if (!colunasInfra.has('longitude')) await run('ALTER TABLE infraestrutura ADD COLUMN longitude TEXT');

  // Converte as coordenadas legadas no formato "latitude, longitude", quando existirem.
  const possuiGpsLegado = (await all('PRAGMA table_info(frota)')).some(({ name }) => name === 'gps');
  if (possuiGpsLegado) {
    await run(`UPDATE frota
      SET latitude = TRIM(SUBSTR(gps, 1, INSTR(gps, ',') - 1)),
          longitude = TRIM(SUBSTR(gps, INSTR(gps, ',') + 1))
      WHERE gps IS NOT NULL
        AND INSTR(gps, ',') > 0
        AND (latitude IS NULL OR longitude IS NULL)`);
  }

  // Cria a Base NOC somente caso ela ainda não exista.
  await run(`INSERT OR IGNORE INTO infraestrutura
    (id, tipo, target, latencia, latitude, longitude)
    VALUES (0, 'Base NOC', 'SENAI SP Vila Leopoldina', '0ms', '-23.5315', '-46.7358')`);

  const infraestruturaInicial = [
    [1, 'Link VSAT (Hub Principal)', 'Satélite Star One D2', '580ms'],
    [2, 'Link VSAT (BGAN Backup)', 'Satélite Inmarsat', '850ms'],
    [3, 'Roteamento OSPF', 'Core Interno (10.0.0.1)', '2ms'],
    [4, 'Sessão BGP', 'Operadora AS-1042', '12ms'],
    [5, 'Link LTE-Móvel', 'Antena Celular ERB', '45ms']
  ];
  for (const linha of infraestruturaInicial) {
    await run('INSERT OR IGNORE INTO infraestrutura (id, tipo, target, latencia) VALUES (?, ?, ?, ?)', linha);
  }

  const frotaInicial = [
    ['V-01', '🚌', 'Ônibus', '85', '-23.5500', '-46.6333'],
    ['V-02', '🚚', 'Caminhão', '70', '-22.9000', '-43.2000'],
    ['V-03', '🏍', 'Moto', '110', '-19.9200', '-43.9300'],
    ['V-04', '🚗', 'Carro', '110', '-25.4200', '-49.2700'],
    ['V-05', '🛻', 'Caminhonete', '80', '-30.0300', '-51.2300'],
    ['V-06', '🚐', 'Van', '75', '-15.7900', '-47.8800'],
    ['V-07', '🚙', 'SUV', '100', '-12.9700', '-38.5000'],
    ['V-08', '🏎', 'Esportivo', '140', '-03.1100', '-60.0200'],
    ['V-09', '🚜', 'Trator', '30', '-16.6800', '-49.2500'],
    ['V-10', '🚑', 'Ambulância', '120', '-20.3100', '-40.3100']
  ];
  for (const veiculo of frotaInicial) {
    await run(`INSERT OR IGNORE INTO frota
      (id, modelo, tipo, vel, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?)`, veiculo);
  }

  // Garante timestamp para registros anteriores à nova coluna.
  await run(`UPDATE frota
    SET ultima_atualizacao = CURRENT_TIMESTAMP
    WHERE ultima_atualizacao IS NULL`);

  console.log('Migração de geolocalização concluída!');
} catch (error) {
  console.error('Falha na migração:', error.message);
  globalThis.process.exitCode = 1;
} finally {
  db.close();
}
