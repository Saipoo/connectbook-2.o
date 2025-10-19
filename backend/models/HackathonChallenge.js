import mongoose from 'mongoose';

const HackathonChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  theme: {
    type: String,
    required: true
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
      'Blockchain',
      'IoT',
      'Cybersecurity',
      'Game Development',
      'AR/VR',
      'Other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  type: {
    type: String,
    enum: ['individual', 'team'],
    default: 'team'
  },
  maxTeamSize: {
    type: Number,
    default: 5,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'evaluation', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  rules: [{
    type: String
  }],
  evaluationCriteria: [{
    criteria: String,
    weightage: Number // percentage
  }],
  deliverables: [{
    type: String
  }],
  prizes: [{
    rank: Number,
    title: String,
    description: String
  }],
  totalParticipants: {
    type: Number,
    default: 0
  },
  totalTeams: {
    type: Number,
    default: 0
  },
  websiteUrl: {
    type: String, // Official hackathon website
    default: ''
  },
  registerUrl: {
    type: String, // Registration page link
    default: ''
  },
  rulesUrl: {
    type: String, // Rules and guidelines link
    default: ''
  },
  organizer: {
    type: String, // Organizing company/institution
    default: ''
  },
  venue: {
    type: String, // Physical venue or "Online"
    default: ''
  },
  eventType: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online'
  },
  totalPrize: {
    type: String, // Total prize pool (e.g., "₹10,00,000")
    default: ''
  },
  createdBy: {
    type: String, // Admin email
    default: 'system'
  },
  bannerUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
HackathonChallengeSchema.index({ status: 1 });
HackathonChallengeSchema.index({ domain: 1 });
HackathonChallengeSchema.index({ startDate: 1, endDate: 1 });

const HackathonChallenge = mongoose.model('HackathonChallenge', HackathonChallengeSchema);

export default HackathonChallenge;
