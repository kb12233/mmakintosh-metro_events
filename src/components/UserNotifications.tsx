import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, IconButton } from '@mui/material';
import supabase from '../supabaseClient';
import { useUser } from '../contexts/UserContext'; // Import the useUser hook
import CheckIcon from '@mui/icons-material/Check';

// Define a type/interface for the structure of each notification
interface Notification {
  id: string; // Unique identifier for the notification
  message: string; // Notification message
  is_read: boolean; // Flag to indicate if the notification has been read
}

const UserNotifications = () => {
  const { user } = useUser(); // Access the user object from the UserContext
  const [notifications, setNotifications] = useState<Notification[]>([]); // Explicitly specify the type

  useEffect(() => {
    if (!user) return; // Exit early if user is not available

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notification')
          .select('notification_id, message, is_read') // Explicitly select the id field
          .eq('user_id', user.user_id)
          .eq('is_read', false);
        // Only fetch unread notifications

        if (error) {
          throw error;
        }

        // Transform the fetched data to match the Notification interface
        const transformedData: Notification[] = data.map(item => ({
          id: item.notification_id, // Map notification_id to id
          message: item.message,
          is_read: item.is_read
        }));

        setNotifications(transformedData); // Update state with the fetched notifications
      } catch (error: any) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
        
      console.log('Marking notification as read. Notification ID:', notificationId);
  
      // Update the notification in the database to mark it as read
      const { error } = await supabase
        .from('notification')
        .update({ is_read: true })
        .eq('notification_id', notificationId);
  
      if (error) {
        throw error;
      }
  
      console.log('Notification marked as read. Notification ID:', notificationId);
  
      // Update local state to reflect the change in is_read property for the checked notification
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error.message);
    }
  };
  
  

  return (
    <div>
      <List>
        {notifications.map((notification, index) => {
          return (
            <ListItem key={`${notification.id}_${index}`}>
              <ListItemText
                primary={<span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{notification.message}</span>}
                secondary={`Status: ${notification.is_read ? 'Read' : 'Unread'}`}
              />
              <IconButton color="success" onClick={() => {
                  console.log('Notification ID:', notification.id);
                  handleMarkAsRead(notification.id);
                }}>
                <CheckIcon/>
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
  
};

export default UserNotifications;
