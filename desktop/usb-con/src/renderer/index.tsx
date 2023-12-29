import { createRoot } from 'react-dom/client';
import App from './App';
import Timer from './Timer';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
const st = window.smarttracker
st.connect('admin', 'admin');
st.autoUpdate(true);
st.autoUpdateInterval(1000);

root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});

//this fires the ipcRenderer event to get the pong in the window
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
