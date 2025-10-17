import express from 'express';
import CryptoJS from 'crypto-js';
import StudentFace from '../models/StudentFace.js';
import Student from '../models/Student.js';
import AttendanceLog from '../models/AttendanceLog.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Encrypt face embeddings
const encryptEmbeddings = (embeddings) => {
  try {
    const embeddingsString = JSON.stringify(embeddings);
    return CryptoJS.AES.encrypt(embeddingsString, process.env.ENCRYPTION_KEY || 'default_key').toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Decrypt face embeddings
const decryptEmbeddings = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPTION_KEY || 'default_key');
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Calculate Euclidean distance between two embeddings
const euclideanDistance = (embedding1, embedding2) => {
  if (embedding1.length !== embedding2.length) {
    return Infinity;
  }
  
  let sum = 0;
  for (let i = 0; i < embedding1.length; i++) {
    sum += Math.pow(embedding1[i] - embedding2[i], 2);
  }
  return Math.sqrt(sum);
};

// @route   POST /api/face/register
// @desc    Register student face embeddings
// @access  Private (Student only)
router.post('/register', protect, authorize('student'), async (req, res) => {
  try {
    const { usn, name, department, class: className, embeddings } = req.body;

    // Validation
    if (!usn || !name || !department || !className || !embeddings || !Array.isArray(embeddings)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields including face embeddings'
      });
    }

    // Verify that the student exists
    const student = await Student.findOne({ usn: usn.toUpperCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if face already registered
    const existingFace = await StudentFace.findOne({ usn: usn.toUpperCase() });
    if (existingFace) {
      return res.status(400).json({
        success: false,
        message: 'Face already registered for this USN. Please contact admin to update.'
      });
    }

    // Encrypt embeddings (optional security layer)
    const encryptedEmbeddings = encryptEmbeddings(embeddings);

    // Create face record
    const studentFace = await StudentFace.create({
      usn: usn.toUpperCase(),
      name,
      department,
      class: className,
      embeddings,
      encryptedEmbeddings
    });

    res.status(201).json({
      success: true,
      message: 'Face registered successfully',
      data: {
        usn: studentFace.usn,
        name: studentFace.name,
        registeredAt: studentFace.registeredAt
      }
    });
  } catch (error) {
    console.error('Face registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering face',
      error: error.message
    });
  }
});

// @route   POST /api/face/mark
// @desc    Mark attendance using face recognition
// @access  Private (Student only)
router.post('/mark', protect, authorize('student'), async (req, res) => {
  try {
    const { embedding, subject } = req.body;

    console.log('=== Mark Attendance Request ===');
    console.log('User USN:', req.user.usn);
    console.log('Subject:', subject);
    console.log('Embedding length:', embedding?.length);

    // Validation
    if (!embedding || !Array.isArray(embedding) || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide face embedding and subject'
      });
    }

    // Get all registered faces
    const allFaces = await StudentFace.find({});
    console.log('Total registered faces in DB:', allFaces.length);

    if (allFaces.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registered faces found in the database'
      });
    }

    // Find best match
    let bestMatch = null;
    let minDistance = Infinity;
    const threshold = 0.8; // Increased threshold for face-api.js (typical range: 0.4-0.7 for matches)

    for (const face of allFaces) {
      // Compare with each stored embedding
      for (const storedEmbedding of face.embeddings) {
        const distance = euclideanDistance(embedding, storedEmbedding);
        
        console.log(`Comparing with ${face.usn}: distance = ${distance}`);
        
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = face;
        }
      }
    }

    console.log(`Best match: ${bestMatch?.usn}, Min distance: ${minDistance}, Threshold: ${threshold}`);

    // Check if match is within threshold
    if (minDistance > threshold) {
      return res.status(404).json({
        success: false,
        message: 'Face not recognized. Please register your face first.',
        distance: minDistance,
        threshold: threshold
      });
    }

    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

    // Check if attendance already marked today for this subject
    const existingAttendance = await AttendanceLog.findOne({
      usn: bestMatch.usn,
      subject,
      date
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this subject today'
      });
    }

    // Get student details
    const student = await Student.findOne({ usn: bestMatch.usn });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found for matched face'
      });
    }

    // Create attendance log
    const attendanceLog = await AttendanceLog.create({
      usn: bestMatch.usn,
      name: bestMatch.name,
      subject,
      date,
      time,
      mode: 'Face Recognition',
      status: 'Present',
      department: student.department,
      class: student.class,
      section: student.section,
      markedBy: 'Student'
    });

    // Emit socket event for real-time updates
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('attendanceMarked', {
          usn: bestMatch.usn,
          name: bestMatch.name,
          subject,
          date,
          time,
          status: 'Present'
        });
      }
    } catch (socketError) {
      console.error('Socket.io error (non-critical):', socketError);
    }

    res.status(200).json({
      success: true,
      message: `Attendance marked successfully for ${bestMatch.name}`,
      data: {
        usn: bestMatch.usn,
        name: bestMatch.name,
        subject,
        date,
        time,
        status: 'Present',
        matchConfidence: (1 - minDistance).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Face marking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
});

// @route   GET /api/face/check/:usn
// @desc    Check if face is registered for a USN
// @access  Private (Student only)
router.get('/check/:usn', protect, authorize('student'), async (req, res) => {
  try {
    const { usn } = req.params;

    const studentFace = await StudentFace.findOne({ usn: usn.toUpperCase() });

    res.status(200).json({
      success: true,
      registered: !!studentFace,
      data: studentFace ? {
        usn: studentFace.usn,
        name: studentFace.name,
        registeredAt: studentFace.registeredAt
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking face registration',
      error: error.message
    });
  }
});

// @route   DELETE /api/face/delete/:usn
// @desc    Delete face registration (Admin only)
// @access  Private (Admin only)
router.delete('/delete/:usn', protect, authorize('admin'), async (req, res) => {
  try {
    const { usn } = req.params;

    const deletedFace = await StudentFace.findOneAndDelete({ usn: usn.toUpperCase() });

    if (!deletedFace) {
      return res.status(404).json({
        success: false,
        message: 'Face registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Face registration deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting face registration',
      error: error.message
    });
  }
});

export default router;
