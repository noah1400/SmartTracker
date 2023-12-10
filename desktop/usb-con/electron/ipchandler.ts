import { BrowserWindow, IpcMainEvent, ipcMain } from "electron";
import { IPC_ACTIONS } from "./ipcActions"

const {
    GET_DEVICES
} = IPC_ACTIONS.window; 

const handelDevices = (event: IpcMainEvent, devices: any) => {
    const webContents = event?.sender; 
    const window = BrowserWindow.fromWebContents(webContents); 

    console.log("hi"); 
    window?.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
        // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
        // is called.
        window?.webContents.session.on('serial-port-added', (event, port) => {
          console.log('serial-port-added FIRED WITH', port)
          // Optionally update portList to add the new port
        })
    
        window?.webContents.session.on('serial-port-removed', (event, port) => {
          console.log('serial-port-removed FIRED WITH', port)
          // Optionally update portList to remove the port
        })
    
        event.preventDefault()
        if (portList && portList.length > 0) {
          callback(portList[0].portId)
        } else {
          // eslint-disable-next-line n/no-callback-literal
          callback('') // Could not find any matching devices
        }
    }) 

}; 

const ipcHandlers = [
    {
        event: GET_DEVICES, 
        callback: handelDevices 
    }
]; 

export const registerIPCHandlers = () => {
    ipcHandlers.forEach((handler: {event: string, callback: any}) => {
    ipcMain.on(handler.event, handler.callback); 
    }); 
}; 