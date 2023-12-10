import React, { useState } from 'react';

const SerialComp: React.FC<{ usbVendorId?: number; usbProductId?: number }> = ({ usbVendorId, usbProductId }) => {
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  const testIt = async () => {
    const filters = [
      { usbVendorId: usbVendorId ?? 0x2341, usbProductId: usbProductId ?? 0x0043 }, // Replace with ESP32 USB vendor and product IDs
    ];
    console.log("button clicked")
    try {
      const port = await navigator.serial.requestPort({ filters });
      const portInfo = port.getInfo();
      setDeviceInfo(`vendorId: ${portInfo.usbVendorId} | productId: ${portInfo.usbProductId}`);
    } catch (ex:any) {
      if (ex.name === 'NotFoundError') {
        setDeviceInfo('Device NOT found');
      } else {
        setDeviceInfo(String(ex));
      }
    }
  };

  return (
    <div>
      <h1>Device Information</h1>
      <button onClick={testIt}>Test Web Serial API</button>
      <p>{`Matching ESP32 device: ${deviceInfo}`}</p>
    </div>
  );
};

export default SerialComp; 