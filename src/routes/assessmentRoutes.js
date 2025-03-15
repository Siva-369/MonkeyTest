const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

// Assessment routes
router.post('/', assessmentController.createAssessment);
router.get('/', assessmentController.getAllAssessments);
router.get('/:id', assessmentController.getAssessment);
router.put('/:id', assessmentController.updateAssessment);
router.delete('/:id', assessmentController.deleteAssessment);

module.exports = router;