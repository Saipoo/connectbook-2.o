import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentSubmission',
    required: true,
    unique: true
  },
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
  aiMarks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  marksPerQuestion: [{
    questionNumber: Number,
    marksObtained: Number,
    maxMarks: Number,
    feedback: String,
    highlights: [String]
  }],
  overallFeedback: {
    type: String,
    required: true
  },
  highlights: [{
    type: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  gradedDate: {
    type: Date,
    default: Date.now
  },
  verificationDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
gradeSchema.pre('save', function(next) {
  if (this.totalMarks > 0) {
    this.percentage = ((this.aiMarks / this.totalMarks) * 100).toFixed(2);
  }
  next();
});

// Index for faster queries
gradeSchema.index({ studentUSN: 1, subject: 1 });
gradeSchema.index({ verified: 1 });

export default mongoose.model('Grade', gradeSchema);
