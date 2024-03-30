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
  Card,
  CardContent,
  Stack,
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
  const [organizerUsername, setOrganizerUsername] = useState("");
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [userStatus, setUserStatus] = useState<number | null>(null);
  const [reviewUsernames, setReviewUsernames] = useState<{ [userId: string]: string }>({});
  const [userReview, setUserReview] = useState<any | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false); // New state variable
  
  const [is_editing, setIsEditing] = useState(false);
  const [organizerId, setOrganizerID] = useState("");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    // Fetch event details
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

    // Fetch user status for the event
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

    // Fetch reviews for the event
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
    // Fetch organizer details
    const fetchOrganizerUsername = async () => {
      if (event) {
        setOrganizerID(event.organizer_id);
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setDateTime(event.date_time.toString());
        const { data, error } = await supabase
          .from('user')
          .select('username')
          .eq('user_id', event.organizer_id);
        
        if (error) {
          console.error('Error fetching organizer:', error);
        } else {
          setOrganizerUsername(data[0]?.username || "");
        }
      }
    };

    fetchOrganizerUsername();
  }, [event]);

  useEffect(() => {
    // Fetch user's review for the event
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

  const handleChangeToEditMode = () => {
    setIsEditing(true);
  }

  const handleEditEvent = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('event')
      .update({
        title: title, 
        description: description, 
        location: location, 
        date_time: new Date(dateTime)
      })
      .eq("event_id", eventId ) // replace 'your_event_id' with the actual event_id


    if (error) {
      alert('Error updating event: ' + error.message);
    } else {
      alert('Event updated successfully!');
      // Reset form or further actions
      setIsEditing(false);
    }
  }

  if (loading) return <CircularProgress />;

  if (!event) return <Typography variant="h5">Event not found</Typography>;

  return (
    <div>
      <Box mt={4}>
        <Card variant='outlined'>
          {
            // Render edit form if user is editing and is the organizer or an admin
            is_editing && (user?.user_id == organizerId || user?.user_type == 2) ?
              <CardContent>
                <form onSubmit={handleEditEvent}>
                  <TextField
                    sx={{ marginBottom: 1 }}
                    label="Title"
                    fullWidth
                    defaultValue={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TextField
                    sx={{ marginBottom: 1 }}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    defaultValue={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <TextField
                    sx={{ marginBottom: 1 }}
                    label="Location"
                    fullWidth
                    defaultValue={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <TextField
                    sx={{ marginBottom: 1 }}
                    label="Date and Time"
                    type="datetime-local"
                    fullWidth
                    defaultValue={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="text"
                      onClick={() => {setIsEditing(false)}}
                    >
                      Abort
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained"
                    >
                      Edit Event
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            :
              <CardContent>
                <Typography variant="h4" gutterBottom>{title}</Typography>
                <Typography variant="subtitle1" gutterBottom>Organizer: {organizerUsername}</Typography>
                <Typography variant="body1" gutterBottom>{description}</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Location:</strong> {location}</Typography>
                    <Typography variant="body2"><strong>Date and Time:</strong> {new Date(dateTime).toLocaleString()}</Typography>
                  </Grid>
                </Grid>
                {
                  // Render edit button if user is the organizer or an admin
                  (user?.user_type == 2 || user?.user_id === organizerId) ?
                    <Button 
                      type="submit" 
                      variant="contained"
                      onClick={handleChangeToEditMode}
                    >
                      Edit
                    </Button>
                    
                    // Add the other buttons later (e.g. cancel event and view join requests)
                  :
                    null // We will put join event button here
                }
              </CardContent>
          }
        </Card>
        <Box mt={4}>
          <Typography variant="h5">Reviews</Typography>
          {reviews.length ? (
            reviews.map((review: any) => (
              <Card key={review.review_id} sx={{ marginTop: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{reviewUsernames[review.user_id]}</Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body1">{review.comment}</Typography>
                  <Typography variant="caption">{new Date(review.created_at).toLocaleString()}</Typography>
                </CardContent>
              </Card>
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
