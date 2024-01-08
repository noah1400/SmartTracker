import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
          <Dialog open={open} onClose={onClose}>
            <DialogTitle>User Logged In</DialogTitle>
            <DialogContent>
              You are currently logged in.
            </DialogContent>
            <DialogActions>
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username or Email"
          fullWidth
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          fullWidth
          type="password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginForm;
