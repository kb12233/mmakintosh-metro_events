import React from 'react';
import './App.css';
import Login from './pages/Login'; // Import the Login component
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <div className="App">
      <Login /> {/* Render the Login component */}
    </div>
  );
}

export default App;
