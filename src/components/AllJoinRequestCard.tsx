import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface AllJoinRequestCardProps {
  request: {
    user_id: string;
    username: string;
    requested_at: string;
    event_title: string; // Assuming you want to display the title of the event
  };
  onAccept: () => void;
  onReject: () => void;
}

const AllJoinRequestCard: React.FC<AllJoinRequestCardProps> = ({ request, onAccept, onReject }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{request.username}</Typography>
        <Typography variant="body2">Requested At: {new Date(request.requested_at).toLocaleString()}</Typography>
        <Typography variant="body2">Event Title: {request.event_title}</Typography>
        <Button onClick={onAccept}>Accept</Button>
        <Button onClick={onReject}>Reject</Button>
      </CardContent>
    </Card>
  );
};

export default AllJoinRequestCard;
