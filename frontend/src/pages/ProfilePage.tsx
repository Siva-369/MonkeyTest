import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';

import { RootState } from '../context/store';
import ProfileDetails from '../components/profile/ProfileDetails';
import ProfileSecurity from '../components/profile/ProfileSecurity';
import ProfileNotifications from '../components/profile/ProfileNotifications';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const paths = ['', '/security', '/notifications'];
    navigate(`/profile${paths[newValue]}`);
  };

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Information" />
            <Tab label="Security" />
            <Tab label="Notifications" />
          </Tabs>
        </Box>

        <Routes>
          <Route index element={<ProfileDetails />} />
          <Route path="/security" element={<ProfileSecurity />} />
          <Route path="/notifications" element={<ProfileNotifications />} />
        </Routes>
      </Paper>
    </Container>
  );
};

export default ProfilePage;