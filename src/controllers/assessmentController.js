const Assessment = require('../models/Assessment');
const aiAnalysisService = require('../services/aiAnalysisService');
const scenarioGeneratorService = require('../services/scenarioGeneratorService');

// Create a new assessment
exports.createAssessment = async (req, res) => {
  try {
    const assessmentData = req.body;
    
    // Generate dynamic scenarios if requested
    if (assessmentData.generateScenarios) {
      const scenario = await scenarioGeneratorService.generateScenario(
        assessmentData.targetRole,
        assessmentData.difficultyLevel,
        assessmentData.requiredSkills
      );
      assessmentData.scenarios = [scenario];
    }

    // Analyze behavioral and scenario questions
    if (assessmentData.questions) {
      assessmentData.questions = assessmentData.questions.map(question => {
        if (question.type === 'behavioral' || question.type === 'scenario') {
          question.aiAnalysis = aiAnalysisService.analyzeBehavioralResponse(question.content);
        }
        return question;
      });
    }

    const assessment = new Assessment({
      ...assessmentData,
      createdBy: req.user.id // Will be set by auth middleware
    });
    await assessment.save();
    res.status(201).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all assessments
exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .sort({ createdAt: -1 })
      .select('-questions.correctAnswer');
    res.status(200).json({
      status: 'success',
      results: assessments.length,
      data: assessments
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get assessment by ID
exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .select('-questions.correctAnswer');
    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update assessment
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true }
    );
    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete assessment
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};