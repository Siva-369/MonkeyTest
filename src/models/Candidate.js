const mongoose = require('mongoose');

const evaluationResultSchema = new mongoose.Schema({
  category: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String },
  strengths: [{ type: String }],
  areasForImprovement: [{ type: String }]
});

const assessmentSubmissionSchema = new mongoose.Schema({
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: {
    type: String,
    required: true,
    enum: ['in_progress', 'completed', 'expired'],
    default: 'in_progress'
  },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, required: true },
    response: { type: mongoose.Schema.Types.Mixed, required: true },
    timeSpent: { type: Number }, // in seconds
    isCorrect: { type: Boolean },
    points: { type: Number }
  }],
  currentDifficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  totalScore: { type: Number },
  percentile: { type: Number },
  evaluationResults: [evaluationResultSchema]
}, {
  timestamps: true
});

const candidateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  experience: { type: Number }, // in years
  education: [{
    degree: { type: String },
    institution: { type: String },
    graduationYear: { type: Number }
  }],
  skills: [{ type: String }],
  preferredRole: { type: String },
  assessmentSubmissions: [assessmentSubmissionSchema],
  overallPerformance: {
    averageScore: { type: Number },
    completedAssessments: { type: Number, default: 0 },
    skillProficiency: Map,
    lastAssessmentDate: { type: Date }
  }
}, {
  timestamps: true
});

// Pre-save middleware to update overallPerformance
candidateSchema.pre('save', function(next) {
  if (this.assessmentSubmissions.length > 0) {
    const completedSubmissions = this.assessmentSubmissions.filter(s => s.status === 'completed');
    this.overallPerformance.completedAssessments = completedSubmissions.length;
    
    if (completedSubmissions.length > 0) {
      this.overallPerformance.averageScore = completedSubmissions.reduce((acc, sub) => acc + (sub.totalScore || 0), 0) / completedSubmissions.length;
      this.overallPerformance.lastAssessmentDate = completedSubmissions[completedSubmissions.length - 1].endTime;
    }
  }
  next();
});

module.exports = mongoose.model('Candidate', candidateSchema);