import { Popover } from "@mui/material";
import UserNotifications from './UserNotifications';
import OrganizerNotifications from './OrganizerNotification'; // Import OrganizerNotifications component

const NotificationPopover = (props: any) => {
  const { open, onClose, anchorEl } = props;

  // Determine which notifications component to render based on the user's type
  const renderNotifications = () => {
    switch (props.user.user_type) {
      case 0: // User
        return <UserNotifications />;
      case 1: // Organizer
        return <OrganizerNotifications />;
      default:
        return null;
    }
  };

  return (
    <Popover
      open={open} 
      anchorEl={anchorEl}
      onClose={onClose} 
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {renderNotifications()} {/* Render the appropriate notifications component */}
    </Popover>
  );
};

export default NotificationPopover;
