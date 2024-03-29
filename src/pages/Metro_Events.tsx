import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { IconButton, Container} from '@mui/material';
import EventMaker from '../components/EventMaker';

const MetroEvents: React.FC = () => {
  const { user } = useUser();
  const types = ["User", "Organizer", "Admin"];

  if (!user) {
    return <h1>Please log in to view this page.</h1>;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {user.username} | {user.email}
          </Typography>
          <IconButton sx={{ color: '#ffffff' }}>
            <NotificationsRoundedIcon />
          </IconButton>
          {user.user_type === 2 && <Button color="inherit">Organizer Requests</Button>}
          {user.user_type === 0 && <Button color="inherit">Apply as Organizer</Button>}
          <IconButton sx={{ color: '#ffffff' }}>
            <LogoutRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {(user.user_type === 1 || user.user_type === 2) && (
        <EventMaker user={user}/>
      )}
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom>
          Welcome to Metro Events, {user.username}!
        </Typography>
        <Typography variant="h6" gutterBottom>
          User ID: {user.user_id}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Email: {user.email}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Role: {types[user.user_type]}
        </Typography>
      </Container>
    </div>
  );
};

export default MetroEvents;
