import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  // Role-based access control
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent', 'all'],
    required: true,
    index: true
  },
  
  // Category for organization
  category: {
    type: String,
    required: true,
    index: true
  },
  
  // Question and answer
  question: {
    type: String,
    required: true,
    index: 'text' // Enable text search
  },
  
  shortAnswer: {
    type: String,
    required: true
  },
  
  longAnswer: {
    type: String,
    required: true
  },
  
  // Related features for navigation
  relatedFeatures: [{
    name: String,
    route: String
  }],
  
  // Search keywords for better discovery
  keywords: [String],
  
  // Ordering and visibility
  order: {
    type: Number,
    default: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Feedback tracking
  helpfulCount: {
    type: Number,
    default: 0
  },
  
  notHelpfulCount: {
    type: Number,
    default: 0
  },
  
  // AI-powered updates
  lastAIUpdate: {
    type: Date
  },
  
  aiGenerated: {
    type: Boolean,
    default: false
  },
  
  // View tracking
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
faqSchema.index({ role: 1, category: 1, order: 1 });
faqSchema.index({ isActive: 1, createdAt: -1 });
faqSchema.index({ helpfulCount: -1 }); // Most helpful FAQs

// Text search index
faqSchema.index({ 
  question: 'text', 
  shortAnswer: 'text', 
  keywords: 'text' 
});

// Static methods

// Get FAQs by role and category
faqSchema.statics.getByRoleAndCategory = async function(role, category = null) {
  const query = {
    role: { $in: [role, 'all'] },
    isActive: true
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query).sort({ order: 1, helpfulCount: -1 });
};

// Search FAQs
faqSchema.statics.searchFAQs = async function(searchQuery, role) {
  return this.find({
    $text: { $search: searchQuery },
    role: { $in: [role, 'all'] },
    isActive: true
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

// Get categories for a role
faqSchema.statics.getCategoriesByRole = async function(role) {
  return this.distinct('category', {
    role: { $in: [role, 'all'] },
    isActive: true
  });
};

// Get most helpful FAQs
faqSchema.statics.getMostHelpful = async function(role, limit = 5) {
  return this.find({
    role: { $in: [role, 'all'] },
    isActive: true,
    helpfulCount: { $gt: 0 }
  })
  .sort({ helpfulCount: -1 })
  .limit(limit);
};

// Update helpful counts
faqSchema.methods.recordFeedback = async function(isHelpful) {
  if (isHelpful) {
    this.helpfulCount += 1;
  } else {
    this.notHelpfulCount += 1;
  }
  this.updatedAt = new Date();
  return this.save();
};

// Increment view count
faqSchema.methods.incrementViews = async function() {
  this.viewCount += 1;
  return this.save();
};

export default mongoose.model('FAQ', faqSchema);
