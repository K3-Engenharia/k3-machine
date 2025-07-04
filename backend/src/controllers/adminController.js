import { approveUser, findUserByEmail, getUserById, updateUserEmpresa, deleteUserById, updateUserPassword } from '../models/userModel.js';
import { sendApprovalEmail } from '../utils/mailer.js';
import { getDb } from '../models/db.js';
import bcrypt from 'bcryptjs';

export async function approveUserById(req, res) {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  if (user.is_approved) return res.status(400).json({ message: 'Usuário já aprovado' });
  const updated = await approveUser(id);
  try {
    await sendApprovalEmail(updated.email, updated.name);
  } catch (e) {
    console.error('Erro ao enviar e-mail de aprovação:', e);
  }
  res.json({ message: 'Usuário aprovado com sucesso', user: updated });
}

export async function listPendingUsers(req, res) {
  const db = await getDb();
  const users = await db.all('SELECT * FROM users');
  res.json(users);
}

export async function setUserEmpresa(req, res) {
  const { id } = req.params;
  const { empresa_id } = req.body;
  if (!empresa_id) return res.status(400).json({ message: 'empresa_id obrigatório' });
  const user = await updateUserEmpresa(id, empresa_id);
  res.json(user);
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  await deleteUserById(id);
  res.json({ message: 'Usuário excluído com sucesso' });
}

export async function changeUserPassword(req, res) {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Senha obrigatória' });
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  const passwordHash = await bcrypt.hash(password, 10);
  await updateUserPassword(id, passwordHash);
  res.json({ message: 'Senha alterada com sucesso' });
}
