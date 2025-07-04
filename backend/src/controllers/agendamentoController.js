import { criarAgendamento, listarAgendamentosPorEquipamento, atualizarAgendamento, atualizarStatusAgendamento } from '../models/agendamentoModel.js';
import { getDb } from '../models/db.js';

export async function agendarPreventiva(req, res) {
  try {
    const equipamento_id = req.params.id;
    const agendamento = req.body;
    const novo = await criarAgendamento(equipamento_id, agendamento);
    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao agendar preventiva' });
  }
}

export function listarAgendamentos(req, res) {
  try {
    // Se admin, pode ver todos os agendamentos do equipamento
    // Se não, só pode ver se o equipamento pertence a uma das empresas do usuário
    const db = getDb();
    const equipamento = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);
    if (!equipamento) return res.status(404).json({ message: 'Equipamento não encontrado' });
    if (req.user.role !== 'admin' && (!Array.isArray(req.user.empresas) || !req.user.empresas.includes(equipamento.empresa_id))) {
      return res.status(403).json({ message: 'Acesso negado a este equipamento' });
    }
    const lista = listarAgendamentosPorEquipamento(req.params.id);
    res.json(lista);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao listar agendamentos' });
  }
}

export async function editarAgendamento(req, res) {
  try {
    const agendamento = req.body;
    const atualizado = await atualizarAgendamento(req.params.agendamentoId, agendamento);
    res.json(atualizado);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao editar agendamento' });
  }
}

export async function alterarStatusAgendamento(req, res) {
  try {
    const { status } = req.body;
    const atualizado = await atualizarStatusAgendamento(req.params.agendamentoId, status);
    res.json(atualizado);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao atualizar status do agendamento' });
  }
}
