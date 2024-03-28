import React, { useState, FormEvent } from 'react';
import { TextField, Button, Typography, Container, Paper, Grid, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink from react-router-dom
import supabase from '../supabaseClient'; // Adjust the import path based on your project structure

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Insert user into Supabase Database
    const { data, error } = await supabase
      .from('Users')
      .insert([
        {
          username: username,
          email: email,
          password: password, // Note: Storing plain text passwords is highly discouraged
          user_type: 0, // Default to 'user'
          created_at: new Date(),
        },
      ]);

    if (error) {
      console.error('Error inserting new user:', error);
    } else {
      console.log('User created:', data);
      // Reset form fields after successful submission
      setUsername('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={0} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold' }}>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2" style={{ marginTop: 20 }}>
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
