import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import ProjectBar from './ProjectBar';
import './Menu.css';
import './App.css';
import { Project } from './types';
import ProjectOptions from './ProjectSettings';
import { Box, Container, Grid, Paper } from '@mui/material';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Pep.Digital', color: '#FF5733', totalTime: { hours: 0, minutes: 0, seconds: 0 } },
    { id: 2, name: 'HS Esslingen', color: '#33FF57', totalTime: { hours: 0, minutes: 0, seconds: 0 } },
    { id: 3, name: 'Projekt SWTM', color: '#5733FF', totalTime: { hours: 0, minutes: 0, seconds: 0 } },
    { id: 4, name: 'Weihnachtsmarkt', color: '#FF33A1', totalTime: { hours: 0, minutes: 0, seconds: 0 } },
    { id: 5, name: '2024', color: '#11F3AF', totalTime: { hours: 0, minutes: 0, seconds: 0 } },
    { id: 6, name: 'Silverster', color: '#008080', totalTime: { hours: 0, minutes: 0, seconds: 0 } },
  ]);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const handleTimerToggle = (time: { hours: number; minutes: number; seconds: number }) => {
    if (activeProject) {
      console.log('time: ', time, 'spent on project: ', activeProject.name);
    }
  };
  

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} >
        <Grid item xs={12} >
          <Box mb={2}>
            <ProjectBar
              projects={projects}
              setActiveProject={setActiveProject}
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
                onTimeToggle={handleTimerToggle}
              />
            </Box>
            <Box style={{ position: 'absolute', bottom: 0, left: 0, padding: '10px' }}>
              <ProjectOptions activeProject={activeProject} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
