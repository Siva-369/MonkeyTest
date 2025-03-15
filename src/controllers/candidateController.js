const Candidate = require('../models/Candidate');
const Assessment = require('../models/Assessment');
const aiAnalysisService = require('../services/aiAnalysisService');

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

exports.startAssessment = async (req, res) => {
  try {
    const { candidateId, assessmentId } = req.params;
    
    const candidate = await Candidate.findById(candidateId);
    const assessment = await Assessment.findById(assessmentId);

    if (!candidate || !assessment) {
      return res.status(404).json({ message: 'Candidate or Assessment not found' });
    }

    const submission = {
      assessment: assessmentId,
      startTime: new Date(),
      status: 'in_progress',
      currentDifficulty: 'easy'
    };

    candidate.assessmentSubmissions.push(submission);
    await candidate.save();

    res.json({
      message: 'Assessment started successfully',
      submissionId: candidate.assessmentSubmissions[candidate.assessmentSubmissions.length - 1]._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { candidateId, submissionId } = req.params;
    const { questionId, answer, timeSpent } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const submission = candidate.assessmentSubmissions.id(submissionId);
    if (!submission || submission.status !== 'in_progress') {
      return res.status(400).json({ message: 'Invalid submission' });
    }

    const assessment = await Assessment.findById(submission.assessment);
    const question = assessment.questions.id(questionId) || 
                    assessment.scenarios.reduce((q, s) => 
                      q || s.questions.id(questionId), null);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { isCorrect, points } = evaluateAnswer(question, answer);
    
    submission.answers.push({
      question: questionId,
      response: answer,
      timeSpent,
      isCorrect,
      points
    });

    // Adjust difficulty if adaptive assessment
    if (assessment.isAdaptive) {
      const recentAnswers = submission.answers.slice(-3);
      if (recentAnswers.length >= 3) {
        const performance = recentAnswers.filter(a => a.isCorrect).length / recentAnswers.length;
        submission.currentDifficulty = calculateDifficultyAdjustment(performance, submission.currentDifficulty);
      }
    }

    await candidate.save();

    res.json({
      message: 'Answer submitted successfully',
      currentDifficulty: submission.currentDifficulty,
      isCorrect,
      points
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.finishAssessment = async (req, res) => {
  try {
    const { candidateId, submissionId } = req.params;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const submission = candidate.assessmentSubmissions.id(submissionId);
    if (!submission || submission.status !== 'in_progress') {
      return res.status(400).json({ message: 'Invalid submission' });
    }

    const assessment = await Assessment.findById(submission.assessment);

    // Calculate total score and generate evaluation results
    submission.endTime = new Date();
    submission.status = 'completed';
    submission.totalScore = submission.answers.reduce((total, answer) => total + (answer.points || 0), 0);

    // Generate evaluation results by category
    const categoryScores = {};
    submission.answers.forEach(answer => {
      const question = assessment.questions.id(answer.question) ||
                      assessment.scenarios.reduce((q, s) => 
                        q || s.questions.id(answer.question), null);
      if (question) {
        categoryScores[question.category] = categoryScores[question.category] || {
          total: 0,
          count: 0,
          points: 0
        };
        categoryScores[question.category].total += question.points;
        categoryScores[question.category].points += answer.points || 0;
        categoryScores[question.category].count++;
      }
    });

    submission.evaluationResults = Object.entries(categoryScores).map(([category, data]) => ({
      category,
      score: (data.points / data.total) * 100,
      strengths: data.points / data.total >= 0.7 ? [category] : [],
      areasForImprovement: data.points / data.total < 0.7 ? [category] : []
    }));

    await candidate.save();

    res.json({
      message: 'Assessment completed successfully',
      totalScore: submission.totalScore,
      evaluationResults: submission.evaluationResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};