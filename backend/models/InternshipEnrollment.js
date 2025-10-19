import mongoose from 'mongoose';

const InternshipEnrollmentSchema = new mongoose.Schema({
  studentUSN: {
    type: String,
    required: true,
    uppercase: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'in-progress', 'completed', 'cancelled'],
    default: 'enrolled'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  progress: {
    type: Number, // Percentage (0-100)
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number, // Average of all task scores
    default: 0
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InternshipCertificate'
  }
}, {
  timestamps: true
});

// Compound index for unique enrollment
InternshipEnrollmentSchema.index({ studentUSN: 1, internshipId: 1 }, { unique: true });
InternshipEnrollmentSchema.index({ status: 1 });
InternshipEnrollmentSchema.index({ studentUSN: 1 });

const InternshipEnrollment = mongoose.model('InternshipEnrollment', InternshipEnrollmentSchema);

export default InternshipEnrollment;
