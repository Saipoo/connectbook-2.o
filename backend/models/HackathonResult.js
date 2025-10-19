import mongoose from 'mongoose';

const HackathonResultSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HackathonChallenge',
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HackathonTeam',
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  members: [{
    usn: String,
    name: String,
    email: String
  }],
  finalScore: {
    type: Number,
    required: true
  },
  rank: {
    type: Number
  },
  scores: {
    codeQuality: Number,
    creativity: Number,
    functionality: Number,
    uiux: Number,
    collaboration: Number
  },
  feedback: {
    type: String
  },
  strengths: [String],
  improvements: [String],
  certificatesGenerated: {
    type: Boolean,
    default: false
  },
  certificates: [{
    usn: String,
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    }
  }],
  submittedAt: {
    type: Date
  },
  evaluatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
HackathonResultSchema.index({ hackathonId: 1, rank: 1 });
HackathonResultSchema.index({ teamId: 1 });
HackathonResultSchema.index({ 'members.usn': 1 });

const HackathonResult = mongoose.model('HackathonResult', HackathonResultSchema);

export default HackathonResult;
