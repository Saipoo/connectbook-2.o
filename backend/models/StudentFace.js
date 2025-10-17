import mongoose from 'mongoose';

const studentFaceSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: [true, 'USN is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  embeddings: {
    type: [[Number]],
    required: [true, 'Face embeddings are required']
  },
  encryptedEmbeddings: {
    type: String,
    required: false
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
studentFaceSchema.index({ usn: 1 });

export default mongoose.model('StudentFace', studentFaceSchema);
