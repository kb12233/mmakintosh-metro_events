import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login'; // Adjust paths as needed
import Register from './pages/Register';
import MetroEvents from './pages/Metro_Events';
import { UserProvider } from './contexts/UserContext'; // Adjust the import path as necessary
import OrganizerRequestsPage from './components/OrganizerRequestsPage';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <UserProvider> {/* Wrap routes with UserProvider */}
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/metro_events" element={<MetroEvents />} />
            <Route path="/organizer_requests" element={<OrganizerRequestsPage />} />

            {/* Add more routes as needed */}
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
