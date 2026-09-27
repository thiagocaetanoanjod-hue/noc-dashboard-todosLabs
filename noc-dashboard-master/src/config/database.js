// src/config/database.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para recriar o __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ativa o modo verbose no sqlite3
const sqlite = sqlite3.verbose();

const dbPath = path.resolve(__dirname, '../../noc_bigdata.sqlite');

const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conexão estabelecida com o SQLite.');
  }
});

// Criação da tabela otimizada
db.run(`CREATE TABLE IF NOT EXISTS frota (
  id TEXT PRIMARY KEY,
  modelo TEXT,
  tipo TEXT,
  vel TEXT,
  latitude TEXT,
  longitude TEXT,
  ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

export default db;
