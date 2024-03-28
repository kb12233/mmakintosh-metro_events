import React from 'react';
import { useUser } from '../contexts/UserContext'; // Adjust the import path as necessary

const MetroEvents: React.FC = () => {
  const { user } = useUser();
  const types = ["User", "Organizer", "Admin"];

  if (!user) {
    return <h1>Please log in to view this page.</h1>;
  }

  return (
    <div>
      <h1>Welcome to Metro Events, {user.username}!</h1>
      <h1>{user.user_id}</h1>
      <h1>{user.email}</h1>
      <h1>{types[user.user_type]}</h1>
      {/* Add more content or functionality here as needed */}
    </div>
  );
};

export default MetroEvents;
