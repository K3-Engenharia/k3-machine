import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, CircularProgress } from '@mui/material';
import BackToDashboardButton from '../components/BackToDashboardButton';

export default function UsuariosEmpresaAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [resUsers, resEmpresas] = await Promise.all([
          fetch('http://localhost:4000/api/admin/pending-users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:4000/api/empresas', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const users = await resUsers.json();
        const emps = await resEmpresas.json();
        setUsuarios(users);
        setEmpresas(emps);
      } catch {
        setError('Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const handleEmpresaChange = async (userId, empresa_id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:4000/api/admin/set-empresa/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ empresa_id })
      });
      setUsuarios(usuarios => usuarios.map(u => u.id === userId ? { ...u, empresa_id } : u));
    } catch {
      setError('Erro ao atualizar empresa do usuário');
    }
  };

  return (
    <Box p={4}>
      <BackToDashboardButton />
      <Typography variant="h5" mb={2}>Usuários pendentes - Definir Empresa</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Aprovação</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.empresa_id || ''}
                      onChange={e => handleEmpresaChange(u.id, e.target.value)}
                      displayEmpty
                      size="small"
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      {empresas.map(emp => (
                        <MenuItem key={emp.id} value={emp.id}>{emp.nome}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {u.is_approved ? (
                      <Typography color="success.main">Aprovado</Typography>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            await fetch(`http://localhost:4000/api/admin/approve/${u.id}`, {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            setUsuarios(usuarios => usuarios.map(user => user.id === u.id ? { ...user, is_approved: 1 } : user));
                          } catch {
                            setError('Erro ao aprovar usuário');
                          }
                        }}
                        disabled={!u.empresa_id}
                      >
                        Aprovar
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.role !== 'admin' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={async () => {
                          if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
                            try {
                              const token = localStorage.getItem('token');
                              await fetch(`http://localhost:4000/api/admin/delete/${u.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              setUsuarios(usuarios => usuarios.filter(user => user.id !== u.id));
                            } catch {
                              setError('Erro ao excluir usuário');
                            }
                          }
                        }}
                      >
                        Excluir
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={async () => {
                        const novaSenha = prompt('Digite a nova senha para este usuário:');
                        if (novaSenha && novaSenha.length >= 4) {
                          try {
                            const token = localStorage.getItem('token');
                            await fetch(`http://localhost:4000/api/admin/change-password/${u.id}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ password: novaSenha })
                            });
                            alert('Senha alterada com sucesso!');
                          } catch {
                            setError('Erro ao alterar senha');
                          }
                        } else if (novaSenha) {
                          alert('A senha deve ter pelo menos 4 caracteres.');
                        }
                      }}
                    >
                      Alterar Senha
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
