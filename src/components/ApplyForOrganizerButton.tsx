/* eslint-disable @typescript-eslint/no-explicit-any */
// ApplyForOrganizerButton.tsx
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useUser } from '../contexts/UserContext'; 
import supabase from "../supabaseClient";

const ApplyForOrganizerButton = (props: any) => {
  // const { user } = useUser();
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkOrganizerRequest = async () => {
      if (props.user) {
        const { data, error } = await supabase
          .from('organizer_request')
          .select('user_id')
          .eq('user_id', props.user.user_id);

        if (error) {
          console.error('Error fetching organizer request:', error.message);
          return;
        }

        setHasApplied(data && data.length > 0);
      }
    };

    checkOrganizerRequest();
  }, [props.user]);

  const applyForOrganizer = async () => {
    setIsLoading(true);
    try {
      if (!props.user) {
        console.error('User is null');
        return;
      }
  
      // Add request to the organizer_request table
      const { error } = await supabase
        .from('organizer_request')
        .insert([{ user_id: props.user?.user_id }]); // Use optional chaining here
  
      if (error) {
        console.error('Error applying for organizer:', error.message);
        return;
      }
  
      setHasApplied(true);
    } catch (error:any) {
      console.error('Error applying for organizer:', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  if (props.user && props.user.user_type === 0 && !hasApplied) {
    return (
      <Button variant="contained" onClick={applyForOrganizer} disabled={isLoading} disableElevation>
        {isLoading ? 'Applying...' : 'Apply for Organizer'}
      </Button>
    );
  } else if (hasApplied) {
    return <Button variant="contained" disabled disableElevation>Waiting for Approval</Button>;
  } else {
    return null;
  }
};

export default ApplyForOrganizerButton;
