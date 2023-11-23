const { SerialPort } = require('serialport');
const fs = require('fs'); 

async function portPermissions(portPath){
  try{
    fs.chmod(portPath, '666'); 
    console.log("Permissions updated"); 
  } catch (err){
    console.error("Error giving permissions"); 
  }
}

function listSerialPorts() {
  const portsTable = document.getElementById('ports');

  SerialPort.list()
    .then((ports) => {
      if (ports.length === 0) {
        document.getElementById('error').textContent = 'No ports discovered';
        return;
      } else {
        document.getElementById('error').textContent = '';
      }

      portsTable.innerHTML = '';

      const tableHeader = document.createElement('tr');
      tableHeader.innerHTML = '<th>Port</th><th>Manufacturer</th><th>Serial Number</th><th>Location</th><th>Vendor ID</th><th>Product ID</th>';
      portsTable.appendChild(tableHeader);

      ports.forEach((port) => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `<td>${port.path}</td><td>${port.manufacturer || ''}</td><td>${port.serialNumber || ''}</td><td>${port.location || ''}</td><td>${port.vendorId || ''}</td><td>${port.productId || ''}</td>`;
        tableRow.addEventListener('click', () => {
          portPermissions(port.path);
          connectToPort(port.path, 9600);
        });
        portsTable.appendChild(tableRow);
      });
    })
    .catch((err) => {
      document.getElementById('error').textContent = err.message;
    });
}

let selectedPort;

function connectToPort(portPath, baudRate) {
  console.log('Connecting to port:', portPath);

  if (selectedPort) {
    selectedPort.close();
  }

  try {
    selectedPort = new SerialPort( {path: portPath, baudRate });
  } catch (err) {
    console.error(`Error creating SerialPort: ${err.message}`);
    return;
  }

  selectedPort.on('data', (data) => {
    console.log(`Received data: ${data}`);
    document.getElementById('receivedData').innerText = `Received data: ${data}`;
  });

  selectedPort.on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
}

function listPorts() {
  listSerialPorts();
  setTimeout(listPorts, 2000);
}

setTimeout(listPorts, 2000);
