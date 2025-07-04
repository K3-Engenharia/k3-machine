// backend/src/models/localInstaladoModel.js
import { getDb } from './db.js';



function getAllLocaisInstalados(empresa_id) {
  const db = getDb();
  let locais;
  if (empresa_id) {
    locais = db.prepare('SELECT * FROM locais_instalados WHERE empresa_id = ?').all(empresa_id);
  } else {
    locais = db.prepare('SELECT * FROM locais_instalados').all();
  }
  return Array.isArray(locais) ? locais : [];
}



function createLocalInstalado(nome, empresa_id) {
  const db = getDb();
  const result = db.prepare('INSERT INTO locais_instalados (nome, empresa_id) VALUES (?, ?)').run(nome, empresa_id);
  return { id: result.lastInsertRowid, nome, empresa_id };
}



function updateLocalInstalado(id, nome) {
  const db = getDb();
  db.prepare('UPDATE locais_instalados SET nome = ? WHERE id = ?').run(nome, id);
  return { id, nome };
}



function deleteLocalInstalado(id) {
  const db = getDb();
  db.prepare('DELETE FROM locais_instalados WHERE id = ?').run(id);
}

export default {
  getAllLocaisInstalados,
  createLocalInstalado,
  updateLocalInstalado,
  deleteLocalInstalado,
};
