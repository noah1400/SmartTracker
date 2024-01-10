import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Title } from '@mui/icons-material';

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

function LoginForm({
  open,
  onClose,
  onSubmit,
  isLogged,
  onLogout,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onSubmit: (username: string, password: string) => void;
  isLogged: boolean;
  onLogout: () => void;
}>) {
  const { username, password, setUsername, setPassword } = useLoginForm();
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

  const handleSubmit = () => {
    onSubmit(username, password);
    onClose();
  };
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoUpdateEnabled(event.target.checked);
    handleAutoUpdate(event.target.checked);
  };

  const handleAutoUpdate = (enabled: boolean) => {
    const st = window.smarttracker;
    /*st.autoUpdate(enabled);
    st.autoUpdateInterval(10000);
    console.log('autoUpdateEnabled: ', autoUpdateEnabled);*/
  };

  const renderLoginFields = () => (
    <>
      <TextField
        autoFocus
        margin="dense"
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{
          width: '70%',
          '& label.Mui-focused': {
            color: 'white',
          },
        }}
      />
      <TextField
        margin="dense"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          width: '70%',
          '& label.Mui-focused': {
            color: 'white',
          },
        }}
      />
    </>
  );
  const renderSettings = () => (
    <div>
      <FormControlLabel
        label="Autosync"
        control={
          <Switch checked={autoUpdateEnabled} onChange={handleSwitchChange} />
        }
      />
    </div>
  );

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
      <DialogTitle sx={{ textAlign: 'center' }}>
        {isLogged ? `Welcome, ${username}!` : 'Access Services'}
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        {isLogged ? renderSettings() : renderLoginFields()}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', marginBottom: '8px' }}>
        {isLogged ? (
          <Button
            variant="contained"
            onClick={onLogout}
            sx={{ mr: 2, color: 'white' }}
          >
            Logout
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit}>
            Login
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default LoginForm;
