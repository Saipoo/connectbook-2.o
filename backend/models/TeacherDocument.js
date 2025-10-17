import mongoose from 'mongoose';

const teacherDocumentSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentSubmission',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  questionPaperUrl: {
    type: String,
    required: true
  },
  answerKeyUrl: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
teacherDocumentSchema.index({ submissionId: 1 });
teacherDocumentSchema.index({ teacherId: 1, subject: 1 });

export default mongoose.model('TeacherDocument', teacherDocumentSchema);
