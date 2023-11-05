const { app, BrowserWindow } = require('electron');
const path = require('path');
const usb = require('usb');

let windows = [];

const webusb = new usb.WebUSB({
    allowAllDevices: true
});

const getDeviceName = (device) => {
    try {
        if (device.deviceDescriptor.iProduct !== 0) {
            return device.getStringDescriptor(device.deviceDescriptor.iProduct);
        } else {
            return '<no name>';
        }
    } catch (error) {
        return '<no name>';
    }
};

const createWindow = () => {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');

    win.webContents.openDevTools();

    windows.push(win);
    showDevices(win);
};

const showDevices = async (win) => {
    const devices = await webusb.getDevices();
    const deviceInfo = devices.map(d => {
        const name = getDeviceName(d);
        return `${name}\t${d.vendorId}\t${d.productId}\t${d.serialNumber || '<no serial>'}`;
    });
    deviceInfo.unshift('Name\tVID\tPID\tSerial\n-------------------------------------');

    if (win) {
        win.webContents.send('devices', deviceInfo.join('\n'));
    }
};

const logConnection = (device, action) => {
    const deviceName = getDeviceName(device);
    const deviceInfo = `Name: ${deviceName}, VID: ${device.vendorId}, PID: ${device.productId}, Serial: ${device.serialNumber || '<no serial>'}`;
    console.log(`USB Device ${action}: ${deviceInfo}`);
};

app.whenReady().then(() => {
    webusb.addEventListener('connect', (device) => {
        logConnection(device, 'connected');
        showDevices(windows[0]);
    });

    webusb.addEventListener('disconnect', (device) => {
        logConnection(device, 'disconnected');
        showDevices(windows[0]);
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    webusb.removeEventListener('connect', showDevices);
    webusb.removeEventListener('disconnect', showDevices);

    app.quit();

});

