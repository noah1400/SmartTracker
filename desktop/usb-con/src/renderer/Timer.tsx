import React, { useState, useEffect } from 'react';
import './Timer.css';

interface TimerProps{
  onTimeToggle: (time: {hours: any, minutes: any, seconds: number}) => void; 
}
const Timer: React.FC<TimerProps> = ({onTimeToggle}) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false); 

  useEffect(() => {
    let intervalId: any; 
    if(isRunning){
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = {
            hours: prevTime.hours,
            minutes: prevTime.minutes,
            seconds: prevTime.seconds + 1,
          };
  
          // Update minutes and reset seconds when reaching 60 seconds
          if (newTime.seconds === 60) {
            newTime.minutes += 1;
            newTime.seconds = 0;
          }
  
          // Update hours and reset minutes when reaching 60 minutes
          if (newTime.minutes === 60) {
            newTime.hours += 1;
            newTime.minutes = 0;
          }
  
          return newTime;
        });
      }, 1000);
    } else {
      onTimeToggle(time); //pass time to parent on stop
    }

    return () => {
      clearInterval(intervalId); 
      if(!isRunning){
        setTime({ hours: 0, minutes: 0, seconds: 0}); 
      }
    }; 
  }, [isRunning, time]); 

  const toggleTimer = () => {
    if(isRunning){
      onTimeToggle(time); //to parent component
      setTime({ hours: 0, minutes: 0, seconds: 0 }); //reset
    }
    setIsRunning(!isRunning);  
  }
  const formatTime = (timeObject:any) => {
    const { hours, minutes, seconds } = timeObject;
    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <p className="timer-display">{formatTime(time)}</p>
      <button onClick={toggleTimer}>
        {isRunning ? 'stop' : 'start'} Timer
      </button>
    </div>
  );
};

export default Timer;
