import React from 'react';
import { Button, TextField, Box, Paper, Typography } from '@mui/material';

const ReportForm = () => {
  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: 'auto', mt: 4, p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reportar Delito Electoral
      </Typography>
      <TextField
        fullWidth
        label="Descripción del delito"
        multiline
        rows={4}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth>
        Reportar
      </Button>
    </Paper>
  );
};

export default ReportForm;