import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import ProjectBar from './ProjectBar';
import './Menu.css';
import './App.css';
import { Project } from './types';
import ProjectOptions from './ProjectSettings';
import { Badge, Box, Container, Grid, IconButton, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginForm from './LoginForm';
export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeProjectColor, setActiveProjectColor] = useState('defaultColor');
  const [isLoginFormOpen, setLoginFormOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

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
  const handleLoginFormSubmit = (username: string, password: string) => {
    try {
      const st = window.smarttracker;
      st.connect(username, password);
      setLoggedIn(true);
      /*
      if (st.isLoggedin()) {
        console.log('Login successful');
        setLoggedIn(true);
        handleCloseLoginForm();
      } else {
        console.error('Login failed');
        //error to user
      }*/
    } catch (error) {
      console.error('Login error:', error);
      //error to user
    }
  };

  const handleLogout = () => {
    window.smarttracker.disconnect();
    setLoggedIn(false);
  }; 

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box mb={2}>
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
              <IconButton sx={{ color: 'white' }} onClick={handleOpenLoginForm}>
                {isLoggedIn ? (
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
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
