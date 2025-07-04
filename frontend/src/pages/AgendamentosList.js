import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import BackToDashboardButton from '../components/BackToDashboardButton';

const statusColors = {
  'Agendado': 'primary',
  'Concluído': 'success',
  'Cancelado': 'default'
};

export default function AgendamentosList() {
  const { id } = useParams();
  const [agendamentos, setAgendamentos] = useState([]);
  const [equipamento, setEquipamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const resEq = await fetch(`http://localhost:4000/api/equipamentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resEq.ok) setEquipamento(await resEq.json());
        const res = await fetch(`http://localhost:4000/api/equipamentos/${id}/agendamentos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erro ao buscar agendamentos');
        setAgendamentos(await res.json());
      } catch {
        setError('Erro ao buscar agendamentos');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // Expor fetchData para uso nas ações
    AgendamentosList.fetchData = fetchData;
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (error) return <Box p={4}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box p={4} minHeight="100vh" bgcolor="#f5f5f5">
      <BackToDashboardButton />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Agendamentos de preventiva para: <b>{equipamento?.nome}</b></Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(`/equipamentos/${id}/agendar`)}>Novo agendamento</Button>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Periodicidade</TableCell>
              <TableCell>Tempo estimado</TableCell>
              <TableCell>Checklist</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendamentos.map(a => (
              <TableRow key={a.id}>
                <TableCell>{new Date(a.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                <TableCell>{a.responsavel}</TableCell>
                <TableCell><Chip label={a.status} color={statusColors[a.status] || 'default'} size="small" /></TableCell>
                <TableCell>{a.periodicidade}</TableCell>
                <TableCell>{a.tempo_estimado}</TableCell>
                <TableCell>{a.checklist}</TableCell>
                <TableCell>{a.observacoes}</TableCell>
                <TableCell>
                  <EditIcon style={{ cursor: 'pointer', marginRight: 8 }} color="primary" onClick={() => navigate(`/agendamentos/${a.id}/editar`)} />
                  {a.status === 'Agendado' && (
                    <DoneIcon style={{ cursor: 'pointer', marginRight: 8 }} color="success" onClick={async () => {
                      if(window.confirm('Marcar como concluído?')) {
                        const token = localStorage.getItem('token');
                        await fetch(`http://localhost:4000/api/equipamentos/agendamentos/${a.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ status: 'Concluído' })
                        });
                        AgendamentosList.fetchData();
                      }
                    }} />
                  )}
                  {a.status === 'Agendado' && (
                    <CancelIcon style={{ cursor: 'pointer' }} color="error" onClick={async () => {
                      if(window.confirm('Cancelar agendamento?')) {
                        const token = localStorage.getItem('token');
                        await fetch(`http://localhost:4000/api/equipamentos/agendamentos/${a.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ status: 'Cancelado' })
                        });
                        AgendamentosList.fetchData();
                      }
                    }} />
                  )}
                  {(a.status === 'Concluído' || a.status === 'Cancelado') && (
                    <ReplayIcon style={{ cursor: 'pointer' }} color="info" onClick={async () => {
                      if(window.confirm('Reabrir agendamento?')) {
                        const token = localStorage.getItem('token');
                        await fetch(`http://localhost:4000/api/equipamentos/agendamentos/${a.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ status: 'Agendado' })
                        });
                        AgendamentosList.fetchData();
                      }
                    }} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
