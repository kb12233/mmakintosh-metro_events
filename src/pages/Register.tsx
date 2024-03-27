import React, { useState, FormEvent } from 'react';
import { TextField, Button, Typography, Container, Paper, Grid } from '@mui/material';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Add your registration logic here
    console.log('Username:', username, 'Email:', email, 'Password:', password);
    // Reset form fields after submission
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSignUpClick = () => {
     //Add something
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
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
          <Typography variant="body2" align="center" style={{ marginTop: 10, color: 'grey' }}>
            Already have an account? <Button style={{ textTransform: 'none', color: 'blue' }} onClick={handleSignUpClick}>Log in</Button>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
