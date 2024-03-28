import React, { useState, FormEvent } from 'react';
import { TextField, Button, Typography, Container, Paper, Grid } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const { data: userData, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    if (userData) {
      setUser(userData); // Set global user state
      navigate('/metro_events'); // Navigate to the main page
    } else {
      alert('User not found or incorrect password.');
    }
  };

  const handleSignUpClick = () => {
    //Add something
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={0} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" component="h2" gutterBottom style={{ fontWeight: 'bold' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
