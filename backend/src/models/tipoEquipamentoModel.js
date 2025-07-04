import { getDb } from './db.js';

export async function getAllTiposEquipamento() {
  const db = await getDb();
  return db.all('SELECT * FROM tipos_equipamento');
}

export async function createTipoEquipamento(nome) {
  const db = await getDb();
  const result = await db.run('INSERT INTO tipos_equipamento (nome) VALUES (?)', [nome]);
  return { id: result.lastID, nome };
}

export async function updateTipoEquipamento(id, nome) {
  const db = await getDb();
  await db.run('UPDATE tipos_equipamento SET nome = ? WHERE id = ?', [nome, id]);
  return { id, nome };
}

export async function deleteTipoEquipamento(id) {
  const db = await getDb();
  await db.run('DELETE FROM tipos_equipamento WHERE id = ?', [id]);
  return true;
}
