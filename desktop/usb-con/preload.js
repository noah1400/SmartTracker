const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const deviceList = document.getElementById('deviceList');

    const updateDeviceList = (devices) => {
        // Clear previous content
        deviceList.innerHTML = '';

        // Display  device infos
        devices.forEach(device => {
            const deviceInfoElement = document.createElement('div');
            deviceInfoElement.innerHTML = `
                <p><strong>Vendor ID:</strong> ${device.vendorId}</p>
                <p><strong>Product ID:</strong> ${device.productId}</p>
                <p><strong>Serial Number:</strong> ${device.serialNumber}</p>
                <hr>
            `;
            deviceList.appendChild(deviceInfoElement);
        });
    };

    // Initial device list display
    ipcRenderer.send('getDevices');
    
    // Update device list when devices change
    ipcRenderer.on('devices', (_event, devices) => {
        updateDeviceList(devices);
    });
});
