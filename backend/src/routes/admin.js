import express from 'express';
import { approveUserById, listPendingUsers, setUserEmpresa, deleteUser, changeUserPassword } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Listar usuários pendentes de aprovação
router.get('/pending-users', authenticateToken, authorizeRoles('admin'), listPendingUsers);

// Aprovar usuário
router.post('/approve/:id', authenticateToken, authorizeRoles('admin'), approveUserById);

// Definir empresa do usuário
router.post('/set-empresa/:id', authenticateToken, authorizeRoles('admin'), setUserEmpresa);

// Excluir usuário
router.delete('/delete/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

// Alterar senha do usuário
router.post('/change-password/:id', authenticateToken, authorizeRoles('admin'), changeUserPassword);

export default router;
