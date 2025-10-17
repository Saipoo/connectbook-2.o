import express from 'express';
import AttendanceLog from '../models/AttendanceLog.js';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/attendance/logs
// @desc    Get attendance logs (filtered by role)
// @access  Private (Teacher, Admin)
router.get('/logs', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { subject, date, startDate, endDate, department, class: className, section } = req.query;

    // Build filter
    let filter = {};

    if (subject) filter.subject = subject;
    if (date) filter.date = date;
    if (department) filter.department = department;
    if (className) filter.class = className;
    if (section) filter.section = section;

    // Date range filter
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }

    const logs = await AttendanceLog.find(filter).sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance logs',
      error: error.message
    });
  }
});

// @route   GET /api/attendance/student/:usn
// @desc    Get attendance logs for a specific student
// @access  Private (Student, Parent, Teacher, Admin)
router.get('/student/:usn', protect, async (req, res) => {
  try {
    const { usn } = req.params;

    // Authorization check
    if (req.userRole === 'student' && req.user.usn !== usn.toUpperCase()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student\'s attendance'
      });
    }

    if (req.userRole === 'parent' && req.user.linkedStudentUSN !== usn.toUpperCase()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student\'s attendance'
      });
    }

    // Get attendance logs
    const logs = await AttendanceLog.find({ usn: usn.toUpperCase() }).sort({ date: -1, time: -1 });

    // Calculate statistics
    const totalClasses = logs.length;
    const presentCount = logs.filter(log => log.status === 'Present').length;
    const absentCount = logs.filter(log => log.status === 'Absent').length;
    const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      usn: usn.toUpperCase(),
      statistics: {
        totalClasses,
        present: presentCount,
        absent: absentCount,
        percentage: attendancePercentage
      },
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance',
      error: error.message
    });
  }
});

// @route   GET /api/attendance/my-attendance
// @desc    Get attendance for logged-in student
// @access  Private (Student only)
router.get('/my-attendance', protect, authorize('student'), async (req, res) => {
  try {
    const usn = req.user.usn;

    // Get attendance logs
    const logs = await AttendanceLog.find({ usn }).sort({ date: -1, time: -1 });

    // Calculate statistics
    const totalClasses = logs.length;
    const presentCount = logs.filter(log => log.status === 'Present').length;
    const absentCount = logs.filter(log => log.status === 'Absent').length;
    const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

    // Group by subject
    const subjectWise = {};
    logs.forEach(log => {
      if (!subjectWise[log.subject]) {
        subjectWise[log.subject] = {
          total: 0,
          present: 0,
          absent: 0
        };
      }
      subjectWise[log.subject].total++;
      if (log.status === 'Present') {
        subjectWise[log.subject].present++;
      } else {
        subjectWise[log.subject].absent++;
      }
    });

    // Calculate percentage for each subject
    Object.keys(subjectWise).forEach(subject => {
      const data = subjectWise[subject];
      data.percentage = ((data.present / data.total) * 100).toFixed(2);
    });

    res.status(200).json({
      success: true,
      statistics: {
        overall: {
          totalClasses,
          present: presentCount,
          absent: absentCount,
          percentage: attendancePercentage
        },
        subjectWise
      },
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
});

// @route   POST /api/attendance/manual
// @desc    Manually mark attendance (Teacher only)
// @access  Private (Teacher only)
router.post('/manual', protect, authorize('teacher'), async (req, res) => {
  try {
    const { usn, subject, status } = req.body;

    // Validation
    if (!usn || !subject || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide USN, subject, and status'
      });
    }

    // Verify student exists
    const student = await Student.findOne({ usn: usn.toUpperCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    // Check if attendance already marked
    const existingAttendance = await AttendanceLog.findOne({
      usn: usn.toUpperCase(),
      subject,
      date
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student today'
      });
    }

    // Create attendance log
    const attendanceLog = await AttendanceLog.create({
      usn: usn.toUpperCase(),
      name: student.name,
      subject,
      date,
      time,
      mode: 'Manual',
      status,
      department: student.department,
      class: student.class,
      section: student.section,
      markedBy: `Teacher: ${req.user.name}`
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('attendance_marked', {
      usn: usn.toUpperCase(),
      name: student.name,
      subject,
      date,
      time,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendanceLog
    });
  } catch (error) {
    console.error('Manual attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
});

// @route   GET /api/attendance/stats
// @desc    Get overall attendance statistics
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalLogs = await AttendanceLog.countDocuments();
    const presentCount = await AttendanceLog.countDocuments({ status: 'Present' });
    const absentCount = await AttendanceLog.countDocuments({ status: 'Absent' });
    const faceCount = await AttendanceLog.countDocuments({ mode: 'Face' });
    const manualCount = await AttendanceLog.countDocuments({ mode: 'Manual' });

    // Get unique students who have marked attendance
    const uniqueStudents = await AttendanceLog.distinct('usn');

    // Get total students
    const totalStudents = await Student.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalAttendanceLogs: totalLogs,
        presentCount,
        absentCount,
        faceRecognitionCount: faceCount,
        manualCount,
        uniqueStudentsWithAttendance: uniqueStudents.length,
        totalStudents,
        attendancePercentage: totalLogs > 0 ? ((presentCount / totalLogs) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// @route   DELETE /api/attendance/:id
// @desc    Delete attendance log (Admin only)
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const attendanceLog = await AttendanceLog.findByIdAndDelete(req.params.id);

    if (!attendanceLog) {
      return res.status(404).json({
        success: false,
        message: 'Attendance log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance log deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance log',
      error: error.message
    });
  }
});

export default router;
