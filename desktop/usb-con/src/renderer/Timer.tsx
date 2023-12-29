import React, { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import './Timer.css';
import { IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';

interface Project {
  id: number;
  name: string;
  color: string;
  totalTime: { hours: number; minutes: number; seconds: number };
}

interface TimeLog {
  projectId: string;
  startTime: Date;
  endTime: Date;
}

interface TimerProps {
  activeProject: Project | null;
  onTimeToggle: (time: { hours: number; minutes: number; seconds: number }) => void;

}

const Timer: React.FC<TimerProps> = ({ activeProject, onTimeToggle }) => {
  const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(() => {
    const savedLogs = localStorage.getItem('timeLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  useEffect(() => {
    localStorage.setItem('timeLogs', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    if (activeProject) {
      resetStopwatch();
    }
  }, [activeProject]);

  const toggleTimer = () => {
    if (!isRunning) {
      start();
      //timeLogs.push({ projectId: activeProject ? activeProject.id : '', startTime: new Date(), endTime: new Date() });
    } else {
      pause();
      onTimeToggle({ hours, minutes, seconds });
    }
  };

  const resetStopwatch = () => {
    reset(new Date(0), false);
  };

  const formatTime = () => `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;

  const iconButtonStyle = {
    color: activeProject ? activeProject.color : 'white',
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
        {isRunning ? <PauseCircleIcon fontSize="large" /> : <PlayCircleIcon fontSize="large" />}
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
