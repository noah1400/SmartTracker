// src/DeviceInfo.tsx
import React, { useState, useEffect } from 'react';

const SerialComp: React.FC<{ usbVendorId?: number; usbProductId?: number }> = ({  }) => {
  const [deviceList, setDeviceList] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [serialPort, setSerialPort] = useState<SerialPort | null>(null);
  const listDevices = async () => {

    try {
      const ports = await navigator.serial.requestPort();
      const portInfo= ports.getInfo(); 
      const deviceInfo = `vendorId: ${portInfo.usbVendorId} | productId: ${portInfo.usbProductId}`;
      setDeviceList([deviceInfo]);
    } catch (ex) {
      console.error("Error listing serial ports:", ex);
      setDeviceList([]);
    }
  };

  const connectToDevice = async () => {
    if (selectedDevice) {
      try {
        //logic
        const ports = await navigator.serial.requestPort();
        const selectedPort = (ports as any).find((port: SerialPort) => {
          const portInfo = port.getInfo();
          return `vendorId: ${portInfo.usbVendorId} | productId: ${portInfo.usbProductId}` === selectedDevice;
        });

        if (selectedPort) {
          // Open the selected port
          await selectedPort.open();

          // Save the reference to the open port
          setSerialPort(selectedPort);

          // Your logic to start communication goes here
          selectedPort.addEventListener('data', (data:any) => {
          console.log('Received data:', data);
          });

       
        }
        console.log('Connected to device:', selectedDevice);
      } catch (ex) {
        console.error("Error connecting to serial port:", ex);
      }
    }
  };

  useEffect(() => {
    listDevices();
  }, []); 

  return (
    <div>
      <h1>Device Information</h1>
      <button onClick={listDevices}>List Connected Devices</button>

      <ul>
        {deviceList.map((device, index) => (
          <li key={index} onClick={() => setSelectedDevice(device)}>
            {device}
          </li>
        ))}
      </ul>

      <button onClick={connectToDevice} disabled={!selectedDevice}>
        Connect to Selected Device
      </button>
    </div>
  );
};

export default SerialComp;
