import express from 'express';
import { protect } from '../middleware/auth.js';
import AboutFeedback from '../models/AboutFeedback.js';

const router = express.Router();

/**
 * Team information
 */
const teamInfo = {
  teamName: 'IDEA_CRAP',
  members: [
    {
      id: 1,
      name: 'A POORNA SESHASEYAN',
      role: 'Senior Software Developer',
      bio: 'Full-stack developer specializing in AI integration, backend architecture, and scalable systems. Lead developer for ConnectBook\'s core features including GradeMaster, CourseMaster, and AI Chatbot.',
      image: '/team/poorna.jpg',
      linkedin: 'https://linkedin.com/in/poorna-seshaseyan',
      github: 'https://github.com/poorna-seshaseyan',
      contributions: [
        'AI-powered grading system',
        'Course management platform',
        'Real-time updates with Gemini API',
        'Chatbot integration'
      ]
    },
    {
      id: 2,
      name: 'Rakshith Subramanya Ravi',
      role: 'Team Lead',
      bio: 'Project manager and technical architect overseeing ConnectBook\'s development lifecycle. Expert in agile methodologies, system design, and team coordination.',
      image: '/team/rakshith.jpg',
      linkedin: 'https://linkedin.com/in/rakshith-subramanya',
      github: 'https://github.com/rakshith-subramanya',
      contributions: [
        'Project architecture and planning',
        'Feature prioritization',
        'Team coordination',
        'Quality assurance'
      ]
    },
    {
      id: 3,
      name: 'Chinmaya S Shetty',
      role: 'Senior Data and Product Analyst',
      bio: 'Data scientist and product strategist driving ConnectBook\'s analytics, insights, and feature optimization. Expert in educational data analysis and user behavior patterns.',
      image: '/team/chinmaya.jpg',
      linkedin: 'https://linkedin.com/in/chinmaya-shetty',
      github: 'https://github.com/chinmaya-shetty',
      contributions: [
        'Analytics dashboard design',
        'Data-driven insights',
        'Product feature analysis',
        'User behavior tracking'
      ]
    },
    {
      id: 4,
      name: 'Ajay S Patil',
      role: 'Senior Software Tester',
      bio: 'Quality assurance specialist ensuring ConnectBook\'s reliability, performance, and user experience. Expert in automated testing, bug tracking, and system validation.',
      image: '/team/ajay.jpg',
      linkedin: 'https://linkedin.com/in/ajay-patil',
      github: 'https://github.com/ajay-patil',
      contributions: [
        'Comprehensive testing strategies',
        'Bug identification and tracking',
        'Performance optimization',
        'User acceptance testing'
      ]
    }
  ],
  version: '2.0.0',
  releaseDate: 'October 2025',
  technologies: [
    {
      name: 'Google Gemini AI',
      purpose: 'AI-powered grading, content generation, chatbot, and insights',
      logo: '/tech/gemini.png'
    },
    {
      name: 'MongoDB',
      purpose: 'Database for storing users, courses, grades, and analytics',
      logo: '/tech/mongodb.png'
    },
    {
      name: 'Node.js & Express',
      purpose: 'Backend server and RESTful API',
      logo: '/tech/nodejs.png'
    },
    {
      name: 'React',
      purpose: 'Frontend user interface with dynamic components',
      logo: '/tech/react.png'
    },
    {
      name: 'Tailwind CSS',
      purpose: 'Modern, responsive styling',
      logo: '/tech/tailwind.png'
    },
    {
      name: 'Framer Motion',
      purpose: 'Smooth animations and transitions',
      logo: '/tech/framer.png'
    }
  ]
};

/**
 * Platform overview
 */
