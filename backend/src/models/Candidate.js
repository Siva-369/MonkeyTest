const mongoose = require('mongoose');

const assessmentSubmissionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'expired'],
    default: 'not_started'
  },
  currentDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId },
    answer: { type: mongoose.Schema.Types.Mixed },
    isCorrect: { type: Boolean },
    points: { type: Number, default: 0 },
    timeSpent: { type: Number }, // in seconds
    submittedAt: { type: Date, default: Date.now }
  }],
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  percentile: { type: Number },
  feedback: { type: String }
}, {
  timestamps: true
});

const candidateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{ type: String }],
  experience: { type: Number }, // in years
  education: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: Number }
  }],
  assessmentSubmissions: [assessmentSubmissionSchema],
  profile: {
    bio: { type: String },
    location: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);