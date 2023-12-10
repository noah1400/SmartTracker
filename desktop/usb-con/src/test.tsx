import React, { useEffect } from 'react';
import { getUSBDeviceList } from './IPCMessages';



function Test() {
  // Call the getUSBDeviceList function to request the USB device list

  return (
    <div>
      <button onClick={() => {getUSBDeviceList();} }>TEST</button>
    </div>
  );
}

export default Test;