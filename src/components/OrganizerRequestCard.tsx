/* eslint-disable @typescript-eslint/no-unused-vars */
// OrganizerRequestCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useUser } from '../contexts/UserContext';

interface OrganizerRequestCardProps {
  request: {
    user_id: string;
    username: string;
    email: string;
    requested_at: string;
  };
  onAccept: () => void; // Function to handle accepting request
  onReject: () => void; // Function to handle rejecting request
}

const OrganizerRequestCard: React.FC<OrganizerRequestCardProps> = ({ request, onAccept, onReject }) => {
  const { user } = useUser();

  return (
    <Card>
      <CardContent>
        {/* <Typography variant="h5">{request.user_id}</Typography> */}
        <Typography variant="h5">{request.username}</Typography>
        <Typography variant="body2">Email: {request.email}</Typography>
        <Typography variant="body2">Requested At: {new Date(request.requested_at).toLocaleString()}</Typography>
        {user?.user_type === 2 && ( // Assuming 2 is the type for admins
          <div>
            <Button onClick={onAccept}>Accept</Button>
            <Button onClick={onReject}>Decline</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizerRequestCard;
