import { getDb } from '../models/db.js';
import { contarProximasIntervencoes, contarEquipamentosPreventivaEmDia } from '../models/agendamentoModel.js';
import { contarEquipamentos } from '../models/equipamentoModel.js';

export function getDashboardData(req, res) {
  const db = getDb();
  let equipamentos = 0;
  let proximasIntervencoes = 0;
  let preventivasEmDia = 0;
  const userEmpresas = req.user.role === 'admin' ? null : req.user.empresas;

  try {
    equipamentos = contarEquipamentos(userEmpresas);
    proximasIntervencoes = contarProximasIntervencoes(userEmpresas);
    preventivasEmDia = equipamentos > 0 ? Math.round(contarEquipamentosPreventivaEmDia(userEmpresas) / equipamentos * 100) : 0;
  } catch (e) {
    console.error('Erro ao buscar dados do dashboard:', e);
    // Em caso de erro (ex: tabela ainda não existe), os valores permanecem 0
  }
  res.json({
    equipamentos,
    preventivasEmDia,
    proximasIntervencoes
  });
}
