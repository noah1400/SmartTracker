import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const container = document.getElementById('root') as HTMLElement;

// Verwende ReactDOM.render anstelle von createRoot
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  container
);


// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  console.log(arg);
});

// this fires the ipcRenderer event to get the pong in the window
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);