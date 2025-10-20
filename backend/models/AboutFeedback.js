import mongoose from 'mongoose';

const aboutFeedbackSchema = new mongoose.Schema({
  // User information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel'
  },
  
  userModel: {
    type: String,
    enum: ['Student', 'Teacher', 'Parent']
  },
  
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent', 'guest'],
    required: true
  },
  
  // Contact information (for guests)
  name: {
    type: String,
    required: true
  },
  
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  // Feedback type
  feedbackType: {
    type: String,
    enum: ['suggestion', 'question', 'bug_report', 'feature_request', 'other'],
    required: true
  },
  
  // Feedback content
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'in_review', 'responded', 'resolved', 'closed'],
    default: 'new',
    index: true
  },
  
  // Admin response
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    respondedAt: Date
  },
  
  // Priority (for admins)
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
aboutFeedbackSchema.index({ status: 1, priority: -1, createdAt: -1 });
aboutFeedbackSchema.index({ email: 1, createdAt: -1 });
aboutFeedbackSchema.index({ feedbackType: 1, status: 1 });

// Static methods

// Get feedback statistics
aboutFeedbackSchema.statics.getFeedbackStats = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        byType: [
          { $group: { _id: '$feedbackType', count: { $sum: 1 } } }
        ],
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        total: [
          { $count: 'total' }
        ]
      }
    }
  ]);
  
  return {
    byStatus: stats[0].byStatus,
    byType: stats[0].byType,
    byPriority: stats[0].byPriority,
    total: stats[0].total[0]?.total || 0
  };
};

// Get pending feedback (new or in_review)
aboutFeedbackSchema.statics.getPendingFeedback = async function(limit = 50) {
  return this.find({
    status: { $in: ['new', 'in_review'] }
  })
  .sort({ priority: -1, createdAt: -1 })
  .limit(limit);
};

// Get user's feedback history
aboutFeedbackSchema.statics.getUserFeedback = async function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Update status
aboutFeedbackSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  this.updatedAt = new Date();
  return this.save();
};

// Add admin response
aboutFeedbackSchema.methods.addResponse = async function(responseMessage, adminId) {
  this.adminResponse = {
    message: responseMessage,
    respondedBy: adminId,
    respondedAt: new Date()
  };
  this.status = 'responded';
  this.updatedAt = new Date();
  return this.save();
};

export default mongoose.model('AboutFeedback', aboutFeedbackSchema);
