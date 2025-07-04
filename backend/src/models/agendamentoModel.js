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

export function contarProximasIntervencoes() {
  const db = getDb();
  const row = db.prepare(
    `SELECT COUNT(*) as total FROM agendamentos WHERE status = 'Agendado' AND data_hora >= datetime('now')`
  ).get();
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

export function contarEquipamentosPreventivaEmDia() {
  const db = getDb();
  // Conta quantos equipamentos NÃO possuem agendamento "Agendado" atrasado
  const row = db.prepare(`
    SELECT COUNT(*) as total FROM equipamentos e
    WHERE NOT EXISTS (
      SELECT 1 FROM agendamentos a
      WHERE a.equipamento_id = e.id
        AND a.status = 'Agendado'
        AND datetime(a.data_hora) < datetime('now')
    )
  `).get();
  return row ? row.total : 0;
}
