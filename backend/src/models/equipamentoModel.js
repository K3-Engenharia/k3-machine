import { getDb } from './db.js';

export function createEquipamento(equip) {
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO equipamentos (empresa_id, nome, tipo, modelo, fabricante, potencia, corrente_nominal, tensao_nominal, local_instalado, tag_planta, data_instalacao, anexo, status, rolamento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    equip.empresa_id, equip.nome, equip.tipo, equip.modelo, equip.fabricante, equip.potencia, equip.corrente_nominal, equip.tensao_nominal, equip.local_instalado, equip.tag_planta, equip.data_instalacao, equip.anexo, equip.status || 'Em Operação', equip.rolamento
  );
  return { id: result.lastInsertRowid, ...equip };
}

export function listEquipamentos({ empresa_id, empresas } = {}) {
  const db = getDb();
  if (empresas && Array.isArray(empresas) && empresas.length > 0) {
    const placeholders = empresas.map(() => '?').join(',');
    return db.prepare(`SELECT * FROM equipamentos WHERE empresa_id IN (${placeholders}) ORDER BY created_at DESC`).all(...empresas);
  }
  if (empresa_id) {
    return db.prepare('SELECT * FROM equipamentos WHERE empresa_id = ? ORDER BY created_at DESC').all(empresa_id);
  }
  return db.prepare('SELECT * FROM equipamentos ORDER BY created_at DESC').all();
}

export function getEquipamentoById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(id);
}

export function updateEquipamento(id, equip) {
  const db = getDb();
  db.prepare(
    `UPDATE equipamentos SET empresa_id=?, nome=?, tipo=?, modelo=?, fabricante=?, potencia=?, corrente_nominal=?, tensao_nominal=?, local_instalado=?, tag_planta=?, data_instalacao=?, anexo=?, status=?, rolamento=? WHERE id=?`
  ).run(
    equip.empresa_id, equip.nome, equip.tipo, equip.modelo, equip.fabricante, equip.potencia, equip.corrente_nominal, equip.tensao_nominal, equip.local_instalado, equip.tag_planta, equip.data_instalacao, equip.anexo, equip.status, equip.rolamento, id
  );
  return getEquipamentoById(id);
}

export function deleteEquipamento(id) {
  const db = getDb();
  db.prepare('DELETE FROM equipamentos WHERE id = ?').run(id);
}
