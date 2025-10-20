import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import RealTimeUpdate from '../models/RealTimeUpdate.js';
import UpdateGeneratorService from '../services/updateGeneratorService.js';

const router = express.Router();

// @desc    Get all updates with filtering
// @route   GET /api/updates
// @access  Private (Student, Teacher, Parent)
router.get('/', protect, async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 10,
      sortBy = 'postedAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Personalization for students
    if (req.user.role === 'student' && req.user.courses) {
      // Boost priority for relevant courses
      query.$or = query.$or || [];
      query.$or.push(
        { targetCourses: { $in: req.user.courses } },
        { targetCourses: { $size: 0 } }, // General updates
        { targetCourses: { $exists: false } }
      );
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [updates, total] = await Promise.all([
      RealTimeUpdate.find(query)
        .sort({ priority: -1, [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      RealTimeUpdate.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: updates.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: updates
    });
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch updates',
      error: error.message
    });
  }
});

// @desc    Get single update by ID
// @route   GET /api/updates/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const update = await RealTimeUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    // Record view
    if (req.user._id) {
      await update.recordView(req.user._id.toString());
    }

    res.status(200).json({
      success: true,
      data: update
    });
  } catch (error) {
    console.error('Error fetching update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch update',
      error: error.message
    });
  }
});

// @desc    Get dashboard highlights (top 5 updates + quote)
// @route   GET /api/updates/dashboard/highlights
// @access  Private (Student)
router.get('/dashboard/highlights', protect, authorize('student'), async (req, res) => {
  try {
    // Get trending updates
    const trendingUpdates = await RealTimeUpdate.getTrending(5);

    // Get featured job/internship
    const featuredJob = await RealTimeUpdate.findOne({
      category: 'jobs-internships',
      isActive: true
    })
      .sort({ priority: -1, postedAt: -1 })
      .lean();

    // Generate quote of the day
    const quote = await UpdateGeneratorService.generateQuoteOfTheDay();

    // Get category counts
    const categoryCounts = await RealTimeUpdate.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        trendingUpdates,
        featuredJob,
        quote,
        categoryCounts
      }
    });
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch highlights',
      error: error.message
    });
  }
});

// @desc    Generate new AI updates
// @route   POST /api/updates/generate
// @access  Private (Admin/Teacher)
router.post('/generate', protect, authorize('teacher'), async (req, res) => {
  try {
    console.log('🤖 Generating new AI updates...');

    const newUpdates = await UpdateGeneratorService.generateAllUpdates();

    if (newUpdates.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate updates'
      });
    }

    // Save to database
    const savedUpdates = await RealTimeUpdate.insertMany(newUpdates);

    console.log(`✅ Saved ${savedUpdates.length} new updates`);

    res.status(201).json({
      success: true,
      message: `Generated and saved ${savedUpdates.length} updates`,
      data: savedUpdates
    });
  } catch (error) {
    console.error('Error generating updates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate updates',
      error: error.message
    });
  }
});

// @desc    Create manual update (admin/teacher)
// @route   POST /api/updates
// @access  Private (Teacher)
router.post('/', protect, authorize('teacher'), async (req, res) => {
  try {
    const {
      title,
      summary,
      detailedContent,
      category,
      tags,
      imageUrl,
      sourceLink,
      sourceName,
      keyPoints,
      whyItMatters,
      relatedResources,
      isInstitutionalAnnouncement,
      priority,
      targetCourses
    } = req.body;

    if (!title || !summary || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, summary, and category'
      });
    }

    const update = await RealTimeUpdate.create({
      title,
      summary,
      detailedContent,
      category,
      tags: tags || [],
      imageUrl,
      sourceLink,
      sourceName: sourceName || 'ConnectBook',
      keyPoints: keyPoints || [],
      whyItMatters,
      relatedResources: relatedResources || [],
      aiGenerated: false,
      isInstitutionalAnnouncement: isInstitutionalAnnouncement || false,
      priority: priority || 5,
      targetCourses: targetCourses || [],
      createdBy: req.user._id
    });

    console.log(`✅ Manual update created: ${update.title}`);

    res.status(201).json({
      success: true,
      message: 'Update created successfully',
      data: update
    });
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create update',
      error: error.message
    });
  }
});

// @desc    Update an existing update
// @route   PUT /api/updates/:id
// @access  Private (Teacher)
router.put('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const update = await RealTimeUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    const allowedFields = [
      'title',
      'summary',
      'detailedContent',
      'category',
      'tags',
      'imageUrl',
      'sourceLink',
      'sourceName',
      'keyPoints',
      'whyItMatters',
      'relatedResources',
      'isActive',
      'priority',
      'targetCourses'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    });

    update.lastUpdated = new Date();
    await update.save();

    res.status(200).json({
      success: true,
      message: 'Update updated successfully',
      data: update
    });
  } catch (error) {
    console.error('Error updating update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update update',
      error: error.message
    });
  }
});

// @desc    Delete an update
// @route   DELETE /api/updates/:id
// @access  Private (Teacher)
router.delete('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const update = await RealTimeUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    await update.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Update deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete update',
      error: error.message
    });
  }
});

// @desc    Clean old updates
// @route   DELETE /api/updates/cleanup/old
// @access  Private (Teacher)
router.delete('/cleanup/old', protect, authorize('teacher'), async (req, res) => {
  try {
    const { daysOld = 30 } = req.query;

    const result = await RealTimeUpdate.cleanOldUpdates(parseInt(daysOld));

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old updates`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning updates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean old updates',
      error: error.message
    });
  }
});

// @desc    Get update statistics
// @route   GET /api/updates/stats/overview
// @access  Private (Teacher)
router.get('/stats/overview', protect, authorize('teacher'), async (req, res) => {
  try {
    const [
      totalUpdates,
      activeUpdates,
      aiGeneratedCount,
      manualCount,
      categoryBreakdown,
      recentViews
    ] = await Promise.all([
      RealTimeUpdate.countDocuments(),
      RealTimeUpdate.countDocuments({ isActive: true }),
      RealTimeUpdate.countDocuments({ aiGenerated: true }),
      RealTimeUpdate.countDocuments({ aiGenerated: false }),
      RealTimeUpdate.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      RealTimeUpdate.aggregate([
        { $unwind: '$viewedBy' },
        { $sort: { 'viewedBy.viewedAt': -1 } },
        { $limit: 10 },
        {
          $project: {
            title: 1,
            category: 1,
            'viewedBy.userId': 1,
            'viewedBy.viewedAt': 1
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUpdates,
        activeUpdates,
        aiGeneratedCount,
        manualCount,
        categoryBreakdown,
        recentViews
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

export default router;
