import { getDb } from './db.js';

export function getAllTiposEquipamento() {
  const db = getDb();
  return db.prepare('SELECT * FROM tipos_equipamento').all();
}

export function createTipoEquipamento(nome) {
  const db = getDb();
  const result = db.prepare('INSERT INTO tipos_equipamento (nome) VALUES (?)').run(nome);
  return { id: result.lastInsertRowid, nome };
}

export function updateTipoEquipamento(id, nome) {
  const db = getDb();
  db.prepare('UPDATE tipos_equipamento SET nome = ? WHERE id = ?').run(nome, id);
  return { id, nome };
}

export function deleteTipoEquipamento(id) {
  const db = getDb();
  db.prepare('DELETE FROM tipos_equipamento WHERE id = ?').run(id);
  return true;
}
