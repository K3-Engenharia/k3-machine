import { getDb } from '../models/db.js';
import { contarProximasIntervencoes, contarEquipamentosPreventivaEmDia } from '../models/agendamentoModel.js';

export function getDashboardData(req, res) {
  const db = getDb();
  let equipamentos = 0;
  let proximasIntervencoes = 0;
  let preventivasEmDia = 0;
  try {
    const eq = db.prepare('SELECT COUNT(*) as total FROM equipamentos').get();
    equipamentos = eq ? eq.total : 0;
    proximasIntervencoes = contarProximasIntervencoes();
    preventivasEmDia = equipamentos > 0 ? Math.round(contarEquipamentosPreventivaEmDia() / equipamentos * 100) : 0;
  } catch (e) {
    // tabela ainda não existe
  }
  res.json({
    equipamentos,
    preventivasEmDia,
    proximasIntervencoes
  });
}
