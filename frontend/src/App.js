import React from 'react';
import Upload from './Upload';
import Dashboard from './Dashboard';
import './styles.css';

function App() {
  return (
    <div className="container">
      <h1>CyberXplore File Scanner</h1>
      <Upload />
      <hr />
      <Dashboard />
    </div>
  );
}

export default App;
