import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import supabase from '../supabaseClient'; // Adjust path as necessary
import { useUser } from '../contexts/UserContext';
import AllJoinRequestCard from './AllJoinRequestCard'; // Import AllJoinRequestCard component

interface Request {
  user_id: string;
  requested_at: string;
  event_id: string;
}

const AllJoinRequestsPage: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);

  async function fetchUserDetails(requestsData: Request[]) {
    const requestsWithUserDetails = await Promise.all(requestsData.map(async (request) => {
      try {
        const { data, error } = await supabase
          .from('user')
          .select('username')
          .eq('user_id', request.user_id)
          .single();

        if (error) {
          throw new Error(`Error fetching user details: ${error.message}`);
        }

        return {
          ...request,
          username: data?.username || 'Unknown',
        };
      } catch (error: any) {
        console.error('Error fetching user details:', error.message);
        return { ...request, username: 'Unknown' };
      }
    }));

    return requestsWithUserDetails;
  }

  async function fetchEventTitle(requestsData: Request[]) {
    const requestsWithEventTitle = await Promise.all(requestsData.map(async (request) => {
      try {
        const { data, error } = await supabase
          .from('event')
          .select('title')
          .eq('event_id', request.event_id)
          .single();

        if (error) {
          throw new Error(`Error fetching event title: ${error.message}`);
        }

        return {
          ...request,
          event_title: data?.title || 'Unknown',
        };
      } catch (error: any) {
        console.error('Error fetching event title:', error.message);
        return { ...request, event_title: 'Unknown' };
      }
    }));

    return requestsWithEventTitle;
  }

  useEffect(() => {
    async function fetchAllJoinRequests() {
      try {
        if (!user) return; // Ensure user is logged in
        let eventData: any;
        if (user.user_type === 2) { // Admin
          eventData = await supabase.from('event_participant').select('user_id, requested_at, event_id').eq('status', 0); // Assuming 0 is the status for pending requests
        } else { // Organizer
          eventData = await supabase.from('event').select('event_id').eq('organizer_id', user.user_id);
        }

        if (!eventData.data || eventData.data.length === 0) {
          // If no events found for admin or organizer, set loading to false and return
          setLoading(false);
          return;
        }

        const eventIds = eventData.data.map((event: any) => event.event_id);

        const joinRequests = await supabase
          .from('event_participant')
          .select('user_id, requested_at, event_id')
          .in('event_id', eventIds)
          .eq('status', 0); // Assuming 0 is the status for pending requests

        const requestsWithUserDetails = await fetchUserDetails(joinRequests.data || []);
        const requestsWithEventTitle = await fetchEventTitle(requestsWithUserDetails);

        setRequests(requestsWithEventTitle);
      } catch (error: any) {
        console.error('Error fetching join requests:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllJoinRequests();
  }, [user]);

  const handleAcceptRequest = async (userId: string, eventId: string) => {
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

  const handleRejectRequest = async (userId: string, eventId: string) => {
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
      <Typography variant="h4" gutterBottom>All Join Requests</Typography>
      <div>
        {requests.length ? (
          requests.map((request) => (
            <AllJoinRequestCard
              key={request.user_id}
              request={request}
              onAccept={() => handleAcceptRequest(request.user_id, request.event_id)}
              onReject={() => handleRejectRequest(request.user_id, request.event_id)}
            />
          ))
        ) : (
          <Typography variant="body1">No join requests found</Typography>
        )}
      </div>
    </div>
  );
};

export default AllJoinRequestsPage;
