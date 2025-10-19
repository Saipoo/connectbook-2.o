import mongoose from 'mongoose';

const HackathonTeamSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HackathonChallenge',
    required: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  teamLeader: {
    usn: {
      type: String,
      required: true,
      uppercase: true
    },
    name: String,
    email: String
  },
  members: [{
    usn: {
      type: String,
      uppercase: true
    },
    name: String,
    email: String,
    role: String, // e.g., 'Frontend Dev', 'Backend Dev', 'Designer'
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalMembers: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['forming', 'registered', 'working', 'submitted', 'evaluated'],
    default: 'forming'
  },
  problemStatement: {
    title: String,
    description: String,
    requirements: [String],
    expectedDeliverables: [String],
    generatedAt: Date
  },
  project: {
    title: String,
    description: String,
    techStack: [String],
    repoUrl: String,
    demoUrl: String,
    videoUrl: String,
    documentation: String,
    files: [{
      filename: String,
      fileUrl: String,
      fileType: String
    }],
    submittedAt: Date
  },
  evaluation: {
    evaluatedAt: Date,
    evaluatedBy: {
      type: String,
      default: 'AI'
    },
    scores: {
      codeQuality: Number,
      creativity: Number,
      functionality: Number,
      uiux: Number,
      collaboration: Number,
      overall: Number
    },
    feedback: String,
    strengths: [String],
    improvements: [String],
    rank: Number,
    certificate: {
      type: Boolean,
      default: false
    }
  },
  chatMessages: [{
    sender: String, // USN
    senderName: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  progress: {
    type: Number, // Percentage
    default: 0
  },
  aiHelpRequested: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
HackathonTeamSchema.index({ hackathonId: 1 });
HackathonTeamSchema.index({ 'teamLeader.usn': 1 });
HackathonTeamSchema.index({ 'members.usn': 1 });
HackathonTeamSchema.index({ status: 1 });

const HackathonTeam = mongoose.model('HackathonTeam', HackathonTeamSchema);

export default HackathonTeam;
