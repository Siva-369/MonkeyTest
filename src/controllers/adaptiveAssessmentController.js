/**
 * Adaptive Assessment Controller
 * Handles the generation and evaluation of dynamic, non-repetitive scenarios
 * and comprehensive skill assessments for candidates.
 */

const Assessment = require('../models/Assessment');
const Candidate = require('../models/Candidate');
const adaptiveScenarioService = require('../services/adaptiveScenarioService');
const communicationAnalysisService = require('../services/communicationAnalysisService');
const skillAssessmentService = require('../services/skillAssessmentService');
const adaptiveDifficultyService = require('../services/adaptiveDifficultyService');
const enhancedBehavioralAnalysisService = require('../services/enhancedBehavioralAnalysisService');
const visualizationService = require('../services/visualizationService');
const codeEvaluationService = require('../services/codeEvaluationService');

/**
 * Generate a dynamic adaptive assessment for a specific role
 */
exports.generateAdaptiveAssessment = async (req, res) => {
  try {
    const { role, difficultyLevel, skills, isAdaptive = true } = req.body;
    
    if (!role || !difficultyLevel || !skills) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: role, difficultyLevel, or skills'
      });
    }
    
    // Generate dynamic scenarios based on role and skills with candidate profile if available
    const candidateProfile = req.body.candidateId ? await Candidate.findById(req.body.candidateId) : null;
    const scenario = await adaptiveScenarioService.generateDynamicScenario(
      role, 
      difficultyLevel, 
      skills,
      [],  // No previous responses yet
      candidateProfile
    );
    
    // Create a new assessment with the generated scenario
    const assessment = new Assessment({
      title: `${role} Adaptive Assessment`,
      description: `Dynamic assessment for ${role} position with ${difficultyLevel} difficulty`,
      type: role.includes('developer') || role.includes('engineer') ? 'technical' : 'behavioral',
      duration: 60, // Default duration in minutes
      totalPoints: scenario.questions.reduce((sum, q) => sum + q.points, 0),
      passingScore: 70, // Default passing score
      scenarios: [scenario],
      questions: scenario.questions,
      status: 'active',
      createdBy: req.user ? req.user.id : null,
      isAdaptive,
      targetRole: role,
      requiredSkills: skills,
      difficultyLevel,
      adaptiveRules: [
        {
          condition: 'performance > 0.8',
          action: 'increase_difficulty',
          threshold: 0.8
        },
        {
          condition: 'performance < 0.4',
          action: 'decrease_difficulty',
          threshold: 0.4
        }
      ],
      scoringCriteria: [
        {
          category: 'problem_solving',
          weight: 0.3,
          passingScore: 60
        },
        {
          category: 'critical_thinking',
          weight: 0.3,
          passingScore: 60
        },
        {
          category: 'communication',
          weight: 0.2,
          passingScore: 60
        },
        {
          category: 'technical_expertise',
          weight: 0.2,
          passingScore: 60
        }
      ]
    });
    
    await assessment.save();
    
    res.status(201).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    console.error('Error generating adaptive assessment:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate adaptive assessment'
    });
  }
};

/**
 * Generate a technical skill assessment for a specific role
 */
/**
 * Adjust question difficulty based on candidate performance
 */
/**
 * Analyze candidate communication patterns and behavioral traits
 */
exports.analyzeCommunication = async (req, res) => {
  try {
    const { response, communicationType, context } = req.body;
    
    if (!response) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameter: response'
      });
    }
    
    // Perform enhanced behavioral analysis
    const behavioralAnalysis = await enhancedBehavioralAnalysisService.analyzeBehavior(response, context);
    
    // Generate visualization data for the analysis
    const communicationVisualization = visualizationService.generateCommunicationPatternsData(
      behavioralAnalysis.communication
    );
    
    const emotionVisualization = visualizationService.generateBehavioralAnalysisData(
      behavioralAnalysis
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        behavioralAnalysis,
        visualizations: {
          communication: communicationVisualization,
          emotions: emotionVisualization
        }
      }
    });
  } catch (error) {
    console.error('Error analyzing communication:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to analyze communication'
    });
  }
};

/**
 * Adjust question difficulty based on candidate performance
 */
exports.adjustQuestionDifficulty = async (req, res) => {
  try {
    const { candidateId, assessmentId, currentDifficulty, performanceScore } = req.body;
    
    if (!candidateId || !assessmentId || !currentDifficulty || performanceScore === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: candidateId, assessmentId, currentDifficulty, or performanceScore'
      });
    }
    
    // Get candidate profile and previous responses
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }
    
    // Find the assessment submission
    const assessmentSubmission = candidate.assessmentSubmissions.find(
      submission => submission.assessment.toString() === assessmentId
    );
    
    if (!assessmentSubmission) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment submission not found'
      });
    }
    
    // Calculate next difficulty level using the adaptive difficulty service
    const nextDifficulty = adaptiveDifficultyService.calculateNextDifficulty(
      assessmentSubmission.answers,
      candidate,
      currentDifficulty,
      performanceScore
    );
    
    // Update the assessment submission with the new difficulty level
    assessmentSubmission.currentDifficulty = nextDifficulty;
    await candidate.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        previousDifficulty: currentDifficulty,
        newDifficulty: nextDifficulty,
        candidateId,
        assessmentId
      }
    });
  } catch (error) {
    console.error('Error adjusting question difficulty:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to adjust question difficulty'
    });
  }
};

