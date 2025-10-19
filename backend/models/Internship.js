import mongoose from 'mongoose';

const InternshipSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String, // Company logo URL
    default: ''
  },
  domain: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Artificial Intelligence',
      'Cloud Computing',
      'DevOps',
      'Cybersecurity',
      'Blockchain',
      'UI/UX Design',
      'Backend Development',
      'Frontend Development',
      'Full Stack Development',
      'Other'
    ]
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, // Duration in weeks
    required: true,
    min: 1,
    max: 12
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  description: {
    type: String,
    required: true
  },
  learningObjectives: [{
    type: String
  }],
  prerequisites: [{
    type: String
  }],
  tasksCount: {
    type: Number,
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  websiteUrl: {
    type: String, // Company career page or program page
    default: ''
  },
  applyUrl: {
    type: String, // Direct application link
    default: ''
  },
  stipend: {
    type: String, // e.g., "₹80,000 - ₹1,00,000 per month"
    default: ''
  },
  location: {
    type: String, // e.g., "Bangalore / Remote"
    default: ''
  },
  deadline: {
    type: Date // Application deadline
  },
  createdBy: {
    type: String, // Admin/Teacher email
    default: 'system'
  }
}, {
  timestamps: true
});

// Index for faster queries
InternshipSchema.index({ company: 1, domain: 1 });
InternshipSchema.index({ skillLevel: 1 });
InternshipSchema.index({ isActive: 1 });

const Internship = mongoose.model('Internship', InternshipSchema);

export default Internship;
