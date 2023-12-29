import React, { useState, useEffect } from 'react';
import './Timer.css';
import { IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { act } from 'react-test-renderer';

interface TimerProps {
  onTimeToggle: (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => void;
  activeProject: any;
}
const Timer: React.FC<TimerProps> = ({ onTimeToggle, activeProject }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0); //track total
  const [lastActiveProj, setLastActiveProj] = useState(activeProject);
  const [prevProj, setPrevProj] = useState(null);

  useEffect(() => {
    let intervalId: any;
    if (isRunning && activeProject) {
      intervalId = setInterval(() => {
        setTotalElapsedSeconds((prevTotal) => prevTotal + 1);
        const hours = Math.floor(totalElapsedSeconds / 3600);
        const minutes = Math.floor((totalElapsedSeconds % 3600) / 60);
        const seconds = totalElapsedSeconds % 60;

        setTime({ hours, minutes, seconds });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, activeProject, totalElapsedSeconds]);

  useEffect(() => {
    if (activeProject !== lastActiveProj) {
      if (totalElapsedSeconds > 0) {
        onTimeToggle(time);
      }
      resetTimer();
      setLastActiveProj(activeProject);
    }
  }, [activeProject]);

  const toggleTimer = () => {
    if (!isRunning) {
      setLastActiveProj(activeProject);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    onTimeToggle(time);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setTotalElapsedSeconds(0);
    setIsRunning(false);
    setStartTime(null);
    console.log('reset done');
  };
  const formatTime = (timeObject: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    const { hours, minutes, seconds } = timeObject;
    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(
      2,
      '0',
    )} : ${String(seconds).padStart(2, '0')}`;
  };

  const iconButtonStyle = {
    color: activeProject ? activeProject.color : 'white',
  };
  const isButtonDisabled = !activeProject;
  const disabledButtonStyle = isButtonDisabled ? { color: 'grey', cursor: 'no active project' } : {};

  return (
    <div className="timer-container">
      <p className="timer-display">{formatTime(time)}</p>
      <IconButton
        onClick={toggleTimer}
        style={{ ...iconButtonStyle, ...disabledButtonStyle }}
        disabled={!activeProject}
      >
        {isRunning ? (
          <PauseCircleIcon fontSize="large" />
        ) : (
          <PlayCircleIcon fontSize="large" />
        )}
      </IconButton>
      <IconButton
        onClick={resetTimer}
        style={{...iconButtonStyle, ...disabledButtonStyle }}
        disabled={!activeProject}
      >
        <StopCircleIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default Timer;
