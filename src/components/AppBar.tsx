import { useNavigate } from 'react-router-dom'; 
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ApplyForOrganizerButton from './ApplyForOrganizerButton';
import OrganizerRequestsButton from './OrganizerRequestsButton';

export const AppBarCustom = (props: any) => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    navigate('/login'); 
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {props.user.username} | {props.user.email}
        </Typography>
        <IconButton sx={{ color: '#ffffff' }}>
          <NotificationsRoundedIcon />
        </IconButton>
        {props.user.user_type === 2 && <OrganizerRequestsButton user={props.user} />}
        {props.user.user_type === 0 && <ApplyForOrganizerButton user={props.user} />}
        <IconButton sx={{ color: '#ffffff' }} onClick={handleLogout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
