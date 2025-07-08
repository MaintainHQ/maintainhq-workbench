import React from 'react';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <header style={{ borderBottom: '1px solid #eee', marginBottom: 32, paddingBottom: 16 }}>
        <h1 style={{ margin: 0 }}>MaintainHQ Workbench</h1>
        <p style={{ color: '#666', marginTop: 8 }}>Project & Database Control Panel</p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2>Task Manager</h2>
        <div style={{ color: '#aaa' }}>
          {/* TODO: Integrate existing task/script management UI here */}
          <em>Task management UI coming soon.</em>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>Database Management</h2>
        <div style={{ color: '#aaa' }}>
          {/* TODO: Add DB check/install and Open Bytebase features here */}
          <em>Database management features coming soon.</em>
        </div>
      </section>

      <section>
        <h2>Port Customisation</h2>
        <div style={{ color: '#aaa' }}>
          {/* TODO: Add port customisation UI here */}
          <em>Port customisation coming soon.</em>
        </div>
      </section>
    </div>
  );
}

export default App; 