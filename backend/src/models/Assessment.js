const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['multiple_choice', 'coding', 'behavioral', 'scenario'],
    required: true
  },
  options: [{ type: String }], // For multiple choice questions
  correctAnswer: { type: mongoose.Schema.Types.Mixed }, // Can be string, array, or object depending on question type
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: { type: Number, default: 1 },
  timeLimit: { type: Number }, // in seconds
  tags: [{ type: String }],
  codeTemplate: { type: String }, // For coding questions
  testCases: [{
    input: { type: String },
    expectedOutput: { type: String }
  }]
});

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questions: [questionSchema],
  timeLimit: { type: Number }, // in seconds
  tags: [{ type: String }]
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'communication', 'mixed'],
    required: true
  },
  questions: [questionSchema],
  scenarios: [scenarioSchema],
  timeLimit: { type: Number }, // in seconds, total time for the assessment
  passingScore: { type: Number, default: 70 }, // percentage
  isAdaptive: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  active: { type: Boolean, default: true },
  tags: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);