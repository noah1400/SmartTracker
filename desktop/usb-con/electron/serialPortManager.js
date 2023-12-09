// SerialPortManager.js

const { SerialPort } = require("serialport");

class SerialPortManager {
  constructor() {
    this.selectedPort = null;
  }

  listSerialPorts() {
    return SerialPort.list();
  }

  connectToPort(portPath, baudRate) {
    console.log("Connecting to port:", portPath);

    if (this.selectedPort) {
      this.selectedPort.close();
    }

    try {
      this.selectedPort = new SerialPort({ path: portPath, baudRate });

      this.selectedPort.on("data", (data) => {
        console.log(`Received data: ${data}`);
      });

      this.selectedPort.on("error", (err) => {
        console.error(`Error: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error creating SerialPort: ${err.message}`);
    }
  }

  closePort() {
    if (this.selectedPort) {
      this.selectedPort.close();
      this.selectedPort = null;
    }
  }
}

module.exports = SerialPortManager;