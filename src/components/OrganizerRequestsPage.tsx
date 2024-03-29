/* eslint-disable @typescript-eslint/no-explicit-any */
// OrganizerRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import supabase from "../supabaseClient";
import OrganizerRequestCard from './OrganizerRequestCard';

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

const OrganizerRequestsPage: React.FC = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    async function fetchRequests() {
      if (user && user.user_type === 2) {
        try {
          const { data: requestsData, error: requestError } = await supabase
            .from('organizer_request')
            .select('user_id, requested_at');
          
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
        } catch (error: any) {
          console.error('Error fetching requests:', error.message);
        }
      }
    }

    fetchRequests();
  }, [user]);

  const handleAcceptRequest = async (userId: string) => {
    try {
      // Update user type to organizer in the database
      const { error: updateError } = await supabase
        .from('user')
        .update({ user_type: 1 }) // Assuming 1 is the type for organizers
        .eq('user_id', userId);
  
      if (updateError) {
        throw new Error(`Error accepting request: ${updateError.message}`);
      }
  
      // Delete the request from the organizer_request table
      const { error: deleteError } = await supabase
        .from('organizer_request')
        .delete()
        .eq('user_id', userId);
  
      if (deleteError) {
        throw new Error(`Error deleting request: ${deleteError.message}`);
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
        .from('organizer_request')
        .delete()
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

  return (
    <div>
      <h1>Organizer Requests</h1>
      <div>
        {requests.map((request) => (
          <OrganizerRequestCard
            key={request.user_id}
            request={request}
            onAccept={() => handleAcceptRequest(request.user_id)}
            onReject={() => handleRejectRequest(request.user_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizerRequestsPage;
