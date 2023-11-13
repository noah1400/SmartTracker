const { app, BrowserWindow } = require('electron');
const path = require('path');
const usb = require('usb');

let windows = [];

const webusb = new usb.WebUSB({
    allowAllDevices: true
});

//Simple Device List via WebUSB function
const showDevices = async (win) => {
    const devices = await webusb.getDevices();
    const deviceInfo = devices.map(d => ({
        vendorId: d.vendorId,
        productId: d.productId,
        serialNumber: d.serialNumber || '<no serial>',
    }));

    if (win) {
        win.webContents.send('devices', deviceInfo);
    }
};


const createWindow = () => {
    // Create window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');

    win.webContents.openDevTools()

    windows.push(win);
    //Show DeviceList when starting the App
    win.webContents.on('did-finish-load', () => {
        showDevices(win);
    });
};

app.whenReady().then(() => {
    createWindow();

    //USB Eventlistener via API 
    webusb.addEventListener('connect', () => {
        windows.forEach(win => showDevices(win));
    });
    webusb.addEventListener('disconnect', () => {
        windows.forEach(win => showDevices(win));
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    showDevices(windows[0]); 
});


app.on('window-all-closed', () => {
    webusb.removeEventListener('connect', showDevices);
    webusb.removeEventListener('disconnect', showDevices);

    app.quit();
});