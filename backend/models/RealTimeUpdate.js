import mongoose from 'mongoose';

const realTimeUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true
  },
  detailedContent: {
    type: String // Extended AI-generated description
  },
  category: {
    type: String,
    required: true,
    enum: [
      'education',
      'ai-tech',
      'jobs-internships',
      'motivation',
      'startups-ceos',
      'general-knowledge',
      'all'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  sourceLink: {
    type: String,
    default: ''
  },
  sourceName: {
    type: String,
    default: 'ConnectBook AI'
  },
  aiGenerated: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date // Optional: auto-delete old updates
  },
  
  // Engagement metrics
  viewCount: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    userId: String,
    viewedAt: Date
  }],
  
  // Personalization
  targetCourses: [String], // e.g., ['Data Science', 'AI/ML']
  targetInterests: [String], // e.g., ['Artificial Intelligence', 'Startups']
  priority: {
    type: Number,
    default: 0 // Higher priority shows first
  },
  
  // AI Enhancement
  keyPoints: [String],
  whyItMatters: String,
  relatedResources: [{
    title: String,
    url: String,
    type: String // 'video', 'article', 'course', 'tool'
  }],
  
  // Manual/Admin posts
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null
  },
  isInstitutionalAnnouncement: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  fetchedFrom: String, // API source if applicable
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
realTimeUpdateSchema.index({ category: 1, postedAt: -1 });
realTimeUpdateSchema.index({ isActive: 1, postedAt: -1 });
realTimeUpdateSchema.index({ aiGenerated: 1 });
realTimeUpdateSchema.index({ targetCourses: 1 });
realTimeUpdateSchema.index({ priority: -1, postedAt: -1 });

// Virtual for age of update
realTimeUpdateSchema.virtual('age').get(function() {
  const now = new Date();
  const diff = now - this.postedAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return this.postedAt.toLocaleDateString();
});

// Method to increment view count
realTimeUpdateSchema.methods.recordView = async function(userId) {
  if (!this.viewedBy.find(v => v.userId === userId)) {
    this.viewCount += 1;
    this.viewedBy.push({
      userId,
      viewedAt: new Date()
    });
    await this.save();
  }
};

// Static method to get trending updates
realTimeUpdateSchema.statics.getTrending = async function(limit = 5) {
  return this.find({ isActive: true })
    .sort({ priority: -1, viewCount: -1, postedAt: -1 })
    .limit(limit);
};

// Static method to clean old updates
realTimeUpdateSchema.statics.cleanOldUpdates = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    postedAt: { $lt: cutoffDate },
    isInstitutionalAnnouncement: false // Keep institutional announcements
  });
};

const RealTimeUpdate = mongoose.model('RealTimeUpdate', realTimeUpdateSchema);

export default RealTimeUpdate;
