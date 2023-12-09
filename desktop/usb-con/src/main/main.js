const { app, BrowserWindow } = require("electron");
const path = require("path");
const usb = require("usb");
const { STAuth } = require("stauth");
const { STApi } = require("stapi");
const stAuthInstance = new STAuth();

let win;


//Simple Device List via WebUSB function
const showDevices = async (win) => {
  const devices = await webusb.getDevices();
  const deviceInfo = devices.map((d) => ({
    vendorId: d.vendorId,
    productId: d.productId,
    serialNumber: d.serialNumber || "<no serial>",
  }));

  if (win) {
    win.webContents.send("devices", deviceInfo);
  }
};

const createWindow = () => {
  // Create window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, //allow require
      contextIsolation: false, // allow use with higher electron version
      preload: path.join(__dirname,"preload.js"),
    },
  });

  win.loadFile("index.html");

  win.webContents.openDevTools();

};

app.whenReady().then(async () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  stAuthInstance.init()

  const loginResult = await stAuthInstance.login("admin", "admin")

  console.log(loginResult, stAuthInstance.token)

  const stApiInstance = new STApi()
  stApiInstance.token = stAuthInstance.token

  const timeEntries = await stApiInstance.getTimeEntryForUser("1")

  console.log(JSON.stringify(timeEntries, null, 2))
});

app.on("window-all-closed", () => {
  app.quit();
});