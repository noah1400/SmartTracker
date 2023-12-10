import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, ipcMain, webFrame } from "electron";
import { IPC_ACTIONS } from "./ipcActions";

const {
    GET_DEVICES,
    SEND_SERIAL_USB_DEVICE_LIST
} = IPC_ACTIONS.window;

export const registerIPCHandlers = () => {
    const handleDevices = async (event: IpcMainInvokeEvent, devices: any) => {
        const webContents = event?.sender;
        const window = BrowserWindow.fromWebContents(webContents);

        console.log("hi");
        try {
            console.log("what");
            // Enable the experimental Web Serial API feature
            webFrame.executeJavaScript('navigator.serial.requestPort()');

            const ports = await navigator.serial.getPorts();
            const serialUSBDeviceList = ports.map(port => ({
                usbVendorId: port.getInfo().usbVendorId,
                usbProductId: port.getInfo().usbProductId,
                // Add more properties as needed
            }));

            // Send the list of serial USB devices via the action to test.tsx
            window?.webContents.send(GET_DEVICES, serialUSBDeviceList);
        } catch (error) {
            console.error('Error getting serial USB device list:', error);
        }
    };

    ipcMain.handle(GET_DEVICES, handleDevices);
};