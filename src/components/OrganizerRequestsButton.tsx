import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const OrganizerRequestsButton = (props: any) => {
  // const { user } = useUser();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/organizer_requests');
  };

  if (props.user && props.user.user_type === 2) {
    return <Button variant="contained" onClick={handleClick}>View Organizer Requests</Button>;
  }

  return null;
};

export default OrganizerRequestsButton;
