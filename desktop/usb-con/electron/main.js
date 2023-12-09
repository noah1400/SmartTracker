const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const SerialPortManager = require("./serialPortManager");

let win;   
const serialPortManager = new SerialPortManager();

const createWindow = () => {
  // Create window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, //allow require
      contextIsolation: false, // allow use with higher electron version
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.openDevTools();

  ipcMain.on("list-serial-ports", async (event) => {
    // Send the list of serial ports to the renderer process
    const ports = await serialPortManager.listSerialPorts();
    win.webContents.send("serial-ports-listed", ports);
  });

  ipcMain.on("selected-port", (event, portPath) => {
    // Handle the selected port in the main process
    // You can communicate with your SerialPortManager here
    console.log("Selected port in main process:", portPath);
    serialPortManager.connectToPort(portPath, 9600); // Replace with your desired baud rate
  });

  win.on("closed", () => {
    win = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});