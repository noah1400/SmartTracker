// SerialComp.tsx
import React, { useState, useEffect } from 'react';
import { getDevices } from './IPCMessages';

interface DeviceInfo {
  usbVendorId: any;
  usbProductId: any;
}

const SerialComp: React.FC = () => {
  const [deviceList, setDeviceList] = useState<DeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [serialPort, setSerialPort] = useState<any>(null);

  

  return (
    <div>
      <h1>Device Information</h1>
      <button onClick={() => getDevices()}> test </button>
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
