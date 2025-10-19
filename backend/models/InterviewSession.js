import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  studentUSN: {
    type: String,
    required: true,
    uppercase: true
  },
  studentName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Cognizant', 'Other']
  },
  domain: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'Data Science', 'DevOps', 'Mobile Development', 'Other']
  },
  role: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  questions: {
    personal: [{
      question: String,
      answer: String,
      timestamp: Date
    }],
    technical: [{
      question: String,
      answer: String,
      timestamp: Date
    }],
    coding: [{
      question: String,
      answer: String,
      code: String,
      timestamp: Date
    }]
  },
  videoRecordingUrl: String,
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 12
  }
}, {
  timestamps: true
});

// Index for faster queries
interviewSessionSchema.index({ studentUSN: 1, createdAt: -1 });
interviewSessionSchema.index({ status: 1 });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;
