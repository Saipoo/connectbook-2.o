import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import AttendanceLog from '../models/AttendanceLog.js';

const router = express.Router();

/**
 * @route   GET /api/parents/profile
 * @desc    Get parent profile with linked student USN
 * @access  Private (Parent)
 */
router.get('/profile', protect, authorize('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id);
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    res.json({
      success: true,
      _id: parent._id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      linkedStudentUSN: parent.linkedStudentUSN
    });
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching parent profile'
    });
  }
});

/**
 * @route   GET /api/parents/my-student
 * @desc    Get linked student data for parent
 * @access  Private (Parent)
 */
router.get('/my-student', protect, authorize('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id);
    
    if (!parent || !parent.linkedStudentUSN) {
      return res.status(404).json({
        success: false,
        message: 'No linked student found'
      });
    }

    const student = await Student.findOne({ usn: parent.linkedStudentUSN });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        usn: student.usn,
        email: student.email,
        department: student.department,
        semester: student.semester,
        phone: student.phone
      }
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student data'
    });
  }
});

/**
 * @route   GET /api/parents/student/:usn/attendance
 * @desc    Get student's attendance data (for parent)
 * @access  Private (Parent)
 */
router.get('/student/:usn/attendance', protect, authorize('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id);
    
    if (!parent || parent.linkedStudentUSN !== req.params.usn.toUpperCase()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const attendanceLogs = await AttendanceLog.find({ studentUSN: req.params.usn })
      .sort({ date: -1 });

    // Calculate statistics
    const totalClasses = attendanceLogs.length;
    const present = attendanceLogs.filter(log => log.status === 'present').length;
    const absent = totalClasses - present;
    const percentage = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

    // Subject-wise breakdown
    const subjectWise = {};
    attendanceLogs.forEach(log => {
      if (!subjectWise[log.subject]) {
        subjectWise[log.subject] = { present: 0, total: 0 };
      }
      subjectWise[log.subject].total++;
      if (log.status === 'present') {
        subjectWise[log.subject].present++;
      }
    });

    // Calculate percentages
    Object.keys(subjectWise).forEach(subject => {
      const data = subjectWise[subject];
      data.percentage = Math.round((data.present / data.total) * 100);
    });

    res.json({
      success: true,
      statistics: {
        overall: { totalClasses, present, absent, percentage },
        subjectWise
      },
      data: attendanceLogs
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance data'
    });
  }
});

export default router;
