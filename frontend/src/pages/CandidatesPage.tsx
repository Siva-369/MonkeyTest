import React from 'react';
import { Box, Typography } from '@mui/material';

const CandidatesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Candidates
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View and manage candidates here.
      </Typography>
    </Box>
  );
};

export default CandidatesPage;