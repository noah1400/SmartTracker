/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { SerialPort } from 'serialport';
import { SmartTracker } from './SmartTracker/SmartTracker';
const ST = SmartTracker.getInstance();


class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// SmartTracker API

// connect(string, string)
// disconnect()
// ST.autoUpdate = true;
// ST.autoUpdateInterval = 1000;
ipcMain.handle('connect', async (event, username, password) => {
  console.log('Connecting to server...');
  try {
    await ST.connect(username, password);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});
ipcMain.handle('disconnect', async (event) => {
  console.log('Disconnecting from server...');
  try {
    await ST.disconnect();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});
ipcMain.handle('autoUpdate', async (event, autoUpdate: boolean) => {
  console.log('Setting autoUpdate to:', autoUpdate);
  try {
    ST.autoUpdate = autoUpdate;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});
ipcMain.handle('autoUpdateInterval', async (event, autoUpdateInterval: number) => {
  console.log('Setting autoUpdateInterval to:', autoUpdateInterval);
  try {
    ST.autoUpdateInterval = autoUpdateInterval;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

const dev = new SerialPort({ path: 'COM3', baudRate: 9600 });
dev.on('data', (data) => {
  const receivedData = data.toString();
  console.log('Received data from serial port:', receivedData);
  mainWindow?.webContents.send('serial-port-data', receivedData);
});
function sendDataOverSerial(data) {
  dev.write(data + '\n', (err) => {
    if (err) {
      console.error('Error writing to serial port:', err);
    } else {
      console.log('Data sent to serial port:', data);
    }
  });
}
sendDataOverSerial('rgb(20,20,20)');

ipcMain.on('send-to-device', (event, data) => {
  console.log("send to device");
  sendDataOverSerial(data);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  //dynamic window size
  const primaryDisplay = screen.getPrimaryDisplay();
  const screenSize = primaryDisplay.workAreaSize;
  let windowWidth = screenSize.width;
  let windowHeight = (3 / 4) * windowWidth;
  //check
  if (windowHeight > screenSize.height) {
    windowHeight = screenSize.height;
    windowWidth = (4 / 3) * windowHeight;
  }
  mainWindow = new BrowserWindow({
    show: false,
    width: windowWidth,
    height: windowHeight,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: true,
      scrollBounce: false,
    },
  });

  //const dev = new SerialPort({path: 'COM3', baudRate: 9600 });
  //dev.on('data', (data) => {
  //  console.log('Data:', data.toString());
  //});

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    createWindow();


    // await stLocalStorageInstance.init();
    // await stLocalStorageInstance.dumpDatabase();
    // await stLocalStorageInstance.databaseSize();

    // test API
    // await stAuthInstance
    //   .login('admin', 'admin')
    //   .then(async (result:any) => {
    //     console.log(result);
    //     const stApiInstance = new STApi();
    //     stApiInstance.token = result.data.token;

    //     const projects = await stApiInstance.getTimeEntryForUser('3');
    //     console.log(JSON.stringify(projects, null, 2));
    //   })
    //   .catch((err:any) => {
    //     console.log(err);
    //   });
    
    // ST.connect('admin', 'admin');
    // ST.autoUpdate = true;
    // ST.autoUpdateInterval = 1000;

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
