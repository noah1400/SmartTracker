import React, { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import './Timer.css';
import { IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Project } from './types';

interface TimeEntry {
  projectId: string;
  startTime: Date;
  endTime: Date | null;
}

interface TimerProps {
  activeProject: Project | null;
  activeColor: string; 
  activeLocalID: number | null;
  onTimeToggle: (time: { hours: number; minutes: number; seconds: number; }) => void;
}

const Timer: React.FC<TimerProps> = ({ activeProject, activeColor, activeLocalID, onTimeToggle }) => {
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [timeEntry, setTimeEntry] = useState<TimeEntry[]>(() => {
   
  });

  useEffect(() => {
    console.log(timeEntry);
  }, [timeEntry]);  

  useEffect(() => {
    if (activeProject) {
      resetStopwatch();
    }
  }, [activeProject]);
  //test color: 
  useEffect(() => {
    console.log("Active Project Color:", activeColor); // Check the color value
  }, [activeColor]);

  const toggleTimer = () => {
    if (!isRunning) {
      start();
      //timeLogs.push({ projectId: activeProject ? activeProject.id : '', startTime: new Date(), endTime: new Date() });
      const newEntry: TimeEntry = {
        projectId: activeProject ? activeProject.id.toString() : '',
        startTime: new Date(),
        endTime: null
      };
      setTimeEntry([...timeEntry, newEntry]);
      console.log('timeEntry: ', timeEntry);

    } else {
      pause();
      onTimeToggle({ hours, minutes, seconds });
      const updatedEntries = timeEntry.map((entry, index) => 
        index === timeEntry.length - 1 ? { ...entry, endTime: new Date() } : entry
      );
      setTimeEntry(updatedEntries);
      console.log('timeEntry: ', timeEntry);
    }
  };

  const resetStopwatch = () => {
    reset(new Date(0), false);
  };

  const formatTime = () =>
    `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(
      2,
      '0',
    )} : ${String(seconds).padStart(2, '0')}`;

  const iconButtonStyle = {
    color: activeColor ,
  };
  const isButtonDisabled = !activeProject;

  return (
    <div className="timer-container">
      <p className="timer-display">{formatTime()}</p>
      <IconButton
        onClick={toggleTimer}
        style={iconButtonStyle}
        disabled={isButtonDisabled}
      >
        {isRunning ? (
          <PauseCircleIcon fontSize="large" />
        ) : (
          <PlayCircleIcon fontSize="large" />
        )}
      </IconButton>
      <IconButton
        onClick={resetStopwatch}
        style={iconButtonStyle}
        disabled={isButtonDisabled}
      >
        <StopCircleIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default Timer;
