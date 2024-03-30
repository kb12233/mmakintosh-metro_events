import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { List, ListItem, ListItemText } from '@mui/material';
import supabase from '../supabaseClient';

const OrganizerNotifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user) return;

        // Fetch events created by the organizer
        const { data: events, error: eventsError } = await supabase
          .from('event')
          .select('event_id, title')
          .eq('organizer_id', user.user_id);

        if (eventsError) {
          throw eventsError;
        }

        // Fetch requests to join each event
        const notificationsPromises = events.map(async (event: any) => {
          const { data: requests, error: requestsError } = await supabase
            .from('event_participant')
            .select('user_id')
            .eq('event_id', event.event_id)
            .eq('status', 0);

          if (requestsError) {
            throw requestsError;
          }

          // Fetch user details for each request
          const usersPromises = requests.map(async (request: any) => {
            const { data: userData, error: userError } = await supabase
              .from('user')
              .select('username')
              .eq('user_id', request.user_id)
              .single();

            if (userError) {
              throw userError;
            }

            return { username: userData.username, eventId: event.event_id, eventName: event.title };
          });

          return Promise.all(usersPromises);
        });

        const notificationsData = await Promise.all(notificationsPromises);
        const flatNotifications = notificationsData.flat();
        setNotifications(flatNotifications);
      } catch (error) {
        console.error('Error fetching organizer notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <List>
      {notifications.length > 0 ? (
        notifications.map((notification: any, index: number) => (
          <ListItem key={`${notification.username}_${notification.eventId}_${index}`}>
            <ListItemText 
                primary={<span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Pending approval</span>} 
                secondary={`${notification.username} wants to join ${notification.eventName}`}
            />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No notifications to display" />
        </ListItem>
      )}
    </List>
  );
};

export default OrganizerNotifications;
