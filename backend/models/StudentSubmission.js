import mongoose from 'mongoose';

const studentSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
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
  subject: {
    type: String,
    required: true
  },
  answerScriptUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Graded', 'Verified'],
    default: 'Pending'
  },
  aiMarks: {
    type: Number,
    default: null
  },
  totalMarks: {
    type: Number,
    default: null
  },
  teacherVerified: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: String,
    default: ''
  },
  highlights: [{
    type: String
  }],
  marksPerQuestion: [{
    questionNumber: Number,
    marksObtained: Number,
    maxMarks: Number,
    feedback: String
  }],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  gradedDate: {
    type: Date
  },
  verifiedDate: {
    type: Date
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }
}, {
  timestamps: true
});

// Index for faster queries
studentSubmissionSchema.index({ studentUSN: 1, subject: 1 });
studentSubmissionSchema.index({ status: 1 });

export default mongoose.model('StudentSubmission', studentSubmissionSchema);
