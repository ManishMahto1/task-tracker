const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user cannot have more than 4 projects
projectSchema.pre('save', async function (next) {
  const projectCount = await mongoose.model('Project').countDocuments({ user: this.user });
  if (projectCount >= 4) {
    throw new Error('User cannot have more than 4 projects');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);