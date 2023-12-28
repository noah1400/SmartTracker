import React, { useState, useEffect } from 'react';
import './Timer.css';
import { IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';

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

  const toggleTimer = () => {
    if (isRunning) {
      // Timer is running and will be stopped
      setStartTime(null);
      onTimeToggle(time);
    } else {
      // Timer is stopped and will be started
      if (startTime === null) {
        setStartTime(new Date().getTime());
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    onTimeToggle(time);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
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

  return (
    <div className="timer-container">
      <p className="timer-display">{formatTime(time)}</p>
      <IconButton onClick={toggleTimer} size="large">
        {isRunning ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </IconButton>
      <IconButton onClick={resetTimer}>
        <StopCircleIcon />
      </IconButton>
    </div>
  );
};

export default Timer;
