import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
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
  linkedStudentUSN: {
    type: String,
    required: [true, 'Linked Student USN is required'],
    uppercase: true,
    trim: true
  },
  role: {
    type: String,
    default: 'parent',
    enum: ['parent']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Parent', parentSchema);
