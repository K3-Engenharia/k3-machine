// backend/src/models/localInstaladoModel.js
import { getDb } from './db.js';


async function getAllLocaisInstalados(empresa_id) {
  const db = await getDb();
  if (empresa_id) {
    return db.all('SELECT * FROM locais_instalados WHERE empresa_id = ?', [empresa_id]);
  } else {
    return db.all('SELECT * FROM locais_instalados');
  }
}


async function createLocalInstalado(nome, empresa_id) {
  const db = await getDb();
  const result = await db.run('INSERT INTO locais_instalados (nome, empresa_id) VALUES (?, ?)', [nome, empresa_id]);
  return { id: result.lastID, nome, empresa_id };
}


async function updateLocalInstalado(id, nome) {
  const db = await getDb();
  await db.run('UPDATE locais_instalados SET nome = ? WHERE id = ?', [nome, id]);
  return { id, nome };
}


async function deleteLocalInstalado(id) {
  const db = await getDb();
  await db.run('DELETE FROM locais_instalados WHERE id = ?', [id]);
}

export default {
  getAllLocaisInstalados,
  createLocalInstalado,
  updateLocalInstalado,
  deleteLocalInstalado,
};
