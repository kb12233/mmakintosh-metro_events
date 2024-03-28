import React from 'react';
import { useUser } from '../contexts/UserContext'; // Adjust the import path as necessary
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { IconButton } from '@mui/material';


const MetroEvents: React.FC = () => {
  const { user } = useUser();
  const types = ["User", "Organizer", "Admin"];

  if (!user) {
    return <h1>Please log in to view this page.</h1>;
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
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
      </Box>
      <h1>Welcome to Metro Events, {user.username}!</h1>
      <h1>{user.user_id}</h1>
      <h1>{user.email}</h1>
      <h1>{types[user.user_type]}</h1>
      {/* Add more content or functionality here as needed */}
    </div>
  );
};

export default MetroEvents;
