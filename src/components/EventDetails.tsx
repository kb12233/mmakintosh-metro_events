import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box, Paper, Grid, Rating, Divider } from '@mui/material';
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

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
      } else {
        setEvent(data as Event);
      }
      setLoading(false);
    };

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('review')
        .select('*')
        .eq('event_id', eventId);

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    };

    fetchEventDetails();
    fetchReviews();
  }, [eventId]);

  if (loading) return <CircularProgress />;

  if (!event) return <Typography variant="h5">Event not found</Typography>;

  return (
    <Box mt={4}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>{event.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>Organizer ID: {event.organizer_id}</Typography>
        <Typography variant="body1" gutterBottom>{event.description}</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Location:</strong> {event.location}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Date and Time:</strong> {new Date(event.date_time).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box mt={4}>
        <Typography variant="h5">Reviews</Typography>
        {reviews.length ? (
          reviews.map((review: any) => (
            <Paper key={review.review_id} elevation={3} sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="subtitle1">{review.user_id}</Typography>
              <Rating value={review.rating} readOnly />
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="caption">{new Date(review.created_at).toLocaleString()}</Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body1">No reviews found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default EventDetails;
