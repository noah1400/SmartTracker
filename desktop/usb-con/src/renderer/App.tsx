import React, {useState, useEffect} from 'react';
import Timer from './Timer';
import ProjectBar from './ProjectBar';
import './Menu.css'
import './App.css';
import { Project } from './types';

export default function App() {
  const projects: Project[] = [
    { id: 1, name: 'Pep.Digital', color: '#FF5733' },
    { id: 2, name: 'HS Esslingen', color: '#33FF57' },
    { id: 3, name: 'Projekt SWTM', color: '#5733FF' },
    { id: 4, name: 'Weihnachtsmarkt', color: '#FF33A1' },
    { id: 5, name: '2024', color: '#11F3AF' },
    { id: 6, name: 'Silverster', color: '#008080' },
  ];

  const [activeColor, setActiveColor] = useState<string | null>(null);


  return (

    <div className='App'>
      <ProjectBar projects={projects} setActiveColor={setActiveColor} />
      <div className='menu'>
        <Timer />
      </div>
      
    </div>
  );
}
