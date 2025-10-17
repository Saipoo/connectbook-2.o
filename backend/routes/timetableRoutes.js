import express from 'express';
import Timetable from '../models/Timetable.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/timetable/upload
// @desc    Upload/create timetable entry
// @access  Private (Teacher only)
router.post('/upload', protect, authorize('teacher'), async (req, res) => {
  try {
    const { subject, day, startTime, endTime, department, class: className, section } = req.body;

    // Validation
    if (!subject || !day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, day, start time, and end time'
      });
    }

    // Validate day
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day. Must be Monday through Saturday'
      });
    }

    // Create timetable entry
    const timetableEntry = await Timetable.create({
      teacherId: req.userId,
      teacherEmail: req.user.email,
      subject,
      day,
      startTime,
      endTime,
      department,
      class: className,
      section
    });

    res.status(201).json({
      success: true,
      message: 'Timetable entry created successfully',
      data: timetableEntry
    });
  } catch (error) {
    console.error('Timetable upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating timetable entry',
      error: error.message
    });
  }
});

// @route   GET /api/timetable/my-schedule
// @desc    Get timetable for logged-in teacher
// @access  Private (Teacher only)
router.get('/my-schedule', protect, authorize('teacher'), async (req, res) => {
  try {
    const timetable = await Timetable.find({ teacherId: req.userId }).sort({ day: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable',
      error: error.message
    });
  }
});

// @route   GET /api/timetable/:id
// @desc    Get specific timetable entry
// @access  Private (Teacher only)
router.get('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);

    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    // Check if the entry belongs to the logged-in teacher
    if (timetableEntry.teacherId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this timetable entry'
      });
    }

    res.status(200).json({
      success: true,
      data: timetableEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable entry',
      error: error.message
    });
  }
});

// @route   PUT /api/timetable/:id
// @desc    Update timetable entry
// @access  Private (Teacher only)
router.put('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    let timetableEntry = await Timetable.findById(req.params.id);

    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    // Check if the entry belongs to the logged-in teacher
    if (timetableEntry.teacherId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this timetable entry'
      });
    }

    // Update timetable entry
    timetableEntry = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Timetable entry updated successfully',
      data: timetableEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating timetable entry',
      error: error.message
    });
  }
});

// @route   DELETE /api/timetable/:id
// @desc    Delete timetable entry
// @access  Private (Teacher only)
router.delete('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);

    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    // Check if the entry belongs to the logged-in teacher
    if (timetableEntry.teacherId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this timetable entry'
      });
    }

    await Timetable.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting timetable entry',
      error: error.message
    });
  }
});

// @route   POST /api/timetable/bulk-upload
// @desc    Bulk upload timetable (for CSV/Excel import)
// @access  Private (Teacher only)
router.post('/bulk-upload', protect, authorize('teacher'), async (req, res) => {
  try {
    const { entries } = req.body;

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of timetable entries'
      });
    }

    // Add teacher info to each entry
    const timetableEntries = entries.map(entry => ({
      ...entry,
      teacherId: req.userId,
      teacherEmail: req.user.email
    }));

    // Insert all entries
    const created = await Timetable.insertMany(timetableEntries);

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${created.length} timetable entries`,
      count: created.length,
      data: created
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during bulk upload',
      error: error.message
    });
  }
});

export default router;
