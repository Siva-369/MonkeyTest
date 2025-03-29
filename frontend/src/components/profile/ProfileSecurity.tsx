import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { changePassword } from '../../context/slices/authSlice';
import { RootState } from '../../context/store';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSecurity: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setError(null);
    
    try {
      // Use Redux action instead of direct axios call
      const resultAction = await dispatch(changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }) as any);
      
      if (changePassword.fulfilled.match(resultAction)) {
        // Show success message and reset form
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {authError && <Alert severity="error" sx={{ mb: 3 }}>{authError}</Alert>}
      
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your password must be at least 8 characters long and include a mix of letters, numbers, and symbols for better security.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''}
            helperText={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </Grid>
      </Grid>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Password changed successfully"
      />
    </Box>
  );
};

export default ProfileSecurity;