import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Expose Electron folder picker and dashboard server APIs if running in Electron
if (window && window.require) {
  try {
    const { ipcRenderer } = window.require('electron');
    window.electronAPI = {
      pickFolder: () => ipcRenderer.invoke('pick-folder'),
      dashboardStatus: () => ipcRenderer.invoke('dashboard-status'),
      dashboardStart: () => ipcRenderer.invoke('dashboard-start'),
      dashboardStop: () => ipcRenderer.invoke('dashboard-stop'),
      dashboardRestart: () => ipcRenderer.invoke('dashboard-restart'),
    };
  } catch (e) {}
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); 