/**
 * Generate a non-technical assessment for business and management roles
 */
exports.generateNonTechnicalAssessment = async (req, res) => {
  try {
    const { role, level, skills } = req.body;
    
    if (!role || !level || !skills) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: role, level, or skills'
      });
    }
    
    // Generate non-technical assessment
    const nonTechnicalAssessment = await skillAssessmentService.generateNonTechnicalAssessment(
      role,
      level,
      skills
    );
    
    // Create a new assessment with the generated non-technical content
    const assessment = new Assessment({
      title: `${role} Non-Technical Assessment`,
      description: `Comprehensive non-technical assessment for ${level} ${role} position`,
      type: 'behavioral',
      duration: 90, // Default duration in minutes for non-technical assessments
      totalPoints: 100, // Default total points
      passingScore: 70, // Default passing score
      questions: [
        // Convert case studies to questions
        ...nonTechnicalAssessment.caseStudies.map((caseStudy, index) => ({
          content: caseStudy.description,
          type: 'case_study',
          difficulty: caseStudy.difficulty,
          points: caseStudy.difficulty === 'easy' ? 15 : (caseStudy.difficulty === 'medium' ? 20 : 25),
          category: 'problem_solving',
          metadata: { caseStudyIndex: index }
        })),
        // Add decision-making scenarios as questions
        ...nonTechnicalAssessment.decisionScenarios.map((scenario, index) => ({
          content: scenario.description,
          type: 'decision_making',
          difficulty: scenario.difficulty,
          points: scenario.difficulty === 'easy' ? 15 : (scenario.difficulty === 'medium' ? 20 : 25),
          category: 'decision_making',
          metadata: { scenarioIndex: index }
        })),
        // Add behavioral questions
        ...nonTechnicalAssessment.behavioralQuestions.map((q, index) => ({
          content: q.question,
          type: 'behavioral',
          difficulty: 'medium',
          points: 10,
          category: 'behavioral',
          metadata: { questionIndex: index }
        }))
      ],
      status: 'active',
      createdBy: req.user ? req.user.id : null,
      isAdaptive: true,
      targetRole: role,
      requiredSkills: skills,
      difficultyLevel: level === 'junior' ? 'entry' : (level === 'mid' ? 'intermediate' : 'advanced'),
      scoringCriteria: [
        {
          category: 'problem_solving',
          weight: 0.3,
          passingScore: 60
        },
        {
          category: 'decision_making',
          weight: 0.3,
          passingScore: 60
        },
        {
          category: 'behavioral',
          weight: 0.2,
          passingScore: 60
        },
        {
          category: 'communication',
          weight: 0.2,
          passingScore: 60
        }
      ]
    });
    
    await assessment.save();
    
    res.status(201).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    console.error('Error generating non-technical assessment:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate non-technical assessment'
    });
  }
};

exports.generateTechnicalAssessment = async (req, res) => {
  try {
    const { role, level, technologies } = req.body;
    
    if (!role || !level || !technologies) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: role, level, or technologies'
      });
    }
    
    // Generate technical assessment
    const technicalAssessment = await skillAssessmentService.generateTechnicalAssessment(
      role,
      level,
      technologies
    );
    
    // Create a new assessment with the generated technical content
    const assessment = new Assessment({
      title: `${role} Technical Assessment`,
      description: `Comprehensive technical assessment for ${level} ${role} position`,
      type: 'technical',
      duration: 120, // Default duration in minutes for technical assessments
      totalPoints: 100, // Default total points
      passingScore: 70, // Default passing score
      questions: [
        // Convert coding challenges to questions
        ...technicalAssessment.codingChallenges.map((challenge, index) => ({
          content: challenge.description,
          type: 'coding',
          difficulty: challenge.difficulty,
          points: challenge.difficulty === 'easy' ? 10 : (challenge.difficulty === 'medium' ? 15 : 20),
          category: 'technical_expertise',
          metadata: { challengeIndex: index }
        })),
        // Add system design as a question
        {
          content: technicalAssessment.systemDesign.description,
          type: 'system_design',
          difficulty: 'hard',
          points: 25,
          category: 'system_design',
          metadata: { requirements: technicalAssessment.systemDesign.requirements }
        },
        // Add debugging exercise as a question
        {
          content: technicalAssessment.debuggingExercise.description,
          type: 'debugging',
          difficulty: 'medium',
          points: 15,
          category: 'debugging',
          metadata: { codeSnippet: technicalAssessment.debuggingExercise.codeSnippet }
        },
        // Add knowledge questions
        ...technicalAssessment.knowledgeQuestions.map((q, index) => ({
          content: q.question,
          type: 'knowledge',
          difficulty: 'medium',
          points: 6,
          category: 'knowledge',
          metadata: { questionIndex: index }
        }))
      ],
      status: 'active',
      createdBy: req.user ? req.user.id : null,
      isAdaptive: false,
      targetRole: role,
      requiredSkills: technologies,
      difficultyLevel: level === 'junior' ? 'entry' : (level === 'mid' ? 'intermediate' : 'advanced'),
      scoringCriteria: [
        {
          category: 'technical_expertise',
          weight: 0.5,
          passingScore: 60
        },
        {
          category: 'system_design',
          weight: 0.25,
          passingScore: 60
        },
        {
          category: 'debugging',
          weight: 0.15,
          passingScore: 60
        },
        {
          category: 'knowledge',
          weight: 0.1,
          passingScore: 60
        }
      ]
    });
    
    await assessment.save();
    
    res.status(201).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    console.error('Error generating technical assessment:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate technical assessment'
    });
  }
};

