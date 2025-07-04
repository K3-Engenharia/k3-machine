import { getDb } from './db.js';

export async function createUser({ name, username, email, passwordHash, role, isApproved }) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO users (name, username, email, password_hash, role, is_approved) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, username, email, passwordHash, role, isApproved ? 1 : 0]
  );
  return { id: result.lastID, name, username, email, role, is_approved: isApproved };
}

export async function findUserByUsername(username) {
  const db = await getDb();
  return db.get(`SELECT * FROM users WHERE username = ?`, [username]);
}

export async function findUserByEmail(email) {
  const db = await getDb();
  return db.get(`SELECT * FROM users WHERE email = ?`, [email]);
}

export async function approveUser(userId) {
  const db = await getDb();
  await db.run(`UPDATE users SET is_approved = 1 WHERE id = ?`, [userId]);
  return getUserById(userId);
}

export async function getUserById(id) {
  const db = await getDb();
  return db.get(`SELECT * FROM users WHERE id = ?`, [id]);
}

export async function deleteUserById(id) {
  const db = await getDb();
  await db.run(`DELETE FROM users WHERE id = ?`, [id]);
  return true;
}

export async function updateUserEmpresa(id, empresa_id) {
  const db = await getDb();
  await db.run(`UPDATE users SET empresa_id = ? WHERE id = ?`, [empresa_id, id]);
  return getUserById(id);
}

export async function updateUserPassword(id, passwordHash) {
  const db = await getDb();
  await db.run(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, id]);
  return getUserById(id);
}
