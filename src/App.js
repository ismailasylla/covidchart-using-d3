import React from 'react';
import './App.css';
import CovidChart from './Components/CovidChart';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Covid 19 - Chart</h1>
        <CovidChart />
      </header>
    </div>
  );
}

export default App;
