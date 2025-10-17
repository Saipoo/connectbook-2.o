import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  subjects: {
    type: [String],
    required: [true, 'At least one subject is required']
  },
  role: {
    type: String,
    default: 'teacher',
    enum: ['teacher']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Teacher', teacherSchema);
