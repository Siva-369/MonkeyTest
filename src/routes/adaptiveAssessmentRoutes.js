const express = require('express');
const router = express.Router();
const adaptiveAssessmentController = require('../controllers/adaptiveAssessmentController');

// Adaptive assessment routes
router.post('/adaptive', adaptiveAssessmentController.generateAdaptiveAssessment);
router.post('/technical', adaptiveAssessmentController.generateTechnicalAssessment);
router.post('/non-technical', adaptiveAssessmentController.generateNonTechnicalAssessment);
router.post('/analyze-communication', adaptiveAssessmentController.analyzeCommunication);

module.exports = router;