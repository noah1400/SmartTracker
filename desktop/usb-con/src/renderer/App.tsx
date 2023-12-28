import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import ProjectBar from './ProjectBar';
import './Menu.css';
import './App.css';
import { Project } from './types';
import ProjectOptions from './ProjectSettings';

export default function App() {
  const projects: Project[] = [
    { id: 1, name: 'Pep.Digital', color: '#FF5733' },
    { id: 2, name: 'HS Esslingen', color: '#33FF57' },
    { id: 3, name: 'Projekt SWTM', color: '#5733FF' },
    { id: 4, name: 'Weihnachtsmarkt', color: '#FF33A1' },
    { id: 5, name: '2024', color: '#11F3AF' },
    { id: 6, name: 'Silverster', color: '#008080' },
  ];

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [timeRecords, setTimeRecords] = useState({});

  const handleTimerToggle = (time: any) => {
    if (activeProject) {
      //setTimeRecords({...timeRecords, [activeProject.id]: time});
      console.log('time: ', time, 'spend on project: ', activeProject.name);
    }
  };

  return (
    <div className="App">
      <ProjectBar projects={projects} setActiveProject={setActiveProject} />
      <div className="Menu">
        <Timer onTimeToggle={handleTimerToggle} activeProject={activeProject} />
        <ProjectOptions activeProject={activeProject} />
      </div>
    </div>
  );
}