/**
 * Generate a non-technical skill assessment for a specific role
 */
exports.generateNonTechnicalAssessment = async (req, res) => {
  try {
    const { role, level, skills } = req.body;
    
    if (!role || !level || !skills) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: role, level, or skills'
      });
    }
    
    // Generate non-technical assessment
    const nonTechnicalAssessment = await skillAssessmentService.generateNonTechnicalAssessment(
      role,
      level,
      skills
    );
    
    // Create a new assessment with the generated non-technical content
    const assessment = new Assessment({
      title: `${role} Non-Technical Assessment`,
      description: `Comprehensive non-technical assessment for ${level} ${role} position`,
      type: 'behavioral',
      duration: 90, // Default duration in minutes for non-technical assessments
      totalPoints: 100, // Default total points
      passingScore: 70, // Default passing score
      questions: [
        // Add case study as a question
        {
          content: nonTechnicalAssessment.caseStudy.background,
          type: 'case_study',
          difficulty: 'hard',
          points: 30,
          category: 'strategic_thinking',
          metadata: { 
            title: nonTechnicalAssessment.caseStudy.title,
            challenges: nonTechnicalAssessment.caseStudy.challenges,
            questions: nonTechnicalAssessment.caseStudy.questions
          }
        },
        // Add scenario questions
        ...nonTechnicalAssessment.scenarios.map((scenario, index) => ({
          content: scenario.context,
          type: 'scenario',
          difficulty: 'medium',
          points: 20,
          category: 'decision_making',
          metadata: { 
            title: scenario.title,
            stakeholders: scenario.stakeholders,
            questions: scenario.questions
          }
        })),
        // Add data exercise as a question
        {
          content: nonTechnicalAssessment.dataExercise.description,
          type: 'data_analysis',
          difficulty: 'medium',
          points: 15,
          category: 'analytical_thinking',
          metadata: { 
            title: nonTechnicalAssessment.dataExercise.title,
            dataDescription: nonTechnicalAssessment.dataExercise.dataDescription,
            questions: nonTechnicalAssessment.dataExercise.questions
          }
        },
        // Add knowledge questions
        ...nonTechnicalAssessment.knowledgeQuestions.map((q, index) => ({
          content: q.question,
          type: 'knowledge',
          difficulty: 'medium',
          points: 5,
          category: 'domain_knowledge',
          metadata: { questionIndex: index }
        }))
      ],
      status: 'active',
      createdBy: req.user ? req.user.id : null,
      isAdaptive: false,
      targetRole: role,
      requiredSkills: skills,
      difficultyLevel: level === 'junior' ? 'entry' : (level === 'mid' ? 'intermediate' : 'advanced'),
      scoringCriteria: [
        {
          category: 'strategic_thinking',
          weight: 0.3,
          passingScore: 60
        },
        {
          category: 'decision_making',
          weight: 0.3,
          passingScore: 60
        },
        {
          category: 'analytical_thinking',
          weight: 0.2,
          passingScore: 60
        },
        {
          category: 'domain_knowledge',
          weight: 0.2,
          passingScore: 60
        }
      ]
    });
    
    await assessment.save();
    
    res.status(201).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    console.error('Error generating non-technical assessment:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate non-technical assessment'
    });
  }
};

/**
 * Analyze communication patterns in candidate responses
 */
exports.analyzeCommunication = async (req, res) => {
  try {
    const { response, communicationType, context } = req.body;
    
    if (!response) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameter: response'
      });
    }
    
    // Analyze communication using the service
    const analysis = await communicationAnalysisService.analyzeCommunication(
      response,
      communicationType || 'written',
      context || {}
    );
    
    // Also detect behavioral tendencies
    const behavioralAnalysis = communicationAnalysisService.detectBehavioralTendencies(response);
    
    res.status(200).json({
      status: 'success',
      data: {
        ...analysis,
        ...behavioralAnalysis
      }
    });
  } catch (error) {
    console.error('Error analyzing communication:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to analyze communication'
    });
  }
};