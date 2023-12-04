const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const deviceList = document.getElementById('deviceList');


    ipcRenderer.send('getDevices');
    
    ipcRenderer.on('devices', (_event, devices) => {
        updateDeviceList(devices);
    });
});
