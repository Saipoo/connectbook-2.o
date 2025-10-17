import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import VideoMeeting from '../models/VideoMeeting.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import Message from '../models/Message.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Generate unique meeting ID
const generateMeetingId = () => {
  return `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Generate secure meeting link with JWT token
const generateMeetingLink = (meetingId) => {
  const token = jwt.sign(
    { meetingId, timestamp: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return `${process.env.FRONTEND_URL || 'http://localhost:5173'}/meeting/${meetingId}?token=${token}`;
};

// @route   POST /api/mentor/connect/meeting/create
// @desc    Create a new video meeting
// @access  Private (Teacher only)
router.post('/create', protect, authorize('teacher'), async (req, res) => {
  try {
    const { parentId, studentUSN, title, description, scheduledTime, duration } = req.body;

    // Validation
    if (!parentId || !studentUSN || !title || !scheduledTime) {
      console.error('Validation failed for meeting.create - missing fields', { body: req.body, sender: req.user._id });
      return res.status(400).json({
        success: false,
        message: 'Please provide parent ID, student USN, title, and scheduled time'
      });
    }

    // Verify student exists
    const student = await Student.findOne({ usn: studentUSN.toUpperCase() });
    if (!student) {
      console.error('Student not found during meeting.create', { studentUSN, body: req.body, sender: req.user._id });
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify parent exists and is linked to student
    const parent = await Parent.findById(parentId);
    if (!parent) {
      console.error('Parent not found during meeting.create', { parentId, body: req.body, sender: req.user._id });
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    if (parent.linkedStudentUSN !== studentUSN.toUpperCase()) {
      console.error('Parent-student link mismatch for meeting.create', { parentLinked: parent.linkedStudentUSN, studentUSN, body: req.body, sender: req.user._id });
      return res.status(403).json({
        success: false,
        message: 'Parent is not linked to this student'
      });
    }

    // Generate meeting details
    const meetingId = generateMeetingId();
    const meetingLink = generateMeetingLink(meetingId);

    // Create meeting
    const meeting = await VideoMeeting.create({
      meetingId,
      teacherId: req.user._id,
      teacherName: req.user.name,
      parentId,
      parentName: parent.name,
      studentUSN: studentUSN.toUpperCase(),
      studentName: student.name,
      title,
      description: description || '',
      scheduledTime: new Date(scheduledTime),
      duration: duration || 30,
      status: 'Scheduled',
      meetingLink,
      platform: 'Jitsi',
      participants: []
    });

    // Send meeting link as a message to parent
    const meetingMessage = await Message.create({
      senderId: req.user._id,
      senderRole: 'teacher',
      receiverId: parentId,
      receiverRole: 'parent',
      studentUSN: studentUSN.toUpperCase(),
      messageType: 'meeting_link',
      content: `📹 Video Meeting Scheduled: ${title}\n\nTime: ${new Date(scheduledTime).toLocaleString()}\nDuration: ${duration} minutes\n\nClick to join: ${meetingLink}`,
      delivered: false,
      seen: false
    });

    // Emit socket events to both parent and teacher
    const io = req.app.get('io');
    if (io) {
      // Send to parent
      io.to(parentId.toString()).emit('meeting_created', {
        meeting,
        message: meetingMessage
      });
      io.to(parentId.toString()).emit('receive_message', meetingMessage);
      io.to(parentId.toString()).emit('new_message_notification', {
        from: req.user.name,
        message: `Scheduled a video meeting: ${title}`
      });
      
      // Send to teacher (creator)
      io.to(req.user._id.toString()).emit('meeting_created', {
        meeting,
        message: null // Teacher doesn't need the message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      data: {
        meeting,
        meetingLink
      }
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating meeting',
      error: error.message
    });
  }
});

// @route   GET /api/mentor/connect/meeting/:meetingId
// @desc    Get meeting details
// @access  Private (Teacher/Parent only)
router.get('/:meetingId', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await VideoMeeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Verify user has access to this meeting
    const userId = req.user._id.toString();
    if (meeting.teacherId !== userId && meeting.parentId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this meeting'
      });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/mentor/connect/meeting/list/my-meetings
// @desc    Get all meetings for current user
// @access  Private (Teacher/Parent only)
router.get('/list/my-meetings', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    let query = {};
    
    if (req.user.role === 'teacher') {
      query.teacherId = userId;
    } else {
      query.parentId = userId;
    }

    if (status) {
      query.status = status;
    }

    const meetings = await VideoMeeting.find(query)
      .sort({ scheduledTime: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meetings',
      error: error.message
    });
  }
});

// @route   PATCH /api/mentor/connect/meeting/:meetingId/start
// @desc    Start a meeting
// @access  Private (Teacher only)
router.patch('/:meetingId/start', protect, authorize('teacher'), async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await VideoMeeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    if (meeting.teacherId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the meeting creator can start the meeting'
      });
    }

    meeting.status = 'Ongoing';
    meeting.startTime = new Date();
    await meeting.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(meeting.parentId).emit('meeting_started', {
        meetingId: meeting.meetingId,
        startTime: meeting.startTime
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meeting started',
      data: meeting
    });
  } catch (error) {
    console.error('Error starting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/mentor/connect/meeting/:meetingId/end
// @desc    End a meeting
// @access  Private (Teacher only)
router.patch('/:meetingId/end', protect, authorize('teacher'), async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await VideoMeeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    if (meeting.teacherId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the meeting creator can end the meeting'
      });
    }

    meeting.status = 'Ended';
    meeting.endTime = new Date();
    await meeting.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(meeting.parentId).emit('meeting_ended', {
        meetingId: meeting.meetingId,
        endTime: meeting.endTime
      });
      // Broadcast to meeting room
      io.to(`meeting-${meetingId}`).emit('meeting_ended', {
        meetingId: meeting.meetingId,
        endTime: meeting.endTime
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meeting ended',
      data: meeting
    });
  } catch (error) {
    console.error('Error ending meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/mentor/connect/meeting/:meetingId/join
// @desc    Join a meeting
// @access  Private (Teacher/Parent only)
router.patch('/:meetingId/join', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await VideoMeeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Verify user has access
    const userId = req.user._id.toString();
    if (meeting.teacherId !== userId && meeting.parentId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this meeting'
      });
    }

    // Add participant
    meeting.participants.push({
      userId: req.user._id,
      role: req.user.role,
      joinedAt: new Date()
    });

    await meeting.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`meeting-${meetingId}`).emit('participant_joined', {
        userId: req.user._id,
        name: req.user.name,
        role: req.user.role,
        joinedAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Joined meeting',
      data: meeting
    });
  } catch (error) {
    console.error('Error joining meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
