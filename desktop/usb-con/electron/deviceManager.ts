import { SerialPort } from 'serialport';
import { BrowserWindow } from 'electron';
import { getMainWindow } from './eGlobal';


export class SerialPortManager {
  private port: SerialPort;
  private win: BrowserWindow | null;

  constructor(portPath: string) {
    this.port = new SerialPort({path: portPath, baudRate: 9600 });
    this.win = getMainWindow();

    this.port.on('data', (data: Buffer) => {
   
      const dataString = data.toString();

      if (this.win) {
        this.win.webContents.send('serial-data', dataString);
      }
    });
  }

}