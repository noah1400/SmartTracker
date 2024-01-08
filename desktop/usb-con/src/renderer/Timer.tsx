import React, { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import './Timer.css';
import {
  CircularProgress,
  IconButton,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Project } from './types';


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
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const totalDuration = 60; // progress in seconds

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
      console.log("s: \n",  startTime, "\ne: \n", endTime, "\nd: \n", description, "\nid: \n", projectId); 
      const response = await window.smarttracker.addTimeEntry(
        startTime,
        endTime,
        description,
        projectId,
      ); 
      if(response.success) {
        console.log("Time entry added");
      } else {
        console.log("Failed to add time entry", response.error);
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
  const elapsedTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
  const timeValue =
    ((elapsedTimeInSeconds % totalDuration) / totalDuration) * 100;

  return (
    <Box className="timer-container" position="relative" textAlign="center">
      <CircularProgress
        variant="determinate"
        value={timeValue}
        className="circular-progress"
        thickness={2.8}
        size={280}
        sx={{
          color: activeColor,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'square',
          },
        }}
      />
      <Box className="timer-display" position="relative" zIndex="2" sx={{marginTop: '30px',}}>
        {formatTime()}
      </Box>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <IconButton
           className="timer-actions"
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
        </Grid>
        <Grid item>
          <IconButton
            className="timer-actions"
            onClick={resetStopwatch}
            style={iconButtonStyle}
            disabled={isButtonDisabled}
          >
            <StopCircleIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Box 
        sx={{
          marginTop: '130px',
          input: { color: 'white' },
          '& label': { color: 'grey' },
          '& label.Mui-focused': { color: activeColor },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: 'white' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
        }}
      >
        <TextField
          className="notes-textfield"
          label="Notes"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default Timer;
