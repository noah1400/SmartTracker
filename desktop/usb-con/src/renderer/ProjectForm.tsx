// ProjectForm.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

function ProjectForm({ open, onClose, onSubmit, resetForm, onReset }: 
  { open: boolean, onClose: () => void, 
    onSubmit: (name: string, description: string) => void,
    resetForm: boolean, 
    onReset: () => void  }) {

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a new project </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectForm;