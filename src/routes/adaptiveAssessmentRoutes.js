const express = require('express');
const router = express.Router();
const adaptiveAssessmentController = require('../controllers/adaptiveAssessmentController');

// Generate adaptive assessment
router.post('/generate', adaptiveAssessmentController.generateAdaptiveAssessment);

// Generate technical assessment
router.post('/technical', adaptiveAssessmentController.generateTechnicalAssessment);

// Adjust question difficulty based on candidate performance
router.post('/adjust-difficulty', adaptiveAssessmentController.adjustQuestionDifficulty);
router.post('/non-technical', adaptiveAssessmentController.generateNonTechnicalAssessment);
router.post('/analyze-communication', adaptiveAssessmentController.analyzeCommunication);

module.exports = router;