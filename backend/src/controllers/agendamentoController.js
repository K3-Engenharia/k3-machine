import { criarAgendamento, listarAgendamentosPorEquipamento, atualizarAgendamento, atualizarStatusAgendamento } from '../models/agendamentoModel.js';

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

export async function listarAgendamentos(req, res) {
  try {
    const lista = await listarAgendamentosPorEquipamento(req.params.id);
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
