import { SerialPort } from 'serialport';

let dev: any;
let previousPorts: any[] = [];

function arePortsEqual(ports1: any, ports2: any) {
  if (ports1.length !== ports2.length) {
    return false;
  }
  const sortedPorts1 = ports1.slice().sort();
  const sortedPorts2 = ports2.slice().sort();
  return sortedPorts1.every((port: any, index: any) => port.path === sortedPorts2[index].path);
}

declare const mainWindow: any;

function connectToPort(portPath: any) {
  dev = new SerialPort({ path: portPath, baudRate: 9600 });
  dev.on('data', (data: any) => {
    const receivedData = data.toString();
    console.log('Received data from serial port:', receivedData);
    mainWindow?.webContents.send('serial-port-data', receivedData);
  });
  dev.on('close', () => {
    console.log(`Connection closed for ${portPath}`);
    dev = null;
  });
  console.log(`Connected to ${portPath}`);
}

export function updateAndConnect() {
  SerialPort.list().then((ports) => {
    console.log('Available COM devices:');
    ports.forEach((port) => {
      console.log(port.manufacturer);
    });
    if (!arePortsEqual(ports, previousPorts)) {
      previousPorts = ports.slice();
      const targetManufacturer = 'wch.cn';
      const selectedPort = ports.find(port => port.manufacturer === targetManufacturer);
      if (selectedPort) {
        if (!dev || dev.path !== selectedPort.path) {
          if (dev) {
            dev.close();
          }
          connectToPort(selectedPort.path);
        }
      } else {
        if (dev) {
          dev.close();
        }
        console.log(`No device with ${targetManufacturer} found.`);
      }
    } else {
      console.log('No changes in the list of available devices.');
    }
  }).catch((err) => {
    console.error('Error during COM port operation', err);
  });
}
export function sendDataOverSerial(data: any) {
  if (dev) {
    dev.write(data + '\n', (err: any) => {
      if (err) {
        console.error('Error writing to serial port:', err);
      } else {
        console.log('Data sent to serial port:', data);
      }
    });
  } else {
    console.log('Serial port not connected');
  }
}