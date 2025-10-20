import express from 'express';
import ChatbotInteraction from '../models/ChatbotInteraction.js';
import ChatbotService from '../services/chatbotService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/chatbot/query
 * @desc    Send query to AI chatbot
 * @access  Private
 */
router.post('/query', protect, async (req, res) => {
  try {
    const { query, sessionId } = req.body;
    const userId = req.user._id;
    const role = req.user.role;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Generate AI response
    const aiResult = await ChatbotService.generateResponse(query, role, {
      userId,
      sessionId
    });

    // Save interaction to database
    const interaction = await ChatbotInteraction.create({
      userId,
      role,
      query: query.trim(),
      aiResponse: aiResult.response,
      actionTaken: aiResult.actionType,
      navigationTarget: aiResult.navigationTarget,
      sessionId: sessionId || null
    });

    res.json({
      success: true,
      data: {
        response: aiResult.response,
        actionType: aiResult.actionType,
        navigationTarget: aiResult.navigationTarget,
        featureName: aiResult.featureName,
        menuOptions: aiResult.menuOptions,
        externalLink: aiResult.externalLink,
        interactionId: interaction._id,
        timestamp: interaction.timestamp
      }
    });

  } catch (error) {
    console.error('Chatbot query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/chatbot/greeting
 * @desc    Get personalized greeting message
 * @access  Private
 */
router.get('/greeting', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const userName = req.user.name;

    const greeting = ChatbotService.getGreeting(role, userName);

    res.json({
      success: true,
      data: {
        greeting,
        role,
        userName
      }
    });

  } catch (error) {
    console.error('Chatbot greeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get greeting',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/chatbot/menu
 * @desc    Get menu options based on user role
 * @access  Private
 */
router.get('/menu', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const menuOptions = ChatbotService.getMenuOptions(role);

    res.json({
      success: true,
      data: {
        menuOptions,
        role
      }
    });

  } catch (error) {
    console.error('Chatbot menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get menu',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/chatbot/history
 * @desc    Get user's chat history
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;

    const history = await ChatbotInteraction.getUserHistory(userId, limit);

    res.json({
      success: true,
      data: {
        history,
        count: history.length
      }
    });

  } catch (error) {
    console.error('Chatbot history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get history',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/chatbot/feedback
 * @desc    Submit feedback for a chat interaction
 * @access  Private
 */
router.post('/feedback', protect, async (req, res) => {
  try {
    const { interactionId, helpful, rating } = req.body;

    if (!interactionId) {
      return res.status(400).json({
        success: false,
        message: 'Interaction ID is required'
      });
    }

    const interaction = await ChatbotInteraction.findById(interactionId);

    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Interaction not found'
      });
    }

    // Verify ownership
    if (interaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    interaction.feedback = {
      helpful: helpful !== undefined ? helpful : interaction.feedback?.helpful,
      rating: rating || interaction.feedback?.rating
    };

    await interaction.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        feedback: interaction.feedback
      }
    });

  } catch (error) {
    console.error('Chatbot feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/chatbot/analytics
 * @desc    Get chatbot usage analytics (admin only)
 * @access  Private/Admin
 */
router.get('/analytics', protect, async (req, res) => {
  try {
    // Check if user is admin (you can add admin role check)
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const role = req.query.role || null;
    const analytics = await ChatbotInteraction.getAnalytics(role);

    res.json({
      success: true,
      data: {
        analytics
      }
    });

  } catch (error) {
    console.error('Chatbot analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

export default router;
