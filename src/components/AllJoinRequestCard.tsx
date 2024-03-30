import React from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';

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
    <Card variant='outlined' sx={{ marginBottom: 1 }}>
      <CardContent>
        <Typography variant="h5">{request.username}</Typography>
        <Typography variant="body2">Requested At: {new Date(request.requested_at).toLocaleString()}</Typography>
        <Typography variant="body2">Event Title: {request.event_title}</Typography>
        <Stack direction='row' spacing={1} sx={{ marginTop: 1 }}>
          <Button variant='outlined' color='success' onClick={onAccept}>Accept</Button>
          <Button variant='outlined' color='error' onClick={onReject}>Reject</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AllJoinRequestCard;
