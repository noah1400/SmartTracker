import React, { useEffect, useState } from 'react';
import SerialPortManager from '../../electron/serialPortManager.js'; // Adjust the path accordingly

const { ipcRenderer } = window.require('electron');

const SerialPortComponent = () => {
  const [ports, setPorts] = useState([]);

  const listSerialPorts = async () => {
    try {
      const ports = await SerialPortManager.listSerialPorts(); 
      setPorts(ports);
    } catch (error) {
      console.error('Error listing serial ports:', error);
    }
  };

  useEffect(() => {
    listSerialPorts();
  }, []);

  const handlePortClick = (portPath) => {
    ipcRenderer.send('selected-port', portPath);
  };

  return (
    <div>
      <h2>Serial Ports</h2>
      <table>
        <thead>
          <tr>
            <th>Port</th>
            <th>Manufacturer</th>
            <th>Serial Number</th>
            <th>Location</th>
            <th>Vendor ID</th>
            <th>Product ID</th>
          </tr>
        </thead>
        <tbody>
          {ports.map((port) => (
            <tr key={port.path} onClick={() => handlePortClick(port.path)}>
              <td>{port.path}</td>
              <td>{port.manufacturer || 'Unknown Manufacturer'}</td>
              <td>{port.serialNumber || ''}</td>
              <td>{port.location || ''}</td>
              <td>{port.vendorId || ''}</td>
              <td>{port.productId || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SerialPortComponent;