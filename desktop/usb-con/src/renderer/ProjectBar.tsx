// src/components/ProjectBar.tsx
import React, { useState, useEffect } from 'react';
import './ProjectBar.css';
import { Project } from './types';

interface ProjectBarProps {
  projects: Project[];
  setActiveColor: React.Dispatch<React.SetStateAction<string | null>>;
}

window.electron.ipcRenderer.on('serial-port-data', (arg) => {
  console.log("testWelt");
  console.log(arg);

});

const ProjectBar: React.FC<ProjectBarProps> = ({
  projects,
  setActiveColor,
}) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (
      event.key === 'ArrowLeft' &&
      activeProject !== null &&
      activeProject > 0
    ) {
      setActiveProject(activeProject - 1);
    } else if (
      event.key === 'ArrowRight' &&
      activeProject !== null &&
      activeProject < projects.length - 1
    ) {
      setActiveProject(activeProject + 1);
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
      document.body.style.backgroundColor = activeColor ? `${activeColor}65` : 'grey'; 
    
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
      {projects.map((project, index) => (
        <button
          key={project.id}
          className={index === activeProject ? 'active' : ''}
          onClick={() => setActiveProject(index)}
          style={{
            backgroundColor:
              index === activeProject ? project.color + '70' : 'transparent',
            borderRadius: '8px',
          }}
        >
          {project.name}
        </button>
      ))}
    </div>
  );
};

export default ProjectBar;
