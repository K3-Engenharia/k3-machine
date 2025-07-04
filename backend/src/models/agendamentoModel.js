import { getDb } from './db.js';

export async function criarAgendamento(equipamento_id, agendamento) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO agendamentos (equipamento_id, data_hora, tempo_estimado, responsavel, checklist, observacoes, periodicidade, proximo_agendamento, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      equipamento_id,
      agendamento.data_hora,
      agendamento.tempo_estimado,
      agendamento.responsavel,
      agendamento.checklist,
      agendamento.observacoes,
      agendamento.periodicidade,
      calcularProximoAgendamento(agendamento.data_hora, agendamento.periodicidade),
      'Agendado'
    ]
  );
  return { id: result.lastID, ...agendamento };
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

export async function getProximoAgendamentoPorEquipamento(equipamento_id) {
  const db = await getDb();
  return db.get(
    `SELECT * FROM agendamentos WHERE equipamento_id = ? AND status = 'Agendado' AND data_hora >= datetime('now') ORDER BY data_hora ASC LIMIT 1`,
    [equipamento_id]
  );
}

export async function contarProximasIntervencoes() {
  const db = await getDb();
  const row = await db.get(
    `SELECT COUNT(*) as total FROM agendamentos WHERE status = 'Agendado' AND data_hora >= datetime('now')`
  );
  return row ? row.total : 0;
}

export async function listarAgendamentosPorEquipamento(equipamento_id) {
  const db = await getDb();
  return db.all(
    `SELECT * FROM agendamentos WHERE equipamento_id = ? ORDER BY data_hora DESC`,
    [equipamento_id]
  );
}

export async function atualizarAgendamento(id, agendamento) {
  const db = await getDb();
  await db.run(
    `UPDATE agendamentos SET data_hora=?, tempo_estimado=?, responsavel=?, checklist=?, observacoes=?, periodicidade=?, proximo_agendamento=? WHERE id=?`,
    [
      agendamento.data_hora,
      agendamento.tempo_estimado,
      agendamento.responsavel,
      agendamento.checklist,
      agendamento.observacoes,
      agendamento.periodicidade,
      agendamento.proximo_agendamento,
      id
    ]
  );
  return db.get('SELECT * FROM agendamentos WHERE id = ?', [id]);
}

export async function atualizarStatusAgendamento(id, status) {
  const db = await getDb();
  await db.run(
    `UPDATE agendamentos SET status=? WHERE id=?`,
    [status, id]
  );
  return db.get('SELECT * FROM agendamentos WHERE id = ?', [id]);
}

export async function contarEquipamentosPreventivaEmDia() {
  const db = await getDb();
  // Conta quantos equipamentos NÃO possuem agendamento "Agendado" atrasado
  const row = await db.get(`
    SELECT COUNT(*) as total FROM equipamentos e
    WHERE NOT EXISTS (
      SELECT 1 FROM agendamentos a
      WHERE a.equipamento_id = e.id
        AND a.status = 'Agendado'
        AND datetime(a.data_hora) < datetime('now')
    )
  `);
  return row ? row.total : 0;
}
