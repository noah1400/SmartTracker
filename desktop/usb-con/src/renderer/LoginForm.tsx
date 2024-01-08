import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';

function LoginForm({
  open,
  onClose,
  onSubmit,
  isLoggedIn,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (username: string, password: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}) {
  if (isLoggedIn) {
    // View when user is logged in
    return (
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#2a2a2a',
            color: 'white',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Settings</DialogTitle>
        <DialogContent>You are currently logged in.</DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={onLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(username, password);
    onClose();
  };

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
      <DialogTitle sx={{ textAlign: 'center' }}>Access Services</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <TextField
          autoFocus
          margin="dense"
          label="username"
          
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ width: '80%' }}
        />
        <TextField
          margin="dense"
          label="password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: '80%' }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', marginBottom:'8px' }}>
        <Button variant="contained" onClick={handleSubmit}>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginForm;
