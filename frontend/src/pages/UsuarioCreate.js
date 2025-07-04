import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UsuarioCreate() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    empresa_id: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchEmpresas() {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/empresas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEmpresas(await res.json());
      }
    }
    fetchEmpresas();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.username || !form.email || !form.password || !form.empresa_id) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setSuccess('Usuário cadastrado com sucesso!');
      setForm({ name: '', username: '', email: '', password: '', role: 'user', empresa_id: '' });
    } else {
      const data = await res.json();
      setError(data.message || 'Erro ao cadastrar usuário.');
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f5f5f5" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Paper sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Cadastrar Usuário</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Nome completo" name="name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField label="Nome de usuário (login)" name="username" value={form.username} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth type="email" />
            <TextField label="Senha" name="password" value={form.password} onChange={handleChange} required fullWidth type="password" />
            <TextField select label="Empresa" name="empresa_id" value={form.empresa_id} onChange={handleChange} required fullWidth>
              {empresas.map(e => (
                <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Perfil" name="role" value={form.role} onChange={handleChange} required fullWidth>
              <MenuItem value="tecnico">Usuário</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success.main">{success}</Typography>}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" type="submit">Cadastrar</Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
