import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

const SerialPortList: React.FC = () => {
  const [ports, setPorts] = useState<string[]>([]);
  const [receivedData, setReceivedData] = useState<string>('');


  useEffect(() => {
    // Fetch serial ports from main process based on project configuration
    window.electron.ipcRenderer.fetchData('serial-data');

    // Listen for serial ports from main process
    ipcRenderer.on('serial-data', (event, data) => {
      setReceivedData(data);

    });

    // Clean up by removing event listeners on component unmount
    return () => {
      ipcRenderer.removeAllListeners('serial-ports');
    };
  }, []);


  return (
    <div>
      <h2>Serial USB Devices:</h2>
      <ul>
        {ports.map((port) => (
          <li key={port}>{port}</li>
        ))}
      </ul>
      <div>
        <h2>Received Data:</h2>
        <p>{receivedData}</p>
      </div>
    </div>
  );
};

export default SerialPortList;