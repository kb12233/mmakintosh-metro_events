import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, CircularProgress, Button } from '@mui/material';
import supabase from '../supabaseClient'; // Adjust path as necessary
import RequestCard from './RequestCard'; // Import your custom request card component
import { useUser } from '../contexts/UserContext'; // Importing useUser hook from UserContext

interface Request {
  user_id: string;
  username: string;
  email: string;
  requested_at: string;
}

// async function fetchUser(userId: string) {
//   try {
//     const { data, error } = await supabase
//       .from('user')
//       .select('username, email')
//       .eq('user_id', userId)
//       .single();

//     if (error) {
//       throw new Error(`Error fetching user: ${error.message}`);
//     }

//     return data;
//   } catch (error: any) {
//     console.error('Error fetching user:', error.message);
//     return null;
//   }
// }

const EventRequestsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [organizerId, setOrganizerId] = useState<string | null>(null); // Added state for organizer ID
  const [isEventIdMatching, setIsEventIdMatching] = useState<boolean>(false); // State to track if the clicked eventId matches the fetched event_id

  async function fetchUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('username, email')
        .eq('user_id', userId)
        .single();
  
      if (error) {
        throw new Error(`Error fetching user: ${error.message}`);
      }
  
      return data;
    } catch (error: any) {
      console.error('Error fetching user:', error.message);
      return null;
    }
  }

  useEffect(() => {
    async function fetchRequests() {
      if (user && (user.user_type === 1 || user.user_type === 2)) {
        try {
          const { data: eventData, error: eventError } = await supabase
            .from('event')
            .select('organizer_id')
            .eq('event_id', eventId)
            .single();
  
          if (eventError) {
            console.error('Error fetching event organizer:', eventError.message);
            return;
          }
  
          setOrganizerId(eventData?.organizer_id || null);
  
          if ((user.user_type === 1 && user.user_id === eventData?.organizer_id) || user.user_type === 2) {
            // Fetch requests only if the array of fetched requests is empty for the clicked event
            if (requests.length === 0) {
              const { data: requestsData, error: requestError } = await supabase
                .from('event_participant')
                .select('user_id, requested_at, event_id') // Include event_id in the selection
                .eq('event_id', eventId)
                .eq('status', 0);
  
              if (requestError) {
                console.error('Error fetching requests:', requestError.message);
                return;
              }
  
              //from the requests data array, we fetch requests that match the eventId clicked
              const requestsForEvent = requestsData.filter(request => eventId === request.event_id);
  
              //we then fetch the details of the users who sent the requests
              const requestsWithUserDetails = await Promise.all(requestsForEvent.map(async (request) => {
                const userData = await fetchUser(request.user_id);
                return {
                  ...request,
                  username: userData?.username || 'Unknown',
                  email: userData?.email || 'Unknown',
                };
              }));
  
              setRequests(requestsWithUserDetails);
  
              // Check if any fetched request has a different event ID than the clicked event
              const hasMismatchedEventId = requestsForEvent.some(request => eventId !== request.event_id);
              setIsEventIdMatching(!hasMismatchedEventId);
            }
          } else {
            setRequests([]);
            setIsEventIdMatching(false);
          }
        } catch (error: any) {
          console.error('Error fetching requests:', error.message);
        }
      }
    }
  
    fetchRequests();
    setLoading(false);
  }, [eventId, user]);
  
  
  
  const handleAcceptRequest = async (userId: string) => {
    try {
      // Update user status to accepted for this event in the database
      const { error } = await supabase
        .from('event_participant')
        .update({ status: 1 }) // Assuming 1 is the status for accepted
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Error accepting request: ${error.message}`);
      }

      // Remove the accepted request from the state
      setRequests(requests.filter(request => request.user_id !== userId));

      //get event title
      const { data: eventData, error: eventError } = await supabase
        .from('event')
        .select('title')
        .eq('event_id', eventId)
        .single();

      if (eventError) {
        throw new Error(`Error fetching event details: ${eventError.message}`);
      }

      const notificationMessage = `Your request to join the event "${eventData.title}" has been accepted.`;
      //populate notif table
      const { error: insertError } = await supabase
        .from('notification')
        .insert([
        {
          user_id: userId,
          event_id: eventId,
          message: notificationMessage,
          is_read: false, // Assuming the notification is initially unread
          created_at: new Date().toISOString(),
        }
      ]);

      if (insertError) {
        throw new Error(`Error inserting notification: ${insertError.message}`);
      }
    } catch (error: any) {
      console.error('Error accepting request:', error.message);
    }
  };

  const handleRejectRequest = async (userId: string) => {
    try {
      // Delete the request from the database
      const { error } = await supabase
        .from('event_participant')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Error rejecting request: ${error.message}`);
      }

      // Remove the rejected request from the state
      setRequests(requests.filter(request => request.user_id !== userId));

      //get event title
      const { data: eventData, error: eventError } = await supabase
        .from('event')
        .select('title')
        .eq('event_id', eventId)
        .single();

      if (eventError) {
        throw new Error(`Error fetching event details: ${eventError.message}`);
      }

      const notificationMessage = `Your request to join the event "${eventData.title}" has been declined.`;
      //populate notif table
      const { error: insertError } = await supabase
        .from('notification')
        .insert([
        {
          user_id: userId,
          event_id: eventId,
          message: notificationMessage,
          is_read: false, // Assuming the notification is initially unread
          created_at: new Date().toISOString(),
        }
      ]);

      if (insertError) {
        throw new Error(`Error inserting notification: ${insertError.message}`);
      }
    } catch (error: any) {
      console.error('Error rejecting request:', error.message);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Event Join Requests</Typography>
      {!isEventIdMatching && <Typography variant="body1">No event found with the provided ID</Typography>}
      <div>
        {requests.length ? (
          requests.map((request) => (
            <RequestCard
              key={request.user_id}
              request={request}
              onAccept={() => handleAcceptRequest(request.user_id)}
              onReject={() => handleRejectRequest(request.user_id)}
            />
          ))
        ) : (
          <Typography variant="body1">No join requests found for this event</Typography>
        )}
      </div>
      <Button component={Link} to="/metro_events" variant="contained" color="primary">Back to Home Page</Button> {/* Button to route back to MetroEvents */}
    </div>
  );
};

export default EventRequestsPage;
