import React from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';

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
    <Card variant='outlined'>
      <CardContent>
        <Typography variant="h5">{request.username}</Typography>
        <Typography variant="body2">Email: {request.email}</Typography>
        <Typography variant="body2">Requested At: {new Date(request.requested_at).toLocaleString()}</Typography>
        <Stack direction='row' spacing={1} sx={{ marginTop: 1 }}>
          <Button variant='outlined' color='success' onClick={onAccept}>Accept</Button>
          <Button variant='outlined' color='error' onClick={onReject}>Reject</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
