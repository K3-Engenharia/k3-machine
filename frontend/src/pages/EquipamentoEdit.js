import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { LocalInstaladoSelect } from '../components';
import { useNavigate, useParams } from 'react-router-dom';
import BackToDashboardButton from '../components/BackToDashboardButton';
import EmpresaSelect from '../components/EmpresaSelect';

const statusList = ['Em Operação', 'Em Manutenção', 'Desativado'];

export default function EquipamentoEdit() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tiposCadastrados, setTiposCadastrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEquip() {
      setError('');
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:4000/api/equipamentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          setError('Equipamento não encontrado');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setForm(data);
      } catch {
        setError('Erro de conexão com o servidor');
      } finally {
        setLoading(false);
      }
    }
    fetchEquip();
  }, [id]);

  useEffect(() => {
    async function fetchTipos() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/tipos-equipamento', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTiposCadastrados(data);
        }
      } catch {}
    }
    fetchTipos();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/equipamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao atualizar');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (!form) return <Box p={4}><Typography color="error">{error || 'Equipamento não encontrado'}</Typography></Box>;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, minWidth: 400 }}>
        <BackToDashboardButton />
        <Typography variant="h5" mb={2}>Editar Equipamento</Typography>
        <form onSubmit={handleSubmit}>
          <EmpresaSelect value={form.empresa_id} onChange={handleChange} required />
          <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth margin="normal" required />
          <TextField select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} fullWidth margin="normal" required>
            {tiposCadastrados && tiposCadastrados.length > 0 ? (
              tiposCadastrados.map(t => (
                <MenuItem key={t.id} value={t.nome}>{t.nome}</MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>Nenhum tipo cadastrado</MenuItem>
            )}
          </TextField>
          <TextField label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Fabricante" name="fabricante" value={form.fabricante} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Potência (CV)" name="potencia" value={form.potencia} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Corrente nominal (A)" name="corrente_nominal" value={form.corrente_nominal} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Tensão nominal (V)" name="tensao_nominal" value={form.tensao_nominal} onChange={handleChange} fullWidth margin="normal" />
          <LocalInstaladoSelect value={form.local_instalado} onChange={handleChange} required empresaId={form.empresa_id} />
          <TextField label="Data de instalação" name="data_instalacao" type="date" value={form.data_instalacao} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth margin="normal" required>
            {statusList.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
