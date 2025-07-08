import React, { useEffect, useState } from 'react';
import { Tour } from '@reactour/tour';

const LOGO_URL = 'https://maintainhq-pull-zone.b-cdn.net/maintain-hq-logo-white.svg';
const SIDEBAR_BG = '#4D5061';
const HEADER_COLOR = '#E9E980';
const TEXT_COLOR = '#D1D5DA';
const CARD_BG = '#575A6B';

const navLinks = [
  { label: 'Dashboard', icon: (
    <svg width="22" height="22" fill="none" stroke="#E9E980" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
  ) },
  { label: 'Projects', icon: (
    <svg width="22" height="22" fill="none" stroke="#E9E980" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><polyline points="3 6 12 13 21 6"/></svg>
  ) },
  { label: 'Settings', icon: (
    <svg width="22" height="22" fill="none" stroke="#E9E980" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 12 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.09.33.14.66.14 1s-.05.67-.14 1z"/></svg>
  ) },
  { label: 'Help', icon: (
    <svg width="22" height="22" fill="none" stroke="#E9E980" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
  ) },
];

function Sidebar({ active, setActive }) {
  return (
    <aside style={{
      width: 220,
      background: SIDEBAR_BG,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 0 0 0',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      <img src={LOGO_URL} alt="MaintainHQ Logo" style={{ width: 120, marginBottom: 32 }} />
      <nav style={{ width: '100%' }}>
        {navLinks.map((link, i) => (
          <div
            key={link.label}
            onClick={() => setActive(link.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 32px',
              cursor: 'pointer',
              background: active === link.label ? '#393B4A' : 'none',
              borderLeft: active === link.label ? `4px solid ${HEADER_COLOR}` : '4px solid transparent',
              color: HEADER_COLOR,
              fontWeight: 500,
              fontSize: 17,
              transition: 'background 0.2s',
            }}
          >
            {link.icon}
            <span>{link.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

const MANAGER_API = 'http://localhost:5051/api/manager';

function ServerControls({ onStatusChange }) {
  const [status, setStatus] = useState('unknown');
  const [port, setPort] = useState('');
  const [message, setMessage] = useState('');

  const fetchStatus = async () => {
    if (!window.electronAPI?.dashboardStatus) return;
    const data = await window.electronAPI.dashboardStatus();
    setStatus(data.running ? 'running' : 'stopped');
    setPort(data.port);
    if (onStatusChange) onStatusChange(data);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action) => {
    setMessage('');
    let res;
    if (action === 'start') res = await window.electronAPI.dashboardStart();
    if (action === 'stop') res = await window.electronAPI.dashboardStop();
    if (action === 'restart') res = await window.electronAPI.dashboardRestart();
    if (res && res.success) {
      setMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} command sent.`);
      fetchStatus();
    } else if (res && res.error) {
      setMessage(res.error);
    } else {
      setMessage('Failed to send command.');
    }
  };

  return (
    <section style={{ marginBottom: 40 }}>
      <h2>Dashboard Server Controls</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span>Status:</span>
        <span style={{
          display: 'inline-block',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: status === 'running' ? '#3ec46d' : '#e74c3c',
          border: '1px solid #ccc',
        }} title={status}></span>
        <span style={{ fontWeight: 500 }}>{status}</span>
        <span style={{ marginLeft: 24 }}>Port: {port}</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => handleAction('start')} disabled={status === 'running'}>Start</button>
        <button onClick={() => handleAction('stop')} disabled={status !== 'running'}>Stop</button>
        <button onClick={() => handleAction('restart')}>Restart</button>
      </div>
      {message && <div style={{ marginTop: 10, color: '#555' }}>{message}</div>}
    </section>
  );
}

function MultiAppControls() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({ name: '', folder: '', port: '', command: '' });
  const [message, setMessage] = useState('');

  const fetchApps = () => {
    fetch(`${MANAGER_API}/apps`)
      .then(res => res.json())
      .then(setApps);
  };

  useEffect(() => {
    fetchApps();
    const interval = setInterval(fetchApps, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (name, action) => {
    setMessage('');
    const res = await fetch(`${MANAGER_API}/apps/${name}/${action}`, { method: 'POST' });
    if (res.ok) {
      setMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} command sent for ${name}.`);
      fetchApps();
    } else {
      const err = await res.json();
      setMessage(err.error || 'Failed to send command.');
    }
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.name || !form.folder || !form.port || !form.command) {
      setMessage('All fields are required.');
      return;
    }
    const res = await fetch(`${MANAGER_API}/apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, port: Number(form.port) })
    });
    if (res.ok) {
      setMessage('App added.');
      setForm({ name: '', folder: '', port: '', command: '' });
      fetchApps();
    } else {
      const err = await res.json();
      setMessage(err.error || 'Failed to add app.');
    }
  };

  const isElectron = !!(window && window.process && window.process.type);

  return (
    <section style={{ marginBottom: 40 }}>
      <h2>Project Apps</h2>
      <form className="add-app-form" onSubmit={handleAddApp} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input
          className="add-app-folder"
          placeholder="Folder (absolute path)"
          value={form.folder}
          onChange={e => setForm(f => ({ ...f, folder: e.target.value }))}
          style={{ minWidth: 200 }}
        />
        {isElectron && (
          <button
            type="button"
            className="add-app-browse"
            onClick={async () => {
              const folder = await window.electronAPI?.pickFolder?.();
              if (folder) setForm(f => ({ ...f, folder }));
            }}
            style={{ padding: '0 10px' }}
          >
            Browse
          </button>
        )}
        <input
          className="add-app-port"
          placeholder="Port"
          type="number"
          value={form.port}
          onChange={e => setForm(f => ({ ...f, port: e.target.value }))}
          style={{ width: 80 }}
        />
        <input
          className="add-app-command"
          placeholder="Start command"
          value={form.command}
          onChange={e => setForm(f => ({ ...f, command: e.target.value }))}
          style={{ minWidth: 200 }}
        />
        <button type="submit">Add App</button>
      </form>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
        Note: For security reasons, browsers may not provide the full absolute path. If the folder path is not correct, please copy and paste it manually from your file explorer.
      </div>
      <div style={{ marginBottom: 12, color: '#555' }}>{message}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Folder</th>
            <th align="left">Port</th>
            <th align="left">Status</th>
            <th align="left">Controls</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.name} style={{ borderBottom: '1px solid #eee' }}>
              <td>{app.name}</td>
              <td style={{ fontSize: 12, color: '#888' }}>{app.folder}</td>
              <td>{app.port}</td>
              <td>
                <span style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: app.running ? '#3ec46d' : '#e74c3c',
                  border: '1px solid #ccc',
                  marginRight: 6,
                }} title={app.running ? 'Running' : 'Stopped'}></span>
                {app.running ? 'Running' : 'Stopped'}
              </td>
              <td className="app-controls">
                <button onClick={() => handleAction(app.name, 'start')} disabled={app.running}>Start</button>
                <button onClick={() => handleAction(app.name, 'stop')} disabled={!app.running}>Stop</button>
                <button onClick={() => handleAction(app.name, 'restart')}>Restart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PortCustomisation() {
  const [port, setPort] = useState('');
  const [inputPort, setInputPort] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/port')
      .then(res => res.json())
      .then(data => {
        setPort(data.port);
        setInputPort(data.port);
      });
  }, []);

  const handleChangePort = async (e) => {
    e.preventDefault();
    setMessage('');
    const newPort = Number(inputPort);
    if (!newPort || newPort < 1 || newPort > 65535) {
      setMessage('Please enter a valid port (1-65535).');
      return;
    }
    const res = await fetch('/api/port', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ port: newPort })
    });
    if (res.ok) {
      setPort(newPort);
      setMessage('Port updated. Please click Restart in the controls above to apply changes.');
    } else {
      setMessage('Failed to update port.');
    }
  };

  return (
    <section>
      <h2>Port Customisation</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontWeight: 500 }}>Current Port:</span>
        <span>{port}</span>
      </div>
      <form onSubmit={handleChangePort} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          min={1}
          max={65535}
          value={inputPort}
          onChange={e => setInputPort(e.target.value)}
          style={{ width: 100, padding: 4 }}
        />
        <button type="submit" style={{ padding: '4px 12px' }}>Change Port</button>
      </form>
      {message && <div style={{ marginTop: 10, color: '#555' }}>{message}</div>}
    </section>
  );
}

function App() {
  const [showTour, setShowTour] = useState(() => {
    return localStorage.getItem('onboardingComplete') !== 'true';
  });

  const steps = [
    {
      selector: 'body',
      content: () => <div><h2>Welcome to MaintainHQ Workbench!</h2><p>This guide will help you get started managing your Node/React projects.</p></div>,
    },
    {
      selector: '.add-app-form',
      content: 'Start by adding your first project. Give it a name, pick the folder, set the port, and enter the start command.',
    },
    {
      selector: '.add-app-browse',
      content: 'Click Browse to select your project folder.',
    },
    {
      selector: '.add-app-port',
      content: 'Set the port your app will run on (e.g., 3000).',
    },
    {
      selector: '.add-app-command',
      content: 'Enter the start command (e.g., npm start or yarn dev).',
    },
    {
      selector: '.app-controls',
      content: 'Use these controls to start, stop, or restart your app.',
    },
    {
      selector: 'body',
      content: () => <div><h2>All set!</h2><p>You can add more projects, manage them, and re-launch this guide from the menu at any time.</p></div>,
    },
  ];

  const [activeNav, setActiveNav] = useState('Dashboard');

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <Tour
        steps={steps}
        open={showTour}
        onClose={() => {
          setShowTour(false);
          localStorage.setItem('onboardingComplete', 'true');
        }}
      />
      <header style={{ borderBottom: '1px solid #eee', marginBottom: 32, paddingBottom: 16 }}>
        <h1 style={{ margin: 0 }}>MaintainHQ Workbench</h1>
        <p style={{ color: '#666', marginTop: 8 }}>Project & Database Control Panel</p>
      </header>

      <Sidebar active={activeNav} setActive={setActiveNav} />

      <main style={{ marginLeft: 220, padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 100px)' }}>
        {activeNav === 'Dashboard' && (
          <>
            <h2>Dashboard</h2>
            <p>Welcome to the MaintainHQ Workbench. This application provides a centralized interface for managing your Node/React projects and their associated databases.</p>
            <p>You can add new projects, start/stop servers, and customize port settings from the respective sections.</p>
          </>
        )}
        {activeNav === 'Projects' && (
          <>
            <h2>Project Apps</h2>
            <ServerControls />
            <MultiAppControls />
          </>
        )}
        {activeNav === 'Settings' && (
          <>
            <h2>Port Customisation</h2>
            <PortCustomisation />
          </>
        )}
        {activeNav === 'Help' && (
          <>
            <h2>Help</h2>
            <p>If you encounter any issues or need assistance, please refer to the documentation or contact our support team.</p>
            <p>For more information, visit our website: <a href="https://maintainhq.com" target="_blank" rel="noopener noreferrer">MaintainHQ</a></p>
          </>
        )}
      </main>
    </div>
  );
}

export default App; 