const platformOverview = {
  title: 'ConnectBook - AI-Powered Educational Platform',
  mission: 'To revolutionize education through AI-driven learning, assessment, and collaboration tools that connect students, teachers, and parents in a unified ecosystem.',
  description: 'ConnectBook is a comprehensive educational platform that integrates cutting-edge AI technologies with traditional learning methods. Our platform offers a complete suite of tools designed to enhance the educational experience for all stakeholders.',
  keyFeatures: [
    {
      icon: '🎓',
      name: 'CourseMaster',
      description: 'Browse, enroll, and complete courses with automatic certificate generation'
    },
    {
      icon: '📊',
      name: 'GradeMaster',
      description: 'AI-powered grading system with detailed feedback and performance analytics'
    },
    {
      icon: '📚',
      name: 'Study Planner',
      description: 'AI-generated personalized study schedules and task management'
    },
    {
      icon: '💼',
      name: 'Career Advisor',
      description: 'AI-driven career guidance and recommendations based on skills and interests'
    },
    {
      icon: '🎤',
      name: 'Interview Simulator',
      description: 'Practice interviews with AI feedback on responses and presentation'
    },
    {
      icon: '💡',
      name: 'Internship Simulator',
      description: 'Real-world project simulations with task tracking and evaluations'
    },
    {
      icon: '📝',
      name: 'Lecture Short Notes',
      description: 'AI-generated concise notes from video lecture transcriptions'
    },
    {
      icon: '🔗',
      name: 'MentorConnect',
      description: 'Seamless communication between students, teachers, and parents'
    },
    {
      icon: '📰',
      name: 'Real-Time Updates',
      description: 'AI-curated news about education, technology, jobs, and motivation'
    },
    {
      icon: '🤖',
      name: 'AI Chatbot Assistant',
      description: 'Context-aware chatbot for navigation, information, and support'
    }
  ],
  stats: {
    courses: '500+',
    students: '10,000+',
    teachers: '500+',
    certificates: '5,000+'
  }
};

/**
 * @route   GET /api/about/platform
 * @desc    Get platform overview information
 * @access  Public
 */
router.get('/platform', async (req, res) => {
  try {
    res.json({
      success: true,
      data: platformOverview
    });
  } catch (error) {
    console.error('Error fetching platform info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform information',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/about/team
 * @desc    Get team information
 * @access  Public
 */
router.get('/team', async (req, res) => {
  try {
    res.json({
      success: true,
      data: teamInfo
    });
  } catch (error) {
    console.error('Error fetching team info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team information',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/about/version
 * @desc    Get version and technologies information
 * @access  Public
 */
router.get('/version', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        version: teamInfo.version,
        releaseDate: teamInfo.releaseDate,
        technologies: teamInfo.technologies
      }
    });
  } catch (error) {
    console.error('Error fetching version info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch version information',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/about/feedback
 * @desc    Submit feedback/contact form
 * @access  Public (can be submitted by guests too)
 */
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, feedbackType, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !feedbackType || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Create feedback
    const feedbackData = {
      name,
      email,
      feedbackType,
      subject,
      message,
      role: 'guest'
    };
    
    // If user is authenticated, add user info
    if (req.user) {
      feedbackData.userId = req.user._id;
      feedbackData.userModel = req.user.role === 'student' ? 'Student' : 
                               req.user.role === 'teacher' ? 'Teacher' : 'Parent';
      feedbackData.role = req.user.role;
    }
    
    const feedback = new AboutFeedback(feedbackData);
    await feedback.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We will review it shortly.',
      data: { feedbackId: feedback._id }
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
 * @route   GET /api/about/feedback/my-feedback
 * @desc    Get user's submitted feedback
 * @access  Private
 */
router.get('/feedback/my-feedback', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const feedback = await AboutFeedback.getUserFeedback(req.user._id, limit);
    
    res.json({
      success: true,
      data: {
        feedback,
        count: feedback.length
      }
    });
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/about/feedback/all
 * @desc    Get all feedback (admin only)
 * @access  Private (Admin)
 */
router.get('/feedback/all', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all feedback'
      });
    }
    
    const { status, feedbackType, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (feedbackType) query.feedbackType = feedbackType;
    
    const feedback = await AboutFeedback.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('userId', 'name email');
    
    const total = await AboutFeedback.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        feedback,
        count: feedback.length,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/about/feedback/stats
 * @desc    Get feedback statistics (admin only)
 * @access  Private (Admin)
 */
router.get('/feedback/stats', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view feedback statistics'
      });
    }
    
    const stats = await AboutFeedback.getFeedbackStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/about/feedback/:id/status
 * @desc    Update feedback status (admin only)
 * @access  Private (Admin)
 */
router.put('/feedback/:id/status', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update feedback status'
      });
    }
    
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const feedback = await AboutFeedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    await feedback.updateStatus(status);
    
    res.json({
      success: true,
      message: 'Feedback status updated successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/about/feedback/:id/respond
 * @desc    Add admin response to feedback (admin only)
 * @access  Private (Admin)
 */
router.post('/feedback/:id/respond', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can respond to feedback'
      });
    }
    
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }
    
    const feedback = await AboutFeedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    await feedback.addResponse(response, req.user._id);
    
    res.json({
      success: true,
      message: 'Response added successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
});

export default router;
