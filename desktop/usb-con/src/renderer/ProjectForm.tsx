// ProjectForm.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

function ProjectForm({
  open,
  onClose,
  onSubmit,
  resetForm,
  onReset,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  resetForm: boolean;
  onReset: () => void;
}>) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(name, description);
    onClose();
  };
  useEffect(() => {
    if (resetForm) {
      setName('');
      setDescription('');
      onReset();
    }
  }, [resetForm, onReset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: '#2a2a2a',
          color: 'white',
        },
        '& .MuiInputBase-input': {
          color: 'white',
        },
        '& .MuiInputLabel-root': {
          color: 'white',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Create a new project </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: '90%' }}
        />
        <TextField
          margin="dense"
          label="What is it about?"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ width: '90%' }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', marginBottom:'8px' }}>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectForm;
