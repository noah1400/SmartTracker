import { ElectronHandler, SmartTrackerHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    smarttracker: SmartTrackerHandler;
  }
}

export {};
