const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess = null;
let currentPort = 5050;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'assets', 'maintainhq-icon.png'), // Set app icon
  });
  win.loadFile(path.join(__dirname, 'client', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for folder picking and process management will be added here.
ipcMain.handle('pick-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled || !result.filePaths.length) return null;
  return result.filePaths[0];
});

ipcMain.handle('dashboard-status', () => {
  return { running: !!serverProcess, port: currentPort };
});

ipcMain.handle('dashboard-start', () => {
  if (serverProcess) return { error: 'Server already running' };
  serverProcess = spawn('node', [path.join(__dirname, 'server', 'server.js')], {
    env: { ...process.env, PORT: currentPort },
    stdio: 'ignore',
    detached: true,
  });
  serverProcess.unref();
  return { success: true, port: currentPort };
});

ipcMain.handle('dashboard-stop', () => {
  if (!serverProcess) return { error: 'Server not running' };
  process.kill(serverProcess.pid);
  serverProcess = null;
  return { success: true };
});

ipcMain.handle('dashboard-restart', () => {
  if (serverProcess) {
    process.kill(serverProcess.pid);
    serverProcess = null;
  }
  serverProcess = spawn('node', [path.join(__dirname, 'server', 'server.js')], {
    env: { ...process.env, PORT: currentPort },
    stdio: 'ignore',
    detached: true,
  });
  serverProcess.unref();
  return { success: true, port: currentPort };
}); 