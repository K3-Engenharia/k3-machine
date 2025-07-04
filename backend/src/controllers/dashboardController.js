import { getDb } from '../models/db.js';
import { contarProximasIntervencoes, contarEquipamentosPreventivaEmDia } from '../models/agendamentoModel.js';

export async function getDashboardData(req, res) {
  const db = await getDb();
  let equipamentos = 0;
  let proximasIntervencoes = 0;
  let preventivasEmDia = 0;
  try {
    const eq = await db.get('SELECT COUNT(*) as total FROM equipamentos');
    equipamentos = eq ? eq.total : 0;
    proximasIntervencoes = await contarProximasIntervencoes();
    preventivasEmDia = equipamentos > 0 ? Math.round((await contarEquipamentosPreventivaEmDia()) / equipamentos * 100) : 0;
  } catch (e) {
    // tabela ainda não existe
  }
  res.json({
    equipamentos,
    preventivasEmDia,
    proximasIntervencoes
  });
}
