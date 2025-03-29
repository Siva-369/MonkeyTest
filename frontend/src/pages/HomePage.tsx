import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../context/store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              AI-Powered Hiring Assessment Platform
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Revolutionize your hiring process with our adaptive AI assessment platform
            </Typography>
            {!isAuthenticated ? (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ mr: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Key Features
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  Adaptive Assessments that evolve with candidate responses
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Technical Skill Assessment for coding and technical knowledge
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Communication Analysis for email etiquette and verbal skills
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Behavioral Analysis for decision-making processes
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Comprehensive Analytics Dashboard for insights
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;