const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema({
  sentiment: {
    score: Number,
    comparative: Number,
    positive: [String],
    negative: [String]
  },
  communication: {
    clarity: Number,
    complexity: Number,
    coherence: Number,
    wordCount: Number,
    avgWordLength: Number
  },
  leadership: {
    score: Number,
    indicators: [String]
  },
  stress: {
    positiveCount: Number,
    negativeCount: Number,
    overallScore: Number
  }
});

const questionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String, required: true, enum: ['multiple_choice', 'coding', 'behavioral', 'scenario'] },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  options: [{ type: String }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  points: { type: Number, required: true },
  category: { type: String, required: true },
  aiAnalysis: aiAnalysisSchema
});

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  context: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  questions: [questionSchema]
});

const adaptiveRuleSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  action: { type: String, required: true },
  threshold: { type: Number, required: true }
});

const scoringCriteriaSchema = new mongoose.Schema({
  category: { type: String, required: true },
  weight: { type: Number, required: true },
  passingScore: { type: Number, required: true }
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['technical', 'behavioral', 'cognitive']
  },
  duration: { type: Number, required: true }, // in minutes
  totalPoints: { type: Number, required: true },
  passingScore: { type: Number, required: true },
  scenarios: [scenarioSchema],
  questions: [questionSchema],
  adaptiveRules: [adaptiveRuleSchema],
  scoringCriteria: [scoringCriteriaSchema],
  status: { 
    type: String, 
    required: true, 
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAdaptive: { type: Boolean, default: false },
  targetRole: { type: String, required: true },
  requiredSkills: [{ type: String }],
  difficultyLevel: { 
    type: String, 
    required: true,
    enum: ['entry', 'intermediate', 'advanced', 'expert']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);