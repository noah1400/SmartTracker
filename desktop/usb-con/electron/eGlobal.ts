import { BrowserWindow } from 'electron';

let win: BrowserWindow | null;

export const setMainWindow = (window: BrowserWindow) => {
  win = window;
};

export const getMainWindow = () => win;