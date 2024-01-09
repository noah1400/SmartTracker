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

function LoggedInView({ onLogout }: { onLogout: () => void }) {
  return (
      <Dialog
        open={Boolean(open)}
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
function LoggedOutView({ username, password, setUsername, setPassword, onSubmit, onClose }: Readonly<{ 
  username: string; 
  password: string; 
  setUsername: (username: string) => void; 
  setPassword: (password: string) => void; 
  onSubmit: (username: string, password: string) => void; 
  onClose: () => void; 
}>) {
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
function LoginForm({ open, onClose, onSubmit, isLoggedIn, onLogout }: { 
  open: boolean; 
  onClose: () => void; 
  onSubmit: (username: string, password: string) => void; 
  isLoggedIn: boolean; 
  onLogout: () => void; 
}) {
  const { username, password, setUsername, setPassword } = useLoginForm();

  if (isLoggedIn) {
    return <LoggedInView onLogout={onLogout} />;
  }

  return (
    <LoggedOutView
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}

export default LoginForm;
