const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

const CONFIG_PATH = path.join(__dirname, 'config.json');

function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    return { port: 5050 };
  }
}

function setConfig(newConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
}

// Serve the React app static files
app.use('/dist', express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// API: Get current port
app.get('/api/port', (req, res) => {
  const config = getConfig();
  res.json({ port: config.port });
});

// API: Set new port
app.post('/api/port', (req, res) => {
  const { port } = req.body;
  if (!port || typeof port !== 'number' || port < 1 || port > 65535) {
    return res.status(400).json({ error: 'Invalid port' });
  }
  const config = getConfig();
  config.port = port;
  setConfig(config);
  res.json({ success: true, port });
});

// API: Server status (for traffic light)
app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

const config = getConfig();
const PORT = process.env.PORT || config.port || 5050;
app.listen(PORT, () => {
  console.log(`MaintainHQ Workbench dashboard running at http://localhost:${PORT}`);
}); 