import bcrypt from 'bcryptjs';
import { getDb } from '../models/db.js';

async function createAdmin() {
  const name = 'Administrador';
  const username = 'admin';
  const email = 'admin@empresa.com';
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  const role = 'admin';
  const isApproved = 1;

  const db = await getDb();
  await db.run(
    `INSERT INTO users (name, username, email, password_hash, role, is_approved)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET username = excluded.username, password_hash = excluded.password_hash, role = excluded.role, is_approved = excluded.is_approved`,
    [name, username, email, passwordHash, role, isApproved]
  );
  const admin = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  console.log('Usuário admin criado/atualizado:', admin);
  process.exit();
}

createAdmin();
