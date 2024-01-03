import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import ProjectBar from './ProjectBar';
import './Menu.css';
import './App.css';
import { Project } from './types';
import ProjectOptions from './ProjectSettings';
import { Box, Container, Grid, Paper } from '@mui/material';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeProjectColor, setActiveProjectColor] = useState('defaultColor');

  const activeProjectLocalID = activeProject ? activeProject.dataValues.localID : null;

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

  const handleSetActiveProject = (project: any, color: any) => {
    setActiveProject(project);
    setActiveProjectColor(color || 'defaultColor');
  };

  const handleTimerToggle = (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    if (activeProject) {
      console.log('time: ', time, 'spent on project: ', activeProject.dataValues.name);
    }
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
              <ProjectOptions activeProject={activeProject}                          activeProject={activeProject}
       activeColor={activeProjectColor} 
 />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
