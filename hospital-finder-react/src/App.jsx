import React from 'react';
import HospitalFinder from './components/HospitalFinder';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Nearest Hospital Finder</h1>
      </header>
      <main>
        <HospitalFinder />
      </main>
    </div>
  );
}

export default App;