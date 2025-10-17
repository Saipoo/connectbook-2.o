import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Message from '../models/Message.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/chat_files'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images, documents, and audio files
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|mp3|wav|ogg|m4a/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images, documents, and audio files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// @route   POST /api/mentor/connect/chat/send
// @desc    Send a message
// @access  Private (Teacher/Parent only)
router.post('/send', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    const { receiverId, receiverRole, studentUSN, messageType, content } = req.body;

    console.log('📧 Send message request:', {
      senderId: req.user._id,
      senderName: req.user.name,
      receiverId,
      receiverRole,
      studentUSN,
      messageType,
      contentLength: content?.length
    });

    // Validation
    if (!receiverId || !receiverRole || !studentUSN) {
      console.error('Validation failed for send message - missing fields', {
        body: req.body,
        senderId: req.user._id
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver ID, role, and student USN'
      });
    }

    const msgType = messageType || 'text';
    
    if (msgType === 'text' && !content) {
      console.error('Validation failed for send message - empty text content', { body: req.body, senderId: req.user._id });
      return res.status(400).json({
        success: false,
        message: 'Text message content is required'
      });
    }

    // Verify student exists and is linked
    const student = await Student.findOne({ usn: studentUSN.toUpperCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with USN ${studentUSN} not found`
      });
    }

    // Create message
    const message = await Message.create({
      senderId: req.user._id,
      senderRole: req.user.role,
      receiverId,
      receiverRole,
      studentUSN: studentUSN.toUpperCase(),
      messageType: messageType || 'text',
      content: content || '',
      delivered: false,
      seen: false
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('receive_message', message);
      io.to(receiverId).emit('new_message_notification', {
        from: req.user.name,
        message: content?.substring(0, 50) || 'Sent a file'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message',
      error: error.message
    });
  }
});

// @route   POST /api/mentor/connect/chat/send-file
// @desc    Send a file message
// @access  Private (Teacher/Parent only)
router.post('/send-file', protect, authorize('teacher', 'parent'), upload.single('file'), async (req, res) => {
  try {
    const { receiverId, receiverRole, studentUSN, messageType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create message with file
    const message = await Message.create({
      senderId: req.user._id,
      senderRole: req.user.role,
      receiverId,
      receiverRole,
      studentUSN: studentUSN.toUpperCase(),
      messageType: messageType || 'file',
      content: req.file.originalname,
      fileUrl: `/uploads/chat_files/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      delivered: false,
      seen: false
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('receive_message', message);
      io.to(receiverId).emit('new_message_notification', {
        from: req.user.name,
        message: `Sent a ${messageType || 'file'}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'File sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error sending file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending file',
      error: error.message
    });
  }
});

// @route   GET /api/mentor/connect/chat/:userId
// @desc    Get chat messages between current user and another user
// @access  Private (Teacher/Parent only)
router.get('/:userId', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Get messages between these two users
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 }).limit(500);

    // Mark messages as delivered
    await Message.updateMany(
      {
        senderId: userId,
        receiverId: currentUserId,
        delivered: false
      },
      {
        delivered: true,
        deliveredAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages',
      error: error.message
    });
  }
});

// @route   PATCH /api/mentor/connect/chat/seen/:messageId
// @desc    Mark message as seen
// @access  Private (Teacher/Parent only)
router.patch('/seen/:messageId', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        seen: true,
        seenAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Emit socket event to sender
    const io = req.app.get('io');
    if (io) {
      io.to(message.senderId).emit('message_seen', {
        messageId: message._id,
        seenAt: message.seenAt
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as seen',
      data: message
    });
  } catch (error) {
    console.error('Error marking message as seen:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/mentor/connect/chat/seen-all/:userId
// @desc    Mark all messages from a user as seen
// @access  Private (Teacher/Parent only)
router.patch('/seen-all/:userId', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const result = await Message.updateMany(
      {
        senderId: userId,
        receiverId: currentUserId,
        seen: false
      },
      {
        seen: true,
        seenAt: new Date()
      }
    );

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(userId).emit('messages_seen', {
        recipientId: currentUserId,
        count: result.modifiedCount
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} messages marked as seen`
    });
  } catch (error) {
    console.error('Error marking messages as seen:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/mentor/connect/chat/contacts/list
// @desc    Get list of contacts (teachers for parents, parents for teachers)
// @access  Private (Teacher/Parent only)
router.get('/contacts/list', protect, authorize('teacher', 'parent'), async (req, res) => {
  try {
    let contacts = [];

    if (req.user.role === 'parent') {
      // Get all teachers linked to the student
      const student = await Student.findOne({ usn: req.user.linkedStudentUSN });
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Linked student not found'
        });
      }

      // Get all teachers from the same department
      const teachers = await Teacher.find({ department: student.department })
        .select('_id name email department subjects');

      contacts = teachers.map(teacher => ({
        _id: teacher._id,
        userId: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        department: teacher.department,
        subjects: teacher.subjects,
        studentUSN: student.usn,
        studentName: student.name
      }));
    } else if (req.user.role === 'teacher') {
      // Get all parents of students in teacher's department/class
      const teacher = await Teacher.findById(req.user._id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Find all students in the teacher's department
      const students = await Student.find({ 
        department: teacher.department 
      }).select('_id name usn class section department');

      // For each student, find their parent
      for (const student of students) {
        const parent = await Parent.findOne({ linkedStudentUSN: student.usn })
          .select('_id name email linkedStudentUSN');
        
        if (parent) {
          contacts.push({
            _id: parent._id,
            userId: parent._id,
            name: parent.name,
            email: parent.email,
            role: 'parent',
            studentUSN: student.usn,
            studentName: student.name,
            studentClass: student.class,
            studentSection: student.section
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts',
      error: error.message
    });
  }
});

export default router;
