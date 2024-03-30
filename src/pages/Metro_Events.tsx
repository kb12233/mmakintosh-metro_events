import React from 'react';
import { useUser } from '../contexts/UserContext';
import Typography from '@mui/material/Typography';
import { Container} from '@mui/material';
import EventMaker from '../components/EventMaker';
import { AppBarCustom } from '../components/AppBar';
import EventList from '../components/EventList';

const MetroEvents: React.FC = () => {
  const { user } = useUser();
  const types = ["User", "Organizer", "Admin"];

  if (!user) {
    return <h1>Please log in to view this page.</h1>;
  }

  return (
    <div>
      <AppBarCustom user={user} />
      {(user.user_type === 1 || user.user_type === 2) && (
        <EventMaker user={user}/>
      )}
      <EventList />
    </div>
  );
};

export default MetroEvents;
