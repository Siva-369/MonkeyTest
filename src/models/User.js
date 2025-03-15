const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'assessor', 'candidate'], default: 'candidate' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  active: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);