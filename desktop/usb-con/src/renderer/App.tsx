import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import ProjectBar from './ProjectBar';
import './Menu.css';
import './App.css';
import { Project } from './types';
import ProjectOptions from './ProjectSettings';
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginForm from './LoginForm';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeProjectColor, setActiveProjectColor] = useState('defaultColor');
  const [isLoginFormOpen, setLoginFormOpen] = useState(false);
  const [logged, setLogged] = useState(false);
  const [syncAlert, setSyncAlert] = useState({ open: false, message: '' });

  const activeProjectLocalID = activeProject
    ? activeProject.dataValues.localID
    : null;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await window.smarttracker.getProjects();
        setProjects(fetchedProjects);
        console.log('fetched projects: ', fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleSetActiveProject = (project: Project | null, color: string) => {
    setActiveProject(project);
    setActiveProjectColor(color || 'defaultColor');
  };
  const handleTimerToggle = (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    if (activeProject) {
      console.log(
        'time: ',
        time,
        'spent on project: ',
        activeProject.dataValues.name,
      );
    }
  };
  const handleOpenLoginForm = () => {
    setLoginFormOpen(true);
  };

  const handleCloseLoginForm = () => {
    setLoginFormOpen(false);
  };
  const handleLoginFormSubmit = async (username: string, password: string) => {
    const ST = window.smarttracker;
    try {
      const response = await ST.connect(username, password);

      if (response) {
        setLogged(true);
        handleCloseLoginForm();
        console.log('Login successful');
        console.log('data: ', username, password);
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      handleOpenLoginForm();

      console.log('Login failed');
    }
  };
  const manualSync = async () => {
    try {
      const response = await window.smarttracker.manualUpdate();
      if (response.success) {
        console.log('Sync successful', response);
        setSyncAlert({ open: true, message: 'Sync successful' });
      } else {
        console.error('Sync failed:', response.error);
        setSyncAlert({ open: true, message: 'Sync failed: ' + response.error });
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      setSyncAlert({ open: true, message: 'Sync error: ' + error.message });
    }
  };
  const handleLogout = () => {
    window.smarttracker.disconnect();
    setLogged(false);
  };
  const handleCloseAlert = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setSyncAlert({ ...syncAlert, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box mb={0}>
            <ProjectBar
              projects={projects}
              setActiveProject={handleSetActiveProject}
            />
          </Box>
        </Grid>
        <Grid item xs={12} style={{ height: '80vh', position: 'relative' }}>
          <Paper
            elevation={3}
            style={{
              height: '100%',
              backgroundColor: '#2a2a2a',
              position: 'relative',
            }}
          >
            <Box
              mb={2}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Timer
                activeProject={activeProject}
                activeColor={activeProjectColor}
                activeLocalID={activeProjectLocalID}
                onTimeToggle={handleTimerToggle}
              />
            </Box>
            <Box
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                padding: '10px',
              }}
            >
              <ProjectOptions
                activeProject={activeProject}
                activeColor={activeProjectColor}
              />
            </Box>
            <Box
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '15px',
              }}
            >
              <IconButton
                sx={{
                  color: 'white',
                  '&.Mui-disabled': {
                    color: 'grey',
                  },
                }}
                onClick={manualSync}
                disabled={!logged}
              >
                <CloudSyncIcon sx={{ fontSize: '2rem' }} />
              </IconButton>
              <IconButton sx={{ color: 'white' }} onClick={handleOpenLoginForm}>
                {logged ? (
                  <Badge
                    overlap="circular"
                    badgeContent=""
                    color="success"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: '3.5rem' }} />
                  </Badge>
                ) : (
                  <AccountCircleIcon sx={{ fontSize: '3.5rem' }} />
                )}
              </IconButton>
              <LoginForm
                open={isLoginFormOpen}
                onClose={handleCloseLoginForm}
                onSubmit={handleLoginFormSubmit}
                isLogged={logged}
                onLogout={handleLogout}
              />
              <Snackbar
                open={syncAlert.open}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Alert
                  onClose={handleCloseAlert}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  {syncAlert.message}
                </Alert>
              </Snackbar>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
