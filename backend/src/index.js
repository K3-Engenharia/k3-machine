import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';
import equipamentosRoutes from './routes/equipamentos.js';
import empresasRoutes from './routes/empresas.js';
import tiposEquipamentoRoutes from './routes/tiposEquipamento.js';
import locaisInstaladosRoutes from './routes/locaisInstalados.js';
import { runMigrations } from './utils/runMigrations.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Adiciona um header Content-Security-Policy flexível para desenvolvimento
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com;"
  );
  next();
});

app.get('/', (req, res) => {
  res.send('K3 Machine API rodando!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/equipamentos', equipamentosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/tipos-equipamento', tiposEquipamentoRoutes);
app.use('/api/locais-instalados', locaisInstaladosRoutes);

app.get('/api/debug/users', async (req, res) => {
  const db = await import('./models/db.js').then(m => m.getDb());
  const users = await (await db).all('SELECT id, username, email, password_hash, is_approved, role, empresa_id FROM users');
  res.json(users);
});

const PORT = process.env.PORT || 4000;
(async () => {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})();
