import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, CircularProgress, Card, Stack, Typography } from '@mui/material';
import supabase from '../supabaseClient'; // Adjust path as necessary


interface Event {
  event_id: string;
  organizer_id: string;
  title: string;
  description: string;
  date_time: Date;
  location: string;
  cancel_reason: string;
  is_cancelled: boolean;
  created_at: Date;
}

const EventItem = ({ event }: { event: Event }) => {
    return (
        <Card>
          <Typography>
              {event.title}
            </Typography>
            
            <Typography>
              {event.organizer_id}
            </Typography>
            
            <Typography>
              {event.description}
            </Typography>
            
            <Typography>
              {event.location}
            </Typography>
            
            <Typography>
              {event.date_time.toString()}
            </Typography>
        </Card>
    );
};

const EventList = () => {
  //const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]); // Update type annotation and initialize as empty array

  useEffect(() => {
    

    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('event')
        .select('*');
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data as Event[]); // Update type annotation for events
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

if (loading) return <CircularProgress />;

return (
    <List>
        <Stack spacing={2}>
          {events.length ? (
              events.map((event: any) => <EventItem key={event.event_id} event={event} />)
          ) : (
              <ListItem>
                  <ListItemText primary="No events found" />
              </ListItem>
          )}
        </Stack>
    </List>
);
};

export default EventList;
