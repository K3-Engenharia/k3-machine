import { getDb } from '../models/db.js';

export async function createEmpresa(nome) {
  const db = await getDb();
  const result = await db.run('INSERT INTO empresas (nome) VALUES (?)', [nome]);
  return { id: result.lastID, nome };
}

export async function listEmpresas() {
  const db = await getDb();
  return db.all('SELECT * FROM empresas ORDER BY nome');
}

export async function getEmpresaById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM empresas WHERE id = ?', [id]);
}
