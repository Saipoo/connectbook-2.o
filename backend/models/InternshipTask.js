import mongoose from 'mongoose';

const InternshipTaskSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InternshipEnrollment',
    required: true
  },
  studentUSN: {
    type: String,
    required: true,
    uppercase: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  taskNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  taskType: {
    type: String,
    enum: ['research', 'design', 'implementation', 'debugging', 'presentation', 'report'],
    required: true
  },
  requirements: [{
    type: String
  }],
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'submitted', 'evaluated', 'resubmit'],
    default: 'assigned'
  },
  submission: {
    submittedAt: Date,
    files: [{
      filename: String,
      fileUrl: String,
      fileType: String
    }],
    codeUrl: String, // GitHub/external link
    description: String,
    notes: String
  },
  evaluation: {
    evaluatedAt: Date,
    evaluatedBy: {
      type: String,
      default: 'AI' // 'AI' or teacher email
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    breakdown: {
      accuracy: Number,
      creativity: Number,
      communication: Number,
      deadline: Number
    },
    feedback: String,
    suggestions: [String],
    suggestedCourses: [{
      title: String,
      reason: String
    }],
    strengths: [String],
    improvements: [String]
  },
  aiHelpRequested: {
    type: Number,
    default: 0
  },
  aiConversations: [{
    timestamp: Date,
    question: String,
    response: String
  }]
}, {
  timestamps: true
});

// Indexes for performance
InternshipTaskSchema.index({ enrollmentId: 1, taskNumber: 1 });
InternshipTaskSchema.index({ studentUSN: 1 });
InternshipTaskSchema.index({ status: 1 });

const InternshipTask = mongoose.model('InternshipTask', InternshipTaskSchema);

export default InternshipTask;
