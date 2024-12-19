import './index.css'; // or './globals.css'
import React from 'react';
import Barber from './components/barber.jsx';

function App() {
  return (
    <div className="container mx-auto py-8">
      <Barber />
    </div>
  );
}

export default App;