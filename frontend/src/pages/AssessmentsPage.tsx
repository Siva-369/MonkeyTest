import React from 'react';
import { Box, Typography } from '@mui/material';

const AssessmentsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Assessments
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View and manage your assessments here.
      </Typography>
    </Box>
  );
};

export default AssessmentsPage;