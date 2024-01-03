import React, { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import './Timer.css';
import { IconButton, TextField } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Project } from './types';

interface TimeEntry {
  localId: number | null;
  startTime: Date;
  endTime: Date | null;
  description: string;
  projectId: number;
}

interface TimerProps {
  activeProject: Project | null;
  activeColor: string;
  activeLocalID: number | null;
  onTimeToggle: (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => void;
}

const Timer: React.FC<TimerProps> = ({
  activeProject,
  activeColor,
  activeLocalID,
  onTimeToggle,
}) => {
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [timeEntry, setTimeEntry] = useState<TimeEntry[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (activeProject) {
      resetStopwatch();
    }
  }, [activeProject]);

  const toggleTimer = () => {
    if (!isRunning) {
      const startTimestamp = new Date();
      start();
      setStartTime(startTimestamp);
      console.log('start: ', startTimestamp);
    } else {
      pause();
      const endTime = new Date();
      onTimeToggle({ hours, minutes, seconds });
      if (startTime) {
        addTimeEntry(
          startTime,
          endTime,
          'Test description',
          activeProject ? activeProject.dataValues.localID : -1,
        );
      }
      setStartTime(null);
      console.log('end: ', endTime);
    }
  };

  const addTimeEntry = async (
    startTime: Date,
    endTime: Date,
    description: string,
    projectId: number,
  ) => {
    try {
      const response = await window.smarttracker.addTimeEntry(
        startTime,
        endTime,
        description,
        projectId,
      );
      if (response.success) {
        console.log('Time entry added');
      } else {
        console.log('Failed to add time entry', response.error);
      }
    } catch (error) {
      console.error('Error adding time entry:', error);
    }
  };
  const resetStopwatch = () => {
    if (startTime) {
      const endTime = new Date();
      addTimeEntry(
        startTime,
        endTime,
        'Test description 2',
        activeProject ? activeProject.dataValues.localID : -1,
      );
    }
    reset(new Date(0), false);
    pause();
    setStartTime(null);
  };

  const formatTime = () =>
    `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(
      2,
      '0',
    )} : ${String(seconds).padStart(2, '0')}`;

  const iconButtonStyle = {
    color: activeColor,
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
      <div>
        <TextField
          label="Notes"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ margin: '10px' }}
          sx={{
            input: { color: 'white' }, // Changes the text color
            '& label': { color: 'grey' }, // Changes the label color
            '& label.Mui-focused': { color: activeColor }, // Changes the label color when focused
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' }, // Changes the border color
              '&:hover fieldset': { borderColor: 'white' }, // Changes the border color on hover
              '&.Mui-focused fieldset': { borderColor: 'white' }, // Changes the border color when focused
            },
          }}
        />
      </div>
    </div>
  );
};

export default Timer;
