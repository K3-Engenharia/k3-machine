import { getDb } from './db.js';

const insertUserSQL = `INSERT INTO users (name, username, email, password_hash, role, is_approved) VALUES (?, ?, ?, ?, ?, ?)`;
const insertUserEmpresaSQL = `INSERT INTO usuarios_empresas (user_id, empresa_id) VALUES (?, ?)`;

export function createUser({ name, username, email, passwordHash, role, isApproved, empresas }) {
  const db = getDb();
  const result = db.prepare(insertUserSQL).run(name, username, email, passwordHash, role, isApproved ? 1 : 0);
  const userId = result.lastInsertRowid;
  if (Array.isArray(empresas)) {
    const stmt = db.prepare(insertUserEmpresaSQL);
    empresas.forEach(empresa_id => {
      stmt.run(userId, empresa_id);
    });
  }
  return { id: userId, name, username, email, role, is_approved: isApproved, empresas: empresas || [] };
}

export function findUserByUsername(username) {
  const db = getDb();
  return db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
}

export function findUserByEmail(email) {
  const db = getDb();
  return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
}

export function approveUser(userId) {
  const db = getDb();
  db.prepare(`UPDATE users SET is_approved = 1 WHERE id = ?`).run(userId);
  return getUserById(userId);
}

export function getUserById(id) {
  const db = getDb();
  return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
}

export function deleteUserById(id) {
  const db = getDb();
  db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
  return true;
}

// Atualiza as empresas vinculadas ao usuário (substitui todas)
export function updateUserEmpresas(id, empresas) {
  const db = getDb();
  db.prepare('DELETE FROM usuarios_empresas WHERE user_id = ?').run(id);
  if (Array.isArray(empresas)) {
    const stmt = db.prepare('INSERT INTO usuarios_empresas (user_id, empresa_id) VALUES (?, ?)');
    empresas.forEach(empresa_id => {
      stmt.run(id, empresa_id);
    });
  }
  return getUserById(id);
}
// Retorna todas as empresas vinculadas ao usuário
export async function getEmpresasByUserId(user_id) {
  const db = getDb();
  return db.prepare('SELECT empresa_id FROM usuarios_empresas WHERE user_id = ?').all(user_id).map(e => e.empresa_id);
}

export function updateUserPassword(id, passwordHash) {
  const db = getDb();
  db.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).run(passwordHash, id);
  return getUserById(id);
}
