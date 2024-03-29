// EventList.tsx
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, CircularProgress, Card, Stack, Typography } from '@mui/material';
import supabase from '../supabaseClient'; // Adjust path as necessary
import { Link } from 'react-router-dom';

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
  const [organizer, setOrganizer] = useState("");

  //get name of organizer
  useEffect(() => {
    const fetchOrganizer = async () => {
      const { data, error } = await supabase
        .from('user')
        .select('username')
        .eq('user_id', event.organizer_id);
      
      if (error) {
        console.error('Error fetching organizer:', error);
      } else {
        setOrganizer(data[0]?.username || "");
      }
    };

    fetchOrganizer();
  }, []);

  return (
    <Link to={`/event/${event.event_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card sx={{ margin: 2, padding: 2 }}>
        <Typography variant="h6">{event.title}</Typography>
        <Typography variant="subtitle1">Organizer: {organizer}</Typography>
        <Typography>{event.description}</Typography>
        <Typography>Location: {event.location}</Typography>
        <Typography>Date and Time: {new Date(event.date_time).toLocaleString()}</Typography>
      </Card>
    </Link>
  );
};

const EventList = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('is_cancelled', false);
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data as Event[]);
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
