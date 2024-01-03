import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Timer from './Timer';

const container = document.getElementById('root') as HTMLElement;

// Verwende ReactDOM.render anstelle von createRoot
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  container
);

const st = window.smarttracker;
st.connect('admin', 'admin');
st.autoUpdate(true);
st.autoUpdateInterval(1000);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  console.log(arg);
});

// this fires the ipcRenderer event to get the pong in the window
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);