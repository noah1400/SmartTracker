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

const createWindow = async () => {
  // Create window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, //allow require
      contextIsolation: false, // allow use with higher electron version
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  win.webContents.openDevTools();

  stAuthInstance.init()

  

  stAuthInstance.login("admin", "admin")
    .then(async (result) => {

      console.log(result)
      const stApiInstance = new STApi()
      stApiInstance.token = stAuthInstance.token

      await stApiInstance.createUser("testuser12354", "testuser@gmail.com", "test", "test", "user")
        .then(async (result) => {
          const user = await stApiInstance.getUser(result.data.createUser.id).catch((err) => {
            console.error("ERROR:", err.message)
          })

          const deleteUserResult = await stApiInstance.deleteUser(result.data.createUser.id).catch((err) => {
            console.error("ERROR Message on delete:", err.message)
          })
        })
        .catch((err) => {
          console.error("ERROR Message on create:", err.message)
        })
    })
    .catch((err) => {
      console.error(err)
    })

};

app.whenReady().then(async () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});