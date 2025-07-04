import fs from 'fs';
import path from 'path';
import { getDb } from '../models/db.js';

export async function runMigrations() {
  const migrationsPath = path.resolve('src/models/migrations.sql');
  const sql = fs.readFileSync(migrationsPath, 'utf-8');
  try {
    const db = await getDb();
    await db.exec(sql);
    console.log('Migrações executadas com sucesso!');
  } catch (err) {
    console.error('Erro ao executar migrações:', err);
  }
}
