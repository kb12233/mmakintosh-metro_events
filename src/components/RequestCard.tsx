import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface RequestCardProps {
  request: {
    user_id: string;
    username: string;
    email: string;
    requested_at: string;
  };
  onAccept: () => void;
  onReject: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onReject }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{request.username}</Typography>
        <Typography variant="body2">Email: {request.email}</Typography>
        <Typography variant="body2">Requested At: {new Date(request.requested_at).toLocaleString()}</Typography>
        <div>
          <Button onClick={onAccept}>Accept</Button>
          <Button onClick={onReject}>Reject</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
