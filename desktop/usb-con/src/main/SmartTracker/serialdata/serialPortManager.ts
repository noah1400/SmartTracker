import { SerialPort } from 'serialport';

let dev;
let previousPorts = [];

function arePortsEqual(ports1, ports2) {
  if (ports1.length !== ports2.length) {
    return false;
  }
  const sortedPorts1 = ports1.slice().sort();
  const sortedPorts2 = ports2.slice().sort();
  return sortedPorts1.every((port, index) => port.path === sortedPorts2[index].path);
}

function connectToPort(portPath) {
  dev = new SerialPort({ path: portPath, baudRate: 9600 });
  dev.on('data', (data) => {
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