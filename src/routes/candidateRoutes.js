const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// Assessment workflow routes
router.post('/:candidateId/assessments/:assessmentId/start', candidateController.startAssessment);
router.post('/:candidateId/submissions/:submissionId/answer', candidateController.submitAnswer);
router.post('/:candidateId/submissions/:submissionId/finish', candidateController.finishAssessment);

module.exports = router;