import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Box, Stack } from '@mui/material';
import supabase from '../supabaseClient';

const EventMaker = (props: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false); // State to track if form is expanded

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // Destructure data and error but ignore data
    const { error } = await supabase
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
      setExpanded(false); // Reset expanded
    } else {
      alert('Event created successfully!');
      setTitle(''); // Reset title
      setDescription(''); // Reset description
      setLocation(''); // Reset location
      setDateTime(''); // Reset dateTime
      setExpanded(false); // Reset expanded
    }
  };

  const handleClose = () => {
    setExpanded(false); // Reset expanded
  }

  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation={3} sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={() => setExpanded(true)} // Expand form when title is clicked
        />
        <Box m={2} />
        {expanded && ( // Render the rest of the form fields only if expanded is true
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date and Time"
                  type="datetime-local"
                  fullWidth
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
                <Button 
                      variant="text"
                      onClick={handleClose}
                    >
                      close
                    </Button>
                </Stack>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </form>
  );
};

export default EventMaker;
