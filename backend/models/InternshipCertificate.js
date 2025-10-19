import mongoose from 'mongoose';

const InternshipCertificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
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
  duration: {
    type: Number, // in weeks
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  overallScore: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'],
    required: true
  },
  skills: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
  pdfUrl: {
    type: String,
    default: ''
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
InternshipCertificateSchema.index({ studentUSN: 1 });
InternshipCertificateSchema.index({ certificateId: 1 });
InternshipCertificateSchema.index({ verificationCode: 1 });

const InternshipCertificate = mongoose.model('InternshipCertificate', InternshipCertificateSchema);

export default InternshipCertificate;
