import { getDb } from './db.js';

export async function createEquipamento(equip) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO equipamentos (empresa_id, nome, tipo, modelo, fabricante, potencia, corrente_nominal, tensao_nominal, local_instalado, tag_planta, data_instalacao, anexo, status, rolamento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [equip.empresa_id, equip.nome, equip.tipo, equip.modelo, equip.fabricante, equip.potencia, equip.corrente_nominal, equip.tensao_nominal, equip.local_instalado, equip.tag_planta, equip.data_instalacao, equip.anexo, equip.status || 'Em Operação', equip.rolamento]
  );
  return { id: result.lastID, ...equip };
}

export async function listEquipamentos({ empresa_id } = {}) {
  const db = await getDb();
  if (empresa_id) {
    return db.all('SELECT * FROM equipamentos WHERE empresa_id = ? ORDER BY created_at DESC', [empresa_id]);
  }
  return db.all('SELECT * FROM equipamentos ORDER BY created_at DESC');
}

export async function getEquipamentoById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM equipamentos WHERE id = ?', [id]);
}

export async function updateEquipamento(id, equip) {
  const db = await getDb();
  await db.run(
    `UPDATE equipamentos SET empresa_id=?, nome=?, tipo=?, modelo=?, fabricante=?, potencia=?, corrente_nominal=?, tensao_nominal=?, local_instalado=?, tag_planta=?, data_instalacao=?, anexo=?, status=?, rolamento=? WHERE id=?`,
    [equip.empresa_id, equip.nome, equip.tipo, equip.modelo, equip.fabricante, equip.potencia, equip.corrente_nominal, equip.tensao_nominal, equip.local_instalado, equip.tag_planta, equip.data_instalacao, equip.anexo, equip.status, equip.rolamento, id]
  );
  return getEquipamentoById(id);
}

export async function deleteEquipamento(id) {
  const db = await getDb();
  await db.run('DELETE FROM equipamentos WHERE id = ?', [id]);
}
