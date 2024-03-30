/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material';
import supabase from '../supabaseClient'; // Adjust path as necessary
import RequestCard from './RequestCard'; // Import your custom request card component
import { useUser } from '../contexts/UserContext'; // Importing useUser hook from UserContext

interface Request {
  user_id: string;
  username: string;
  email: string;
  requested_at: string;
}

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

const EventRequestsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [organizerId, setOrganizerId] = useState<string | null>(null); // Added state for organizer ID

  useEffect(() => {
    async function fetchRequests() {
      if (user && (user.user_type === 1 || user.user_type === 2)) { // Check if user is an organizer or admin
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

          // Set organizer ID
          setOrganizerId(eventData?.organizer_id || null);

          // If user is organizer and their ID matches the organizer ID of the event
          if (user.user_type === 1 && user.user_id === eventData?.organizer_id) {
            const { data: requestsData, error: requestError } = await supabase
              .from('event_participant')
              .select('user_id, requested_at')
              .eq('event_id', eventId);

            if (requestError) {
              console.error('Error fetching requests:', requestError.message);
              return;
            }

            // Fetch user details for each request
            const requestsWithUserDetails = await Promise.all(requestsData.map(async (request) => {
              const userData = await fetchUser(request.user_id);
              return {
                ...request,
                username: userData?.username || 'Unknown',
                email: userData?.email || 'Unknown',
              };
            }));

            // Set the fetched data to the state
            setRequests(requestsWithUserDetails);
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
    } catch (error: any) {
      console.error('Error rejecting request:', error.message);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Event Join Requests</Typography>
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
    </div>
  );
};

export default EventRequestsPage;
