import { getDb } from './db.js';

export function criarAgendamento(equipamento_id, agendamento) {
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO agendamentos (equipamento_id, data_hora, tempo_estimado, responsavel, checklist, observacoes, periodicidade, proximo_agendamento, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    equipamento_id,
    agendamento.data_hora,
    agendamento.tempo_estimado,
    agendamento.responsavel,
    agendamento.checklist,
    agendamento.observacoes,
    agendamento.periodicidade,
    calcularProximoAgendamento(agendamento.data_hora, agendamento.periodicidade),
    'Agendado'

  );
  return { id: result.lastInsertRowid, ...agendamento };
}

function calcularProximoAgendamento(data_hora, periodicidade) {
  if (!data_hora || !periodicidade) return null;
  const data = new Date(data_hora);
  if (periodicidade.includes('mes')) {
    const meses = parseInt(periodicidade);
    data.setMonth(data.getMonth() + meses);
    return data.toISOString().slice(0, 16);
  }
  if (periodicidade.includes('1000h')) {
    data.setHours(data.getHours() + 1000);
    return data.toISOString().slice(0, 16);
  }
  return null;
}

export function getProximoAgendamentoPorEquipamento(equipamento_id) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM agendamentos WHERE equipamento_id = ? AND status = 'Agendado' AND data_hora >= datetime('now') ORDER BY data_hora ASC LIMIT 1`
  ).get(equipamento_id);
}

export function contarProximasIntervencoes(empresas = null) {
  const db = getDb();
  let query = `SELECT COUNT(a.id) as total FROM agendamentos a JOIN equipamentos e ON a.equipamento_id = e.id WHERE a.status = 'Agendado' AND a.data_hora >= datetime('now')`;
  const params = [];

  if (empresas && Array.isArray(empresas) && empresas.length > 0) {
    const placeholders = empresas.map(() => '?').join(',');
    query += ` AND e.empresa_id IN (${placeholders})`;
    params.push(...empresas);
  }
  const row = db.prepare(query).get(...params);
  return row ? row.total : 0;
}

export function listarAgendamentosPorEquipamento(equipamento_id) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM agendamentos WHERE equipamento_id = ? ORDER BY data_hora DESC`
  ).all(equipamento_id);
}

export function atualizarAgendamento(id, agendamento) {
  const db = getDb();
  db.prepare(
    `UPDATE agendamentos SET data_hora=?, tempo_estimado=?, responsavel=?, checklist=?, observacoes=?, periodicidade=?, proximo_agendamento=? WHERE id=?`
  ).run(
    agendamento.data_hora,
    agendamento.tempo_estimado,
    agendamento.responsavel,
    agendamento.checklist,
    agendamento.observacoes,
    agendamento.periodicidade,
    agendamento.proximo_agendamento,
    id
  );
  return db.prepare('SELECT * FROM agendamentos WHERE id = ?').get(id);
}

export function atualizarStatusAgendamento(id, status) {
  const db = getDb();
  db.prepare(
    `UPDATE agendamentos SET status=? WHERE id=?`
  ).run(status, id);
  return db.prepare('SELECT * FROM agendamentos WHERE id = ?').get(id);
}

export function contarEquipamentosPreventivaEmDia(empresas = null) {
  const db = getDb();
  let query = `
    SELECT COUNT(e.id) as total FROM equipamentos e
    WHERE NOT EXISTS (
      SELECT 1 FROM agendamentos a
      WHERE a.equipamento_id = e.id
        AND a.status = 'Agendado'
        AND datetime(a.data_hora) < datetime('now')
    )
  `;
  const params = [];

  if (empresas && Array.isArray(empresas) && empresas.length > 0) {
    const placeholders = empresas.map(() => '?').join(',');
    query += ` AND e.empresa_id IN (${placeholders})`;
    params.push(...empresas);
  }
  const row = db.prepare(query).get(...params);
  return row ? row.total : 0;
}
