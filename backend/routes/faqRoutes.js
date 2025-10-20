import express from 'express';
import { protect } from '../middleware/auth.js';
import FAQService from '../services/faqService.js';
import FAQ from '../models/FAQ.js';
import FAQFeedback from '../models/FAQFeedback.js';

const router = express.Router();

/**
 * @route   GET /api/faq/dummy
 * @desc    Get all dummy FAQs (for testing)
 * @access  Private
 */
router.get('/dummy', protect, async (req, res) => {
  try {
    const dummyFAQs = FAQService.getDummyFAQs();
    const role = req.user.role;
    
    // Filter by role
    const filteredDummy = dummyFAQs.filter(faq => 
      faq.role === role || faq.role === 'all'
    );
    
    res.json({
      success: true,
      data: {
        faqs: filteredDummy,
        count: filteredDummy.length,
        totalDummy: dummyFAQs.length,
        role
      }
    });
  } catch (error) {
    console.error('Error fetching dummy FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dummy FAQs',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/faq/categories
 * @desc    Get FAQ categories for the user's role
 * @access  Private
 */
router.get('/categories', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const categories = FAQService.getFAQCategories(role);
    
    // Get dummy FAQs
    const dummyFAQs = FAQService.getDummyFAQs();
    
    // Get count of FAQs per category (database + dummy)
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        // Count database FAQs
        const dbCount = await FAQ.countDocuments({
          role: { $in: [role, 'all'] },
          category,
          isActive: true
        });
        
        // Count dummy FAQs
        const dummyCount = dummyFAQs.filter(faq => 
          (faq.role === role || faq.role === 'all') && 
          faq.category === category
        ).length;
        
        return { name: category, count: dbCount + dummyCount };
      })
    );
    
    res.json({
      success: true,
      data: {
        categories: categoriesWithCount,
        role
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ categories',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/faq
 * @desc    Get all FAQs for user's role, optionally filtered by category
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const { category } = req.query;
    
    console.log('🌐 GET /api/faq - Role:', role, 'Category:', category || 'all');
    
    const faqs = await FAQService.getFAQsByRole(role, category);
    
    console.log('📤 Sending response - FAQ count:', faqs.length);
    
    res.json({
      success: true,
      data: {
        faqs,
        count: faqs.length,
        role,
        category: category || 'all'
      }
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/faq/search
 * @desc    Search FAQs
 * @access  Private
 */
router.get('/search', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const faqs = await FAQService.searchFAQs(q, role);
    
    res.json({
      success: true,
      data: {
        faqs,
        count: faqs.length,
        query: q,
        role
      }
    });
  } catch (error) {
    console.error('Error searching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search FAQs',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/faq/most-helpful
 * @desc    Get most helpful FAQs
 * @access  Private
 */
router.get('/most-helpful', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const limit = parseInt(req.query.limit) || 5;
    
    const faqs = await FAQService.getMostHelpfulFAQs(role, limit);
    
    res.json({
      success: true,
      data: {
        faqs,
        count: faqs.length,
        role
      }
    });
  } catch (error) {
    console.error('Error fetching most helpful FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch most helpful FAQs',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/faq/:id
 * @desc    Get a single FAQ by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQService.getFAQById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    // Get feedback stats
    const feedbackStats = await FAQService.getFeedbackStats(req.params.id);
    
    res.json({
      success: true,
      data: {
        faq,
        feedbackStats
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/faq/:id/feedback
 * @desc    Submit feedback for an FAQ
 * @access  Private
 */
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const { wasHelpful, comment, suggestedQuestion, suggestedAnswer } = req.body;
    
    if (typeof wasHelpful !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'wasHelpful field is required and must be a boolean'
      });
    }
    
    const feedback = await FAQService.recordFeedback(
      req.params.id,
      req.user._id,
      req.user.role === 'student' ? 'Student' : req.user.role === 'teacher' ? 'Teacher' : 'Parent',
      req.user.role,
      wasHelpful,
      { comment, suggestedQuestion, suggestedAnswer }
    );
    
    res.json({
      success: true,
      message: 'Feedback recorded successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/faq
 * @desc    Create a new FAQ (admin/teacher only)
 * @access  Private (Teacher/Admin)
 */
router.post('/', protect, async (req, res) => {
  try {
    // Check if user is teacher or admin
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers and admins can create FAQs'
      });
    }
    
    const { question, role, category, useAI, ...otherData } = req.body;
    
    if (!question || !role || !category) {
      return res.status(400).json({
        success: false,
        message: 'Question, role, and category are required'
      });
    }
    
    const faqData = {
      question,
      role,
      category,
      ...otherData
    };
    
    const faq = await FAQService.createFAQ(faqData, useAI);
    
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: { faq }
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/faq/:id
 * @desc    Update an FAQ (admin/teacher only)
 * @access  Private (Teacher/Admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is teacher or admin
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers and admins can update FAQs'
      });
    }
    
    const faq = await FAQService.updateFAQ(req.params.id, req.body);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: { faq }
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/faq/:id
 * @desc    Delete an FAQ (admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete FAQs'
      });
    }
    
    const faq = await FAQService.deleteFAQ(req.params.id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      message: 'FAQ deleted successfully',
      data: { faq }
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/faq/ai-update
 * @desc    Trigger AI update for FAQs needing improvement (admin only)
 * @access  Private (Admin)
 */
router.post('/ai-update', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can trigger AI updates'
      });
    }
    
    const result = await FAQService.updateFAQsWithAI();
    
    res.json({
      success: true,
      message: `Successfully updated ${result.updated} FAQs with AI`,
      data: result
    });
  } catch (error) {
    console.error('Error updating FAQs with AI:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQs with AI',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/faq/feedback/my-history
 * @desc    Get user's feedback history
 * @access  Private
 */
router.get('/feedback/my-history', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await FAQFeedback.getUserFeedbackHistory(req.user._id, limit);
    
    res.json({
      success: true,
      data: {
        history,
        count: history.length
      }
    });
  } catch (error) {
    console.error('Error fetching feedback history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback history',
      error: error.message
    });
  }
});

export default router;
