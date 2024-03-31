import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Checkbox, Button } from '@mui/material';
import supabase from '../supabaseClient';
import { useUser } from '../contexts/UserContext'; // Import the useUser hook

// Define a type/interface for the structure of each notification
interface Notification {
  id: string; // Unique identifier for the notification
  message: string; // Notification message
  is_read: boolean; // Flag to indicate if the notification has been read
}

const UserNotifications = () => {
  const { user } = useUser(); // Access the user object from the UserContext
  const [notifications, setNotifications] = useState<Notification[]>([]); // Explicitly specify the type
  const [checkedIds, setCheckedIds] = useState<string[]>([]); // Store the IDs of checked notifications

  useEffect(() => {
    if (!user) return; // Exit early if user is not available

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notification')
          .select('*')
          .eq('user_id', user.user_id) // Fetch notifications for the current user
          .eq('is_read', false); // Only fetch unread notifications

        if (error) {
          throw error;
        }

        setNotifications(data || []); // Update state with the fetched notifications
      } catch (error: any) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Update the notification in the database to mark it as read
      await supabase
        .from('notification')
        .update({ is_read: true })
        .eq('id', notificationId);

      // Update local state to reflect the change
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Update all checked notifications in the database to mark them as read
      await Promise.all(checkedIds.map(async (notificationId) => {
        await supabase
          .from('notification')
          .update({ is_read: true })
          .eq('id', notificationId);
      }));

      // Update local state to mark checked notifications as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          checkedIds.includes(notification.id) ? { ...notification, is_read: true } : notification
        )
      );

      // Clear checkedIds
      setCheckedIds([]);
    } catch (error: any) {
      console.error('Error marking checked notifications as read:', error.message);
    }
  };

  const handleCheckboxChange = (notificationId: string) => {
    setCheckedIds((prevCheckedIds) =>
      prevCheckedIds.includes(notificationId)
        ? prevCheckedIds.filter((id) => id !== notificationId)
        : [...prevCheckedIds, notificationId]
    );
  };

  return (
    <div>
      <Button onClick={handleMarkAllAsRead}>Mark All as Read</Button>
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={`${notification.id}_${index}`}>
            <Checkbox
              checked={checkedIds.includes(notification.id)}
              onChange={() => {
                handleCheckboxChange(notification.id);
                handleMarkAsRead(notification.id); // Mark the notification as read when the checkbox is clicked
              }}
            />
            <ListItemText
              primary={<span style={{ fontWeight: 'bold' }}>{notification.message}</span>}
              secondary={`Status: ${notification.is_read ? 'Read' : 'Unread'}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default UserNotifications;
