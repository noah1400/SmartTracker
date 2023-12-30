// src/components/ProjectBar.tsx
import React, { useState, useEffect } from 'react';
import './ProjectBar.css';
import { Project } from './types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface ProjectBarProps {
  projects: Project[];
  setActiveProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

const ProjectBar: React.FC<ProjectBarProps> = ({
  projects,
  setActiveProject
}) => {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  useEffect(() => {
    if (projects.length > 0) {
      console.log("Example project:", projects[0].dataValues);
    }
  }, [projects]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const newActiveProject = projects[newValue] || null;
    setActiveProjectIndex(newValue);
    setActiveProject(newActiveProject);
  };

  const tabIndicatorColor =
    activeProjectIndex  !== null ? projects[activeProjectIndex].color : 'defaultColor';

  let counter = 0;
  let isListenerAdded = false;
  const handleKeyPress = (event: React.KeyboardEvent) => {
    console.log('keypress function');
  if (activeProjectIndex !== null) {
    let newActiveProjectIndex;
    if (event.key === 'ArrowLeft') {
      newActiveProjectIndex = activeProjectIndex > 0 ? activeProjectIndex - 1 : projects.length - 1;
    } else if (event.key === 'ArrowRight') {
      newActiveProjectIndex = activeProjectIndex < projects.length - 1 ? activeProjectIndex + 1 : 0;
    }

    if (newActiveProjectIndex !== undefined) {
      setActiveProjectIndex(newActiveProjectIndex);
      setActiveProject(projects[newActiveProjectIndex]);
    }
  }
  };
  //keyboard selection
  useEffect(() => {
    window.addEventListener(
      'keydown',
      handleKeyPress as unknown as EventListenerOrEventListenerObject,
    );
    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyPress as unknown as EventListenerOrEventListenerObject,
      );
    };
  }, [activeProjectIndex, projects, setActiveProject]);

  //tracker input
  useEffect(() => {
    let handleIpcRendererEvent = (event: any, arg: any) => {
      console.log('testWeltUseEffect');
      if (counter == 5) {
        counter = 0;
      }
      console.log(counter);
      setActiveProject(counter);
      counter++;
    };
    if (!isListenerAdded) {
      window.electron.ipcRenderer.on(
        'serial-port-data',
        handleIpcRendererEvent,
      );
      console.log(isListenerAdded);
      isListenerAdded = true;
    }

    return () => {};
  }, []);

  //color of background
  useEffect(() => {
    if (activeProjectIndex !== null) {
      const activeColor = projects[activeProjectIndex].color;
      document.body.style.transition = 'background-color 0.5s ease';
      document.body.style.backgroundColor = activeColor
        ? `${activeColor}60`
        : 'black';
    } else {
      document.body.style.transition = 'background-color 0.5s ease';
      document.body.style.backgroundColor = 'white';
    }

    // Cleanup the transition after it completes
    const transitionEndListener = () => {
      document.body.style.transition = 'none';
    };

    document.body.addEventListener('transitionend', transitionEndListener);

    return () => {
      document.body.removeEventListener('transitionend', transitionEndListener);
    };
  }, [activeProjectIndex, projects]);

  return (
    <div className="project-bar">
      <Box sx={{width: '100%'}}>
      <Tabs
        value={activeProjectIndex}
        onChange={handleChange}
        aria-label="Project tabs"
        variant="scrollable"
        allowScrollButtonsMobile
        scrollButtons="auto"
        TabIndicatorProps={{ style: { backgroundColor: tabIndicatorColor } }}
        sx={{
          '& .MuiTabs-scrollButtons': {
            color: 'white',
          },
          width: '100%',
        }}
      >
        {projects.map((project, index) => (
          <Tab
            key={project.dataValues.localID}
            label={project.dataValues.name}
            sx={{
              color: 'white',
              borderRadius: '8px',
              fontSize: activeProjectIndex === index ? '1rem' : '0.5rem',
              '&.Mui-selected': {
                fontSize: '1rem',
                color: 'white',
              },
              '& .MuiTouchRipple-root': { display: 'none' },
            }}
          />
        ))}
      </Tabs>
      </Box>
    </div>
  );
};

export default ProjectBar;
