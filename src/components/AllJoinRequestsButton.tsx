/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const AllJoinRequestsButton = (props: any) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/all-join-requests');
  };

  return (
    <Button variant='contained' onClick={handleClick} disableElevation>
      All Join Requests
    </Button>
  );
};

export default AllJoinRequestsButton;
