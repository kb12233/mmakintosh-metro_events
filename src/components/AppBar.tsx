import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export const AppBarCustom = (props: any) => {
  return (
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.user.username} | {props.user.email}
          </Typography>
          <IconButton sx={{ color: '#ffffff' }}>
            <NotificationsRoundedIcon />
          </IconButton>
          {props.user.user_type === 2 && <Button color="inherit">Organizer Requests</Button>}
          {props.user.user_type === 0 && <Button color="inherit">Apply as Organizer</Button>}
          <IconButton sx={{ color: '#ffffff' }}>
            <LogoutRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
  );
}