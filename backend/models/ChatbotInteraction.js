import mongoose from 'mongoose';

const chatbotInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent'],
    required: true
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  actionTaken: {
    type: String,
    enum: ['navigation', 'information', 'menu', 'poornagpt', 'other'],
    default: 'information'
  },
  navigationTarget: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    default: null
  },
  feedback: {
    helpful: {
      type: Boolean,
      default: null
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
chatbotInteractionSchema.index({ userId: 1, timestamp: -1 });
chatbotInteractionSchema.index({ role: 1 });
chatbotInteractionSchema.index({ sessionId: 1 });

// Static method to get user chat history
chatbotInteractionSchema.statics.getUserHistory = async function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('query aiResponse actionTaken timestamp -_id');
};

// Static method to get analytics
chatbotInteractionSchema.statics.getAnalytics = async function(role = null) {
  const match = role ? { role } : {};
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$actionTaken',
        count: { $sum: 1 },
        avgResponseLength: { $avg: { $strLenCP: '$aiResponse' } }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const ChatbotInteraction = mongoose.model('ChatbotInteraction', chatbotInteractionSchema);

export default ChatbotInteraction;
