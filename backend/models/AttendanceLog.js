import mongoose from 'mongoose';

const attendanceLogSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: [true, 'USN is required'],
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    enum: ['Face Recognition', 'Manual'],
    default: 'Face Recognition'
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Present', 'Absent'],
    default: 'Present'
  },
  department: {
    type: String,
    trim: true
  },
  class: {
    type: String,
    trim: true
  },
  section: {
    type: String,
    trim: true,
    uppercase: true
  },
  markedBy: {
    type: String,
    default: 'Student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
attendanceLogSchema.index({ usn: 1, date: -1 });
attendanceLogSchema.index({ subject: 1, date: -1 });

export default mongoose.model('AttendanceLog', attendanceLogSchema);
