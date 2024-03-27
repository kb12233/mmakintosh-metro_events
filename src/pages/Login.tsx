import React, { useState, FormEvent } from 'react';
import { TextField, Button, Typography, Container, Paper, Grid } from '@mui/material';
import Register from './Register'; // Import your Register component

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showRegister, setShowRegister] = useState<boolean>(false); // State to control whether to show Register component or not

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Add your login logic here, e.g., sending credentials to server for authentication
    console.log('Email:', email, 'Password:', password);
    // Reset form fields after submission
    setEmail('');
    setPassword('');
  };

  const handleSignUpClick = () => {
    //Add something
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
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
          <Typography variant="body2" align="center" style={{ marginTop: 10, color: 'grey'}}>
            Don't have an account? <Button style={{ textTransform: 'none', color: 'blue' }} onClick={handleSignUpClick}>Sign up</Button>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
