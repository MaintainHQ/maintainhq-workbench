const { spawn } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');

const CONTROL_PORT = 5051; // Control API port
const SERVER_PATH = path.join(__dirname, 'server', 'server.js');
const CONFIG_PATH = path.join(__dirname, 'server', 'config.json');
const APPS_PATH = path.join(__dirname, 'apps.json');

let serverProcess = null;
let currentPort = null;

function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    return { port: 5050 };
  }
}

// --- Multi-app management ---
function getApps() {
  try {
    return JSON.parse(fs.readFileSync(APPS_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveApps(apps) {
  fs.writeFileSync(APPS_PATH, JSON.stringify(apps, null, 2));
}

// Track running app processes by app name
const appProcesses = {};

function startApp(app) {
  if (appProcesses[app.name]) return false;
  const proc = spawn(app.command, {
    cwd: app.folder,
    shell: true,
    env: { ...process.env, PORT: app.port },
    stdio: 'inherit',
  });
  appProcesses[app.name] = proc;
  proc.on('exit', () => {
    delete appProcesses[app.name];
  });
  return true;
}

function stopApp(app) {
  if (!appProcesses[app.name]) return false;
  appProcesses[app.name].kill();
  delete appProcesses[app.name];
  return true;
}

function restartApp(app) {
  stopApp(app);
  return startApp(app);
}

function getAppStatus(app) {
  return !!appProcesses[app.name];
}

// --- End multi-app management ---

function startServer() {
  if (serverProcess) return false;
  const config = getConfig();
  currentPort = config.port || 5050;
  serverProcess = spawn('node', [SERVER_PATH], {
    env: { ...process.env, PORT: currentPort },
    stdio: 'inherit',
  });
  serverProcess.on('exit', () => {
    serverProcess = null;
  });
  return true;
}

function stopServer() {
  if (!serverProcess) return false;
  serverProcess.kill();
  serverProcess = null;
  return true;
}

function restartServer() {
  stopServer();
  return startServer();
}

const app = express();
app.use(express.json());

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// --- Multi-app API ---
app.get('/api/manager/apps', (req, res) => {
  const apps = getApps();
  res.json(apps.map(app => ({
    ...app,
    running: getAppStatus(app),
  })));
});

app.post('/api/manager/apps', (req, res) => {
  const { name, folder, port, command } = req.body;
  if (!name || !folder || !port || !command) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const apps = getApps();
  if (apps.find(a => a.name === name)) {
    return res.status(400).json({ error: 'App with this name already exists' });
  }
  const newApp = { name, folder, port, command };
  apps.push(newApp);
  saveApps(apps);
  res.json({ success: true, app: newApp });
});

app.post('/api/manager/apps/:name/start', (req, res) => {
  const apps = getApps();
  const appObj = apps.find(a => a.name === req.params.name);
  if (!appObj) return res.status(404).json({ error: 'App not found' });
  if (startApp(appObj)) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'App already running' });
  }
});

app.post('/api/manager/apps/:name/stop', (req, res) => {
  const apps = getApps();
  const appObj = apps.find(a => a.name === req.params.name);
  if (!appObj) return res.status(404).json({ error: 'App not found' });
  if (stopApp(appObj)) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'App not running' });
  }
});

app.post('/api/manager/apps/:name/restart', (req, res) => {
  const apps = getApps();
  const appObj = apps.find(a => a.name === req.params.name);
  if (!appObj) return res.status(404).json({ error: 'App not found' });
  restartApp(appObj);
  res.json({ success: true });
});
// --- End multi-app API ---

app.get('/api/manager/status', (req, res) => {
  res.json({ running: !!serverProcess, port: currentPort });
});

app.post('/api/manager/start', (req, res) => {
  if (startServer()) {
    res.json({ success: true, port: currentPort });
  } else {
    res.status(400).json({ error: 'Server already running' });
  }
});

app.post('/api/manager/stop', (req, res) => {
  if (stopServer()) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Server not running' });
  }
});

app.post('/api/manager/restart', (req, res) => {
  restartServer();
  res.json({ success: true, port: currentPort });
});

app.listen(CONTROL_PORT, () => {
  console.log(`Dashboard manager running at http://localhost:${CONTROL_PORT}`);
  // Start server on launch
  startServer();
}); 