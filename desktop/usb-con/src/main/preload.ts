// preload.ts

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { SmartTracker } from './SmartTracker/SmartTracker';

export type Channels = 'ipc-example' | 'data' | 'serial-port-data';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

ipcRenderer.on('data', (event, data) => {
  console.log('Received data in renderer process:', data);
});
contextBridge.exposeInMainWorld('electron', electronHandler);

const stHandler = {
  async connect(username: string, password: string) {
    return ipcRenderer.invoke('connect', username, password);
  },
  disconnect() {
    ipcRenderer.invoke('disconnect');
  },
  autoUpdate(autoUpdate: boolean) {
    ipcRenderer.invoke('autoUpdate', autoUpdate);
  },
  autoUpdateInterval(autoUpdateInterval: number) {
    ipcRenderer.invoke('autoUpdateInterval', autoUpdateInterval);
  },
  getProjects: async () => {
    return ipcRenderer.invoke('getProjects');
  },
  getTimeEntries: async () => {
    return ipcRenderer.invoke('getTimeEntries');
  },
  addProject: async (name: string, description: string) => {
    return ipcRenderer.invoke('addProject', name, description);
  },
  addTimeEntry: (startTime: Date, endTime: Date, description: string, projectId: number) => {
    return ipcRenderer.invoke('add-time-entry', startTime, endTime, description, projectId)
  }, 
  manualUpdate: async () => {
    return ipcRenderer.invoke('manual-update-request');
  },
  getProjectTimeEntries: async (projectId: number) => {
    return ipcRenderer.invoke('getProjectTimeEntries', projectId);
  },
};

contextBridge.exposeInMainWorld('smarttracker', stHandler);

export type SmartTrackerHandler = typeof stHandler;
export type ElectronHandler = typeof electronHandler;
