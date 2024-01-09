import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

function useLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return {
    username,
    password,
    setUsername,
    setPassword,
  };
}

function LoginForm({ open, onClose, onSubmit, isLogged, onLogout }: Readonly<{ 
  open: boolean; 
  onClose: () => void; 
  onSubmit: (username: string, password: string) => void; 
  isLogged: boolean; 
  onLogout: () => void; 
}>) {
  const { username, password, setUsername, setPassword } = useLoginForm();

  const handleSubmit = () => {
    onSubmit(username, password);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(open)}
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
      <DialogTitle sx={{ textAlign: 'center' }}>Access Services</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ width: '70%' }}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: '70%' }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', marginBottom: '8px' }}>
        {isLogged && (
          <Button variant="outlined" onClick={onLogout} sx={{ mr: 2, color: 'white' }}>
            Logout
          </Button>
        )}
        <Button variant="contained" onClick={handleSubmit}>
          {isLogged ? 'Update' : 'Login'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginForm;
