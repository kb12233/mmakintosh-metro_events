import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import supabase from '../supabaseClient'; // adjust import path as necessary

const EventMaker = (props: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('event')
      .insert([
        { 
            organizer_id: props.user.user_id,
            title: title, 
            description: description, 
            location: location, 
            date_time: new Date(dateTime)
        },
      ]);

    setLoading(false);

    if (error) {
      alert('Error creating event: ' + error.message);
    } else {
      alert('Event created successfully!');
      // Reset form or further actions
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation={3} sx={{ padding: '2rem', marginBottom: '2rem' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Location"
            fullWidth
            defaultValue={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Date and Time"
            type="datetime-local"
            fullWidth
            defaultValue={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </Grid>
      </Grid>
      </Paper>
    </form>
  );
};

export default EventMaker;