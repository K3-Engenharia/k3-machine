import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, Stack } from '@mui/material';
import { LocalInstaladoSelect } from '../components';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../components/BackToDashboardButton';
import EmpresaSelect from '../components/EmpresaSelect';

const statusList = ['Em Operação', 'Em Manutenção', 'Desativado'];

export default function EquipamentoForm() {
  const [form, setForm] = useState({ empresa_id: '', nome: '', tipo: '', modelo: '', fabricante: '', potencia: '', corrente_nominal: '', tensao_nominal: '', local_instalado: '', data_instalacao: '', status: 'Em Operação', painel_eletrico: '', rolamento: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tiposCadastrados, setTiposCadastrados] = useState([]);
  const [editTipoId, setEditTipoId] = useState(null);
  const [editTipoNome, setEditTipoNome] = useState('');
  const isAdmin = localStorage.getItem('role') === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar tipos cadastrados na API
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
    if (!form.nome || !form.tipo) {
      setError('Nome e tipo são obrigatórios');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/equipamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao cadastrar');
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTipo = (tipo) => {
    setEditTipoId(tipo.id);
    setEditTipoNome(tipo.nome);
  };

  const handleSaveTipo = async (tipoId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/tipos-equipamento/${tipoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome: editTipoNome })
      });
      if (res.ok) {
        setTiposCadastrados(tiposCadastrados.map(t => t.id === tipoId ? { ...t, nome: editTipoNome } : t));
        setEditTipoId(null);
        setEditTipoNome('');
      }
    } catch {}
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, minWidth: 400, maxWidth: 500, width: '100%' }} elevation={3}>
        <BackToDashboardButton />
        <Typography variant="h5" align="center" mb={3} fontWeight={600}>
          Cadastro de Equipamento
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <EmpresaSelect value={form.empresa_id} onChange={handleChange} required />
            <TextField
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              select
              label="Tipo"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              fullWidth
              required
            >
              {tiposCadastrados && tiposCadastrados.length > 0 ? (
                tiposCadastrados.map(t => (
                  <MenuItem key={t.id} value={t.nome}>{t.nome}</MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  Nenhum tipo cadastrado
                </MenuItem>
              )}
            </TextField>
            {(form.tipo === 'Motor' || form.tipo === 'Bomba') && (
              <>
                <TextField
                  label="Rolamento"
                  name="rolamento"
                  value={form.rolamento}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  select
                  label="Painel Elétrico"
                  name="painel_eletrico"
                  value={form.painel_eletrico}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  <MenuItem value="Inversor de Frequência">Inversor de Frequência</MenuItem>
                  <MenuItem value="Partida direta">Partida direta</MenuItem>
                  <MenuItem value="Soft-Starter">Soft-Starter</MenuItem>
                </TextField>
              </>
            )}
            <TextField label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} fullWidth />
            <TextField label="Fabricante" name="fabricante" value={form.fabricante} onChange={handleChange} fullWidth />
            <TextField label="Potência (CV)" name="potencia" value={form.potencia} onChange={handleChange} fullWidth />
            <TextField
              label="Corrente nominal (A)"
              name="corrente_nominal"
              value={form.corrente_nominal}
              onChange={e => {
                // Aceita apenas números e vírgula, e formata para duas casas decimais
                let val = e.target.value.replace(/[^\d,]/g, '');
                if (val.includes(',')) {
                  const [int, dec] = val.split(',');
                  val = int + ',' + (dec ? dec.slice(0,2) : '');
                }
                setForm({ ...form, corrente_nominal: val });
              }}
              fullWidth
              required
              inputProps={{ inputMode: 'decimal', pattern: '^\\d+(,\\d{0,2})?$' }}
              helperText="Ex: 70,30"
            />
            <TextField label="Tensão nominal (V)" name="tensao_nominal" value={form.tensao_nominal} onChange={handleChange} fullWidth />
            <LocalInstaladoSelect value={form.local_instalado} onChange={handleChange} required empresaId={form.empresa_id} />
            <TextField label="Data de instalação" name="data_instalacao" type="date" value={form.data_instalacao} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth required>
              {statusList.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ fontWeight: 600 }} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Stack>
        </form>
        {/* Seção de tipos cadastrados removida */}
      </Paper>
    </Box>
  );
}
