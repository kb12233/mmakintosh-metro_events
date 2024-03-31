import { useNavigate } from 'react-router-dom'; 
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ApplyForOrganizerButton from './ApplyForOrganizerButton';
import OrganizerRequestsButton from './OrganizerRequestsButton';
import AllJoinRequestsButton from './AllJoinRequestsButton';
import NotificationPopover from './NotificationPopover'; // Import the component that contains the popover content
import UserNotifications from './UserNotifications';
import OrganizerNotifications from './OrganizerNotification';
import { useState } from 'react';



export const AppBarCustom = (props: any) => {
  const navigate = useNavigate(); 

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate('/login'); 
  };

  const renderNotifications = () => {
    switch (props.user.user_type) {
      case 0: // User
        return <UserNotifications />;
      case 1: // Organizer
        return <OrganizerNotifications />;
      //case 2: // Administrator
      //  return <AdminNotifications />;
      default:
        return null;
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {props.user.username} | {props.user.email}
        </Typography>
        <IconButton sx={{ color: '#ffffff' }} onClick={handleClick}>
          <NotificationsRoundedIcon />
        </IconButton>
        {props.user.user_type === 2 && <OrganizerRequestsButton user={props.user} />}
        {props.user.user_type === 0 && <ApplyForOrganizerButton user={props.user} />}
        {(props.user.user_type === 2 || props.user.user_type === 1) && <AllJoinRequestsButton />}
        <IconButton sx={{ color: '#ffffff' }} onClick={handleLogout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Toolbar>
      {/*<NotificationPopover open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl} />*/}
      <NotificationPopover open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl} user={props.user}>
        {renderNotifications()}
      </NotificationPopover>
    </AppBar>
  );
}
