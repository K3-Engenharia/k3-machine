import React, { useEffect, useState } from 'react';
import { MenuItem, TextField } from '@mui/material';

export default function EmpresaSelect({ value, onChange, required = true, ...props }) {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/empresas')
      .then(res => res.json())
      .then(setEmpresas)
      .catch(() => setEmpresas([]));
  }, []);

  return (
    <TextField
      select
      label="Empresa"
      name="empresa_id"
      value={value || ''}
      onChange={onChange}
      fullWidth
      margin="normal"
      required={required}
      {...props}
    >
      {empresas.map(e => (
        <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>
      ))}
    </TextField>
  );
}
