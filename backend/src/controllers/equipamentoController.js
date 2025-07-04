import { createEquipamento, listEquipamentos, getEquipamentoById, updateEquipamento, deleteEquipamento } from '../models/equipamentoModel.js';
import { getProximoAgendamentoPorEquipamento } from '../models/agendamentoModel.js';

export async function cadastrarEquipamento(req, res) {
  try {
    const equip = req.body;
    if (!equip.nome || !equip.tipo || !equip.empresa_id) {
      return res.status(400).json({ message: 'Nome, tipo e empresa são obrigatórios' });
    }
    const novo = await createEquipamento(equip);
    res.status(201).json(novo);
  } catch (e) {
    console.error('Erro ao cadastrar equipamento:', e);
    res.status(500).json({ message: 'Erro ao cadastrar equipamento', error: e.message });
  }
}

export async function listarEquipamentos(req, res) {
  try {
    const { empresa_id } = req.query;
    const lista = await listEquipamentos(empresa_id ? { empresa_id } : {});
    res.json(lista);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao listar equipamentos' });
  }
}

export async function buscarEquipamento(req, res) {
  try {
    const equip = await getEquipamentoById(req.params.id);
    if (!equip) return res.status(404).json({ message: 'Equipamento não encontrado' });
    // Buscar próximo agendamento
    const proximo = await getProximoAgendamentoPorEquipamento(req.params.id);
    equip.proximo_agendamento = proximo ? proximo.data_hora : null;
    res.json(equip);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao buscar equipamento' });
  }
}

export async function atualizarEquipamento(req, res) {
  try {
    const equip = req.body;
    if (!equip.nome || !equip.tipo || !equip.empresa_id) {
      return res.status(400).json({ message: 'Nome, tipo e empresa são obrigatórios' });
    }
    const atualizado = await updateEquipamento(req.params.id, equip);
    res.json(atualizado);
  } catch (e) {
    res.status(500).json({ message: 'Erro ao atualizar equipamento' });
  }
}

export async function excluirEquipamento(req, res) {
  try {
    await deleteEquipamento(req.params.id);
    res.json({ message: 'Equipamento excluído com sucesso' });
  } catch (e) {
    res.status(500).json({ message: 'Erro ao excluir equipamento' });
  }
}
