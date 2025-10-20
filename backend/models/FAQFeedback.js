import mongoose from 'mongoose';

const faqFeedbackSchema = new mongoose.Schema({
  // Reference to FAQ
  faqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FAQ',
    required: true,
    index: true
  },
  
  // User information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: true
  },
  
  userModel: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher', 'Parent']
  },
  
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent'],
    required: true
  },
  
  // Feedback data
  wasHelpful: {
    type: Boolean,
    required: true
  },
  
  // Optional additional feedback
  comment: {
    type: String,
    maxlength: 500
  },
  
  // Suggested improvements
  suggestedQuestion: String,
  suggestedAnswer: String,
  
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Indexes
faqFeedbackSchema.index({ faqId: 1, userId: 1 });
faqFeedbackSchema.index({ wasHelpful: 1, createdAt: -1 });

// Static methods

// Get feedback statistics for an FAQ
faqFeedbackSchema.statics.getFeedbackStats = async function(faqId) {
  const stats = await this.aggregate([
    { $match: { faqId: mongoose.Types.ObjectId(faqId) } },
    {
      $group: {
        _id: '$wasHelpful',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    helpful: 0,
    notHelpful: 0,
    total: 0
  };
  
  stats.forEach(stat => {
    if (stat._id) {
      result.helpful = stat.count;
    } else {
      result.notHelpful = stat.count;
    }
    result.total += stat.count;
  });
  
  result.helpfulPercentage = result.total > 0 
    ? ((result.helpful / result.total) * 100).toFixed(1)
    : 0;
  
  return result;
};

// Get user feedback history
faqFeedbackSchema.statics.getUserFeedbackHistory = async function(userId, limit = 20) {
  return this.find({ userId })
    .populate('faqId', 'question category role')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get FAQs needing improvement (low helpful rate)
faqFeedbackSchema.statics.getFAQsNeedingImprovement = async function(threshold = 50) {
  const feedbackStats = await this.aggregate([
    {
      $group: {
        _id: '$faqId',
        helpful: { $sum: { $cond: ['$wasHelpful', 1, 0] } },
        total: { $sum: 1 }
      }
    },
    {
      $addFields: {
        helpfulPercentage: {
          $multiply: [{ $divide: ['$helpful', '$total'] }, 100]
        }
      }
    },
    {
      $match: {
        total: { $gte: 5 }, // At least 5 responses
        helpfulPercentage: { $lt: threshold }
      }
    },
    {
      $sort: { helpfulPercentage: 1 }
    }
  ]);
  
  return feedbackStats;
};

export default mongoose.model('FAQFeedback', faqFeedbackSchema);
