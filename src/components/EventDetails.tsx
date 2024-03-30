import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  Grid,
  Rating,
  TextField,
  Button,
} from '@mui/material';
import supabase from '../supabaseClient'; // Adjust path as necessary
import { AppBarCustom } from './AppBar';
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

const EventDetails = () => {
  const { user } = useUser();
  const { eventId } = useParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [organizer, setOrganizer] = useState("");
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [userStatus, setUserStatus] = useState<number | null>(null);
  const [reviewUsernames, setReviewUsernames] = useState<{ [userId: string]: string }>({});
  const [userReview, setUserReview] = useState<any | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false); // New state variable

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

    const fetchUserStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('event_participant')
          .select('status')
          .eq('event_id', eventId)
          .eq('user_id', user.user_id)
          .single();
        
        if (error) {
          console.error('Error fetching user status:', error);
        } else {
          setUserStatus(data?.status || null);
        }
      }
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

        // Fetch usernames for reviews
        const userIds = data.map((review: any) => review.user_id);
        const { data: usernamesData, error: usernamesError } = await supabase
          .from('user')
          .select('user_id, username')
          .in('user_id', userIds);

        if (usernamesError) {
          console.error('Error fetching usernames:', usernamesError);
        } else {
          const usernameMap: { [userId: string]: string } = {};
          usernamesData.forEach((userData: any) => {
            usernameMap[userData.user_id] = userData.username;
          });
          setReviewUsernames(usernameMap);
        }
      }
    };

    fetchEventDetails();
    fetchUserStatus();
    fetchReviews();
  }, [eventId, user]);

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (event) {
        const { data, error } = await supabase
          .from('user')
          .select('username')
          .eq('user_id', event.organizer_id);
        
        if (error) {
          console.error('Error fetching organizer:', error);
        } else {
          setOrganizer(data[0]?.username || "");
        }
      }
    };

    fetchOrganizer();
  }, [event]);

  useEffect(() => {
    const fetchUserReview = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('review')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', user.user_id)
          .single();

        if (error) {
          console.error('Error fetching user review:', error);
        } else {
          setUserReview(data || null);
        }
      }
    };

    fetchUserReview();
  }, [eventId, user]);

  const handleReviewSubmit = async () => {
    try {
      if (!reviewRating || !reviewComment) {
        alert("Please provide a rating and comment for the review.");
        return;
      }

      const { error } = await supabase.from('review').insert([
        {
          event_id: eventId,
          user_id: user?.user_id,
          rating: reviewRating,
          comment: reviewComment,
        }
      ]);

      if (error) {
        console.error('Error inserting review:', error);
        alert("Failed to submit review. Please try again later.");
      } else {
        alert("Review submitted successfully!");
        setReviewSubmitted(true); // Update state to indicate review submitted
        setReviewRating(null);
        setReviewComment("");
        // Refresh reviews after submission
        const { data } = await supabase
          .from('review')
          .select('*')
          .eq('event_id', eventId);
        setReviews(data || []);

        // Refresh usernames after submission
        const userIds = data ? data.map((review: any) => review.user_id) : [];
        const { data: usernamesData, error: usernamesError } = await supabase
          .from('user')
          .select('user_id, username')
          .in('user_id', userIds);

        if (usernamesError) {
          console.error('Error fetching usernames:', usernamesError);
        } else {
          const usernameMap: { [userId: string]: string } = {};
          usernamesData.forEach((userData: any) => {
            usernameMap[userData.user_id] = userData.username;
          });
          setReviewUsernames(usernameMap);
        }
      }
    } catch (error) {
      alert("Failed to submit review. Please try again later.");
    }
  };

  if (loading) return <CircularProgress />;

  if (!event) return <Typography variant="h5">Event not found</Typography>;

  return (
    <div>
      <Box mt={4}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>{event.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>Organizer: {organizer}</Typography>
          <Typography variant="body1" gutterBottom>{event.description}</Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2"><strong>Location:</strong> {event.location}</Typography>
              <Typography variant="body2"><strong>Date and Time:</strong> {new Date(event.date_time).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <Box mt={4}>
          <Typography variant="h5">Reviews</Typography>
          {reviews.length ? (
            reviews.map((review: any) => (
              <Paper key={review.review_id} elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="subtitle1">{reviewUsernames[review.user_id]}</Typography>
                <Rating value={review.rating} readOnly />
                <Typography variant="body1">{review.comment}</Typography>
                <Typography variant="caption">{new Date(review.created_at).toLocaleString()}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1">No reviews found</Typography>
          )}
        </Box>
        {user && event && userStatus === 1 && !userReview && !reviewSubmitted && ( // Check if review has not been submitted
          <Box mt={4}>
            <Typography variant="h5">Add Review</Typography>
            <Rating
              name="rating"
              value={reviewRating}
              onChange={(event, newValue) => setReviewRating(newValue)}
            />
            <TextField
              label="Comment"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleReviewSubmit}
              sx={{ mt: 2 }}
            >
              Submit Review
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default EventDetails;
