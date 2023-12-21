// src/components/ProjectBar.tsx
import React, { useState, useEffect } from 'react';
import './ProjectBar.css';
import { Project } from './types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface ProjectBarProps {
  projects: Project[];
  setActiveColor: React.Dispatch<React.SetStateAction<string | null>>;
}

//window.electron.ipcRenderer.on('serial-port-data', (arg) => {
//  console.log("testWelt");
//  console.log(arg);

//});

const ProjectBar: React.FC<ProjectBarProps> = ({
  projects,
  setActiveColor,
}) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue >= projects.length) {
      setActiveProject(0); //loop
      console.log('back to null');
    } else {
      setActiveProject(newValue);
      console.log('set active project: ', newValue);
    }
  };
  const tabIndicatorColor =
    activeProject !== null ? projects[activeProject].color : 'defaultColor';

  let counter = 0;
  let isListenerAdded = false;
  const handleKeyPress = (event: React.KeyboardEvent) => {
    console.log('keypress function');
    if (activeProject !== null) {
      if (event.key === 'ArrowLeft') {
        setActiveProject(
          activeProject > 0 ? activeProject - 1 : projects.length - 1,
        );
      } else if (event.key === 'ArrowRight') {
        setActiveProject(
          activeProject < projects.length - 1 ? activeProject + 1 : 0,
        );
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
  }, [activeProject]);

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
      console.log('hinzugefügt');
      console.log(isListenerAdded);
      isListenerAdded = true;
    }

    return () => {};
  }, []);

  //color of button
  useEffect(() => {
    if (activeProject !== null) {
      setActiveColor(projects[activeProject].color);
    } else {
      setActiveColor(null);
    }
  }, [activeProject, projects, setActiveColor]);

  //color of background
  useEffect(() => {
    if (activeProject !== null) {
      const activeColor = projects[activeProject].color;
      setActiveColor(activeColor);
      document.body.style.transition = 'background-color 0.5s ease';
      document.body.style.backgroundColor = activeColor
        ? `${activeColor}60`
        : 'black';
    } else {
      setActiveColor(null);
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
  }, [activeProject, projects, setActiveColor]);

  return (
    <div className="project-bar">
      <Tabs
        value={activeProject}
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
        }}
      >
        {projects.map((project, index) => (
          <Tab
            key={project.id}
            label={project.name}
            sx={{
              color: 'white',
              borderRadius: '8px',
              fontSize: activeProject === index ? '1rem' : '0.5rem',
              '&.Mui-selected': {
                fontSize: '1rem',
                color: 'white',
              },
              '& .MuiTouchRipple-root': { display: 'none' },
            }}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default ProjectBar;
