// SerialComp.tsx
import React, { useState, useEffect } from 'react';

interface DeviceInfo {
  usbVendorId: any;
  usbProductId: any;
}

const SerialComp: React.FC = () => {
  const [deviceList, setDeviceList] = useState<DeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [serialPort, setSerialPort] = useState<any>(null);

  
const listDevices = async () => {
  try {
    // Use ipcRenderer.invoke to request serial ports from the main process
    const ports = await ipcRenderer.invoke('get-serial-ports');
    setDeviceList(ports);
  } catch (ex) {
    console.error('Error listing serial ports:', ex);
    setDeviceList([]);
  }
};

const connectToDevice = async () => {
  if (selectedDevice) {
    try {
      // Send selected device information to the main process
      ipcRenderer.send('connect-to-device', selectedDevice);
    } catch (ex) {
      console.error('Error sending connect-to-device message:', ex);
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
      <table>
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>Product ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deviceList.map((device, index) => (
            <tr key={index}>
              <td>{device.usbVendorId}</td>
              <td>{device.usbProductId}</td>
              <td>
                <button onClick={() => setSelectedDevice(device)}>Connect</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={connectToDevice} disabled={!selectedDevice}>
        Connect to Selected Device
      </button>
    </div>
  );
};

export default SerialComp;
