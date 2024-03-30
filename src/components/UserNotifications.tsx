import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import supabase from '../supabaseClient';
import { useUser } from '../contexts/UserContext'; // Import the useUser hook
import { Typography } from '@mui/material';

const UserNotifications = () => {
  const { user } = useUser(); // Access the user object from the UserContext
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return; // Exit early if user is not available

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('event_participant')
          .select('event_id, status')
          .eq('user_id', user.user_id); // Use user.user_id from the UserContext

        if (error) {
          throw error;
        }

        const eventsPromises = data.map(async (row) => {
          const { data: eventData, error: eventError } = await supabase
            .from('event')
            .select('title, date_time, location')
            .eq('event_id', row.event_id)
            .single();

          if (eventError) {
            throw eventError;
          }

          const statusText = row.status === 0 ? 'Pending' : row.status === 1 ? 'Joined' : 'Unknown';

          return { ...eventData, status: statusText };
        });

        const eventDetails = await Promise.all(eventsPromises);
        setNotifications(eventDetails);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <List>
      {notifications.map((event, index) => {
  // Format date
  const eventDate = new Date(event.date_time);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Format time
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <ListItem key={`${event.event_id}_${index}`}>
      <ListItemText
        primary={<span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{event.title}</span>}
        secondary={`${formattedDate}, ${formattedTime} | Status: ${event.status}`}
      />
    </ListItem>
  );
})}

    </List>
  );
  
};

export default UserNotifications;
