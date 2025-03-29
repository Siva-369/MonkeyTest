/**
 * Candidate controller
 */
const Candidate = require('../models/Candidate');
const Assessment = require('../models/Assessment');
const { AppError } = require('../middleware');
const aiAnalysisService = require('../services/aiAnalysisService');

/**
 * Calculate difficulty adjustment based on performance
 */
const calculateDifficultyAdjustment = (performance, currentDifficulty) => {
  const difficultyLevels = ['easy', 'medium', 'hard'];
  const currentIndex = difficultyLevels.indexOf(currentDifficulty);
  
  if (performance >= 0.8 && currentIndex < difficultyLevels.length - 1) {
    return difficultyLevels[currentIndex + 1];
  } else if (performance <= 0.4 && currentIndex > 0) {
    return difficultyLevels[currentIndex - 1];
  }
  return currentDifficulty;
};

/**
 * Evaluate answer based on question type
 */
const evaluateAnswer = (question, answer) => {
  let isCorrect = false;
  let points = 0;

  switch (question.type) {
    case 'multiple_choice':
      isCorrect = answer === question.correctAnswer;
      points = isCorrect ? question.points : 0;
      break;
    case 'coding':
      // Placeholder for code evaluation logic
      points = Math.floor(question.points * 0.8); // Temporary scoring
      isCorrect = points > 0;
      break;
    case 'behavioral':
    case 'scenario':
      const analysis = aiAnalysisService.analyzeBehavioralResponse(answer);
      const sentimentScore = analysis.sentiment.score;
      const communicationScore = (analysis.communication.clarity + analysis.communication.coherence) / 2;
      const leadershipScore = analysis.leadership.score;
      
      // Calculate points based on AI analysis
      const maxPoints = question.points;
      points = Math.floor(maxPoints * (
        (sentimentScore + communicationScore + leadershipScore) / 300
      ));
      isCorrect = points > (maxPoints * 0.6); // 60% threshold for correctness
      break;
  }

  return { isCorrect, points };
};

/**
 * Start an assessment for a candidate
 */
exports.startAssessment = async (req, res, next) => {
  try {
    const { candidateId, assessmentId } = req.params;
    
    const candidate = await Candidate.findById(candidateId);
    const assessment = await Assessment.findById(assessmentId);

    if (!candidate || !assessment) {
      return next(new AppError('Candidate or Assessment not found', 404));
    }

    const submission = {
      assessment: assessmentId,
      startTime: new Date(),
      status: 'in_progress',
      currentDifficulty: 'easy'
    };

    candidate.assessmentSubmissions.push(submission);
    await candidate.save();

    res.status(200).json({
      status: 'success',
      message: 'Assessment started successfully',
      data: {
        submissionId: candidate.assessmentSubmissions[candidate.assessmentSubmissions.length - 1]._id
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit an answer for a question in an assessment
 */
exports.submitAnswer = async (req, res, next) => {
  try {
    const { candidateId, submissionId } = req.params;
    const { questionId, answer, timeSpent } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return next(new AppError('Candidate not found', 404));
    }

    const submission = candidate.assessmentSubmissions.id(submissionId);
    if (!submission || submission.status !== 'in_progress') {
      return next(new AppError('Invalid submission', 400));
    }

    const assessment = await Assessment.findById(submission.assessment);
    const question = assessment.questions.id(questionId) || 
                    assessment.scenarios.reduce((q, s) => 
                      q || s.questions.id(questionId), null);

    if (!question) {
      return next(new AppError('Question not found', 404));
    }

    const { isCorrect, points } = evaluateAnswer(question, answer);

    submission.answers.push({
      question: questionId,
      answer,
      isCorrect,
      points,
      timeSpent,
      submittedAt: new Date()
    });

    // Update current difficulty based on performance
    const recentAnswers = submission.answers.slice(-3);
    if (recentAnswers.length >= 3) {
      const performance = recentAnswers.filter(a => a.isCorrect).length / recentAnswers.length;
      submission.currentDifficulty = calculateDifficultyAdjustment(performance, submission.currentDifficulty);
    }

    await candidate.save();

    res.status(200).json({
      status: 'success',
      message: 'Answer submitted successfully',
      data: {
        isCorrect,
        points,
        currentDifficulty: submission.currentDifficulty
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Finish an assessment
 */
exports.finishAssessment = async (req, res, next) => {
  try {
    const { candidateId, submissionId } = req.params;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return next(new AppError('Candidate not found', 404));
    }

    const submission = candidate.assessmentSubmissions.id(submissionId);
    if (!submission) {
      return next(new AppError('Submission not found', 404));
    }

    submission.status = 'completed';
    submission.endTime = new Date();

    // Calculate total score
    const totalPoints = submission.answers.reduce((sum, answer) => sum + answer.points, 0);
    const assessment = await Assessment.findById(submission.assessment);
    
    // Calculate max possible score
    let maxScore = 0;
    assessment.questions.forEach(q => maxScore += q.points);
    assessment.scenarios.forEach(s => s.questions.forEach(q => maxScore += q.points));
    
    submission.score = totalPoints;
    submission.maxScore = maxScore;
    
    // Calculate percentile (placeholder logic)
    submission.percentile = Math.floor(Math.random() * 100); // This would be replaced with actual percentile calculation
    
    await candidate.save();

    res.status(200).json({
      status: 'success',
      message: 'Assessment completed successfully',
      data: {
        score: submission.score,
        maxScore: submission.maxScore,
        percentile: submission.percentile
      }
    });
  } catch (error) {
    next(error);
  }
};