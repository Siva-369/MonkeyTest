/**
 * Candidate routes
 */
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { verifyToken, restrictTo } = require('../middleware');

// Assessment workflow routes
router.post('/:candidateId/assessments/:assessmentId/start', verifyToken, candidateController.startAssessment);
router.post('/:candidateId/submissions/:submissionId/answer', verifyToken, candidateController.submitAnswer);
router.post('/:candidateId/submissions/:submissionId/finish', verifyToken, candidateController.finishAssessment);

module.exports = router;