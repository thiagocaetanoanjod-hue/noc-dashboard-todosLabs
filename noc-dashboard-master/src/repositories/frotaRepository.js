// src/repositories/frotaRepository.js
import db from '../config/database.js';

class FrotaRepository {
  // READ com limite de segurança para proteger a interface gráfica
  listarTodos(limite = 500) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM frota ORDER BY RANDOM() LIMIT ?', [limite], (err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }

  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM frota WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        return resolve(row);
      });
    });
  }

  criar(veiculo) {
    return new Promise((resolve, reject) => {
      const { id, modelo, tipo, vel, latitude, longitude } = veiculo;
      const query = 'INSERT INTO frota (id, modelo, tipo, vel, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)';
      
      db.run(query, [id, modelo, tipo, vel, latitude, longitude], (err) => {
        if (err) return reject(err);
        return resolve({ id, modelo, tipo, vel, latitude, longitude });
      });
    });
  }

  atualizar(id, dados) {
    return new Promise((resolve, reject) => {
      const { vel, latitude, longitude } = dados;
      const query = 'UPDATE frota SET vel = ?, latitude = ?, longitude = ?, ultima_atualizacao = CURRENT_TIMESTAMP WHERE id = ?';
      
      // Mantida a função tradicional (function) para preservar o escopo do 'this' do SQLite
      db.run(query, [vel, latitude, longitude, id], function (err) {
        if (err) return reject(err);
        return resolve(this.changes);
      });
    });
  }

  deletar(id) {
    return new Promise((resolve, reject) => {
      // Mantida a função tradicional (function) para preservar o escopo do 'this' do SQLite
      db.run('DELETE FROM frota WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        return resolve(this.changes);
      });
    });
  }
}

export default new FrotaRepository();
