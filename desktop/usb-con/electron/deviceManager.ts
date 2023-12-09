import { ipcMain } from 'electron';
import { SerialPort } from 'serialport';
const Readline = require('@serialport/parser-readline')

ipcMain.handle('getSerialData', async (_event, _args) => {
  const serialData: string[] = [];

  // Example: List available serial ports
  const ports = await SerialPort.list();
  
  // Example: Read data from each available serial port
  for (const port of ports) {
    try {
      const data = await readDataFromSerialPort(port.path);
      serialData.push(data);
    } catch (error:any) {
      console.error(`Error reading data from ${port.path}: ${error.message}`);
    }
  }

  return serialData;
});

async function readDataFromSerialPort(portPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const port = new SerialPort({path: portPath, baudRate: 9600 });

    const parser = port.pipe(new Readline({ delimiter: '\n' }));

    parser.on('data', (data: string) => {
      resolve(data);
      port.close();
    });

    port.on('error', (error: Error) => {
      reject(error);
    });

    port.on('open', () => {
      // Additional configuration if needed
    });
  });
}
