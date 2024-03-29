import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, CircularProgress, Box, Paper, Grid, Rating, Button } from '@mui/material';
import supabase from '../supabaseClient';
import { useUser } from '../contexts/UserContext';

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

interface EventParticipant {
  user_id: string;
  status: number; // Status of join request (0: pending, 1: accepted, 2: rejected)
}

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [joinRequestStatus, setJoinRequestStatus] = useState<number | null>(null);
  const [joinRequestSent, setJoinRequestSent] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data, error } = await supabase
          .from<Event>('event')
          .select('*')
          .eq('event_id', eventId)
          .single();

        if (error) {
          console.error('Error fetching event details:', error);
          return;
        }
        
        setEvent(data);
      } catch (error: any) {
        console.error('Error fetching event details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchJoinRequestStatus = async () => {
      try {
        const { data, error } = await supabase
          .from<EventParticipant>('event_participant')
          .select('status')
          .eq('event_id', eventId)
          .eq('user_id', user?.user_id || '');

        if (error) {
          console.error('Error fetching join request status:', error);
          return;
        }

        if (data && data.length > 0) {
          setJoinRequestStatus(data[0].status);
        }
      } catch (error: any) {
        console.error('Error fetching join request status:', error.message);
      }
    };

    fetchEventDetails();
    if (user) {
      fetchJoinRequestStatus();
    }
  }, [eventId, user]);

  const handleJoinRequest = async () => {
    try {
      // Send the join request to the database
      const { error } = await supabase
        .from<EventParticipant>('event_participant')
        .insert([{ event_id: eventId, user_id: user?.user_id, status: 0 }]); // Assuming 0 is the status for pending

      if (error) {
        throw new Error(`Error sending join request: ${error.message}`);
      }

      setJoinRequestStatus(0); // Update local state to show that the request is pending
      setJoinRequestSent(true); // Update local state to indicate that the request has been sent
    } catch (error: any) {
      console.error('Error sending join request:', error.message);
    }
  };

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
        {(user?.user_type === 1 || user?.user_type === 2) ? ( // Organizer or admin
          <Link to={`/event-requests/${eventId}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              View Join Requests
            </Button>
          </Link>
        ) : joinRequestStatus === 1 ? ( // Request accepted
          <Typography variant="body2" gutterBottom>Your join request has been accepted</Typography>
        ) : joinRequestStatus === 2 ? ( // Request rejected
          <div>
            <Typography variant="body2" gutterBottom>Your join request has been rejected</Typography>
            <Button variant="contained" color="primary" disabled>
              Join Event
            </Button>
          </div>
        ) : ( // Regular user
          <div>
            <Button variant="contained" color="primary" onClick={handleJoinRequest} disabled={joinRequestSent}>
              {joinRequestSent ? 'Request Sent' : 'Join Event'}
            </Button>
            {joinRequestSent && <Typography variant="body2" gutterBottom>Your join request has been sent</Typography>}
          </div>
        )}
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
