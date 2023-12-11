declare interface Navigator {
  serial: {
    getPorts(): Promise<SerialPort[]>;
    requestPort(options?: any): Promise<SerialPort>;
    // Add other methods and properties as needed
  };
}

declare interface Window {
  serial: Navigator['serial'];
}

interface Serial {
  requestPort(options?: SerialRequestOptions): Promise<SerialPort>;
}

interface SerialRequestOptions {
  filters?: SerialPortFilter[];
}

interface SerialPortFilter {
  usbVendorId?: any;
  usbProductId?: any;
}

interface SerialPort {
  getInfo(): SerialPortInfo;
  // other methods
}

interface SerialPortInfo {
  usbVendorId: any;
  usbProductId: any;
  // other properties you need
}
