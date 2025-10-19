import mongoose from 'mongoose';

const interviewReportSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true
  },
  studentUSN: {
    type: String,
    required: true,
    uppercase: true
  },
  studentName: {
    type: String,
    required: true
  },
  category: String,
  domain: String,
  role: String,
  
  // Scores
  scores: {
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    communication: {
      type: Number,
      min: 0,
      max: 100
    },
    technical: {
      type: Number,
      min: 0,
      max: 100
    },
    problemSolving: {
      type: Number,
      min: 0,
      max: 100
    },
    overall: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Detailed Analysis
  analysis: {
    strengths: [String],
    improvements: [String],
    bodyLanguage: String,
    eyeContact: String,
    clarity: String,
    pace: String,
    vocabulary: String
  },
  
  // Question-wise feedback
  questionFeedback: [{
    question: String,
    answer: String,
    score: Number,
    feedback: String,
    category: {
      type: String,
      enum: ['personal', 'technical', 'coding']
    }
  }],
  
  // AI Feedback
  aiFeedback: {
    summary: String,
    detailedFeedback: String,
    recommendations: [String],
    suggestedCourses: [{
      title: String,
      reason: String,
      courseId: mongoose.Schema.Types.ObjectId
    }]
  },
  
  // Teacher's Manual Remarks
  teacherRemarks: {
    comment: String,
    remarksBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    remarksAt: Date
  },
  
  // Duration and timing
  duration: Number, // in seconds
  completedAt: {
    type: Date,
    default: Date.now
  },
  
  // Report status
  isViewed: {
    type: Boolean,
    default: false
  },
  viewedAt: Date,
  
  pdfReportUrl: String
}, {
  timestamps: true
});

// Indexes
interviewReportSchema.index({ studentUSN: 1, createdAt: -1 });
interviewReportSchema.index({ 'scores.overall': -1 });
interviewReportSchema.index({ sessionId: 1 });

const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);

export default InterviewReport;
