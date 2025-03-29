import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Grid
} from '@mui/material';
// Remove unused axios import
import { RootState } from '../../context/store';

interface NotificationSettings {
  emailNotifications: boolean;
  assessmentReminders: boolean;
  resultNotifications: boolean;
  marketingEmails: boolean;
}

const ProfileNotifications: React.FC = () => {
  {/* Using user data to display personalized greeting */}
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Default notification settings - in a real app, these would come from the API
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    assessmentReminders: true,
    resultNotifications: true,
    marketingEmails: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API endpoint to save notification settings
      // await axios.patch('/api/v1/auth/notifications', settings, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Typography variant="h6" gutterBottom>
        Notification Preferences for {user?.firstName || 'User'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage how you receive notifications and updates from MonkeyTest
      </Typography>
      
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={settings.emailNotifications}
              onChange={handleChange}
              name="emailNotifications"
              color="primary"
            />
          }
          label="Email Notifications"
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
          Receive important notifications about your account via email
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.assessmentReminders}
              onChange={handleChange}
              name="assessmentReminders"
              color="primary"
            />
          }
          label="Assessment Reminders"
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
          Get reminders about upcoming assessments and deadlines
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.resultNotifications}
              onChange={handleChange}
              name="resultNotifications"
              color="primary"
            />
          }
          label="Result Notifications"
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
          Be notified when assessment results are available
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.marketingEmails}
              onChange={handleChange}
              name="marketingEmails"
              color="primary"
            />
          }
          label="Marketing Emails"
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
          Receive updates about new features, tips, and promotional offers
        </Typography>
      </FormGroup>
      
      <Grid container justifyContent="flex-start" sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </Grid>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Notification preferences updated successfully"
      />
    </Box>
  );
};

export default ProfileNotifications;