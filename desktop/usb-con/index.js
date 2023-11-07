const { app, BrowserWindow } = require('electron');
const path = require('path');
const usb = require('usb');


let windows = [];

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
};

const showDevices = async (win) => {
    const devices = usb.getDeviceList(); 
    const deviceInfo = devices.map((device,index) => {
        return `Device ID: ${index + 1}
        Device: ${device.deviceDescriptor.idVendor}:${device.deviceDescriptor.idProduct}
        Type: ${device.deviceDescriptor.iProduct}
        Bus: ${device.busNumber}
        Address: ${device.deviceAddress}
        Ports: ${device.portNumbers}
        Manufacturer: ${device.deviceDescriptor.iManufacturer}
        Serial Number: ${device.deviceDescriptor.iSerialNumber || '<no serial>'} \n`;
            });

    if (win) {
        win.webContents.send('devices', deviceInfo.join('\n'));
    }
};


app.whenReady().then(() => {
    createWindow();
    
    showDevices(windows[0]);

    usb.on('attach', () => {
        showDevices(windows[0]);
    });

    usb.on('detach', () => {
        showDevices(windows[0]);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    
});


app.on('window-all-closed', () => {

    app.quit();

});

