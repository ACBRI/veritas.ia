import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const ReportForm = () => {
  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <TextField
        fullWidth
        label="Descripción del delito"
        multiline
        rows={4}
        variant="outlined"
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        Reportar
      </Button>
    </Box>
  );
};

export default ReportForm;
