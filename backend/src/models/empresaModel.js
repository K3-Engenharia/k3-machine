import { getDb } from '../models/db.js';

export function createEmpresa(nome) {
  const db = getDb();
  const result = db.prepare('INSERT INTO empresas (nome) VALUES (?)').run(nome);
  return { id: result.lastInsertRowid, nome };
}

export function listEmpresas() {
  const db = getDb();
  return db.prepare('SELECT * FROM empresas ORDER BY nome').all();
}

export function getEmpresaById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM empresas WHERE id = ?').get(id);
}
