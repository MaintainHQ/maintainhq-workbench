const express = require('express');
const path = require('path');
const app = express();

// Serve the React app static files
app.use('/dist', express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`MaintainHQ Workbench dashboard running at http://localhost:${PORT}`);
}); 