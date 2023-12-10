// src/components/App.tsx
import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { SerialPortManager } from '../electron/deviceManager'; 

const App: React.FC = () => {
  const [serialData, setSerialData] = useState<string[]>([]);

  useEffect(() => {
    // Replace 'COM3' with your actual port name
    const serialPort = new SerialPortManager('COM4');

    return () => {
      // Cleanup or close the serial port if needed
    };
  }, []);

  useEffect(() => {
    // Handle data received from the main process
    const handleSerialData = (event: Electron.IpcRendererEvent, data: string) => {
      setSerialData((prevData) => [...prevData, data]);
    };

    ipcRenderer.on('serial-data', handleSerialData);

    return () => {
      // Remove the event listener when the component unmounts
      ipcRenderer.removeListener('serial-data', handleSerialData);
    };
  }, []);

  return (
    <div className="App">
      <h1>Electron React Serialport</h1>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {serialData.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
