interface Navigator {
    serial: Serial;
  }
  
  interface Serial {
    requestPort(options?: SerialRequestOptions): Promise<SerialPort>;
  }
  
  interface SerialRequestOptions {
    filters?: SerialPortFilter[];
  }
  
  interface SerialPortFilter {
    usbVendorId?: number;
    usbProductId?: number;
  }
  
  interface SerialPort {
    getInfo(): SerialPortInfo;
    // Add other methods or properties you need
  }
  
  interface SerialPortInfo {
    usbVendorId: number;
    usbProductId: number;
    // Add other properties you need
  }
  