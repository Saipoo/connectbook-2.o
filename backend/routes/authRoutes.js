import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import Admin from '../models/Admin.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (Student/Teacher/Parent/Admin)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, ...additionalData } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;

    switch (role.toLowerCase()) {
      case 'student':
        // Check if student already exists
        const existingStudent = await Student.findOne({ 
          $or: [{ email }, { usn: additionalData.usn }] 
        });
        
        if (existingStudent) {
          return res.status(400).json({
            success: false,
            message: 'Student with this email or USN already exists'
          });
        }

        // Validate student-specific fields
        if (!additionalData.usn || !additionalData.department || !additionalData.class || !additionalData.section) {
          return res.status(400).json({
            success: false,
            message: 'Please provide USN, Department, Class, and Section'
          });
        }

        newUser = await Student.create({
          name,
          email,
          password: hashedPassword,
          usn: additionalData.usn.toUpperCase(),
          department: additionalData.department,
          class: additionalData.class,
          section: additionalData.section.toUpperCase()
        });
        break;

      case 'teacher':
        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        
        if (existingTeacher) {
          return res.status(400).json({
            success: false,
            message: 'Teacher with this email already exists'
          });
        }

        // Validate teacher-specific fields
        if (!additionalData.department || !additionalData.subjects) {
          return res.status(400).json({
            success: false,
            message: 'Please provide Department and Subjects'
          });
        }

        // Convert subjects to array if it's a string
        let subjectsArray = additionalData.subjects;
        if (typeof additionalData.subjects === 'string') {
          subjectsArray = additionalData.subjects.split(',').map(s => s.trim());
        }

        newUser = await Teacher.create({
          name,
          email,
          password: hashedPassword,
          department: additionalData.department,
          subjects: subjectsArray
        });
        break;

      case 'parent':
        // Check if parent already exists
        const existingParent = await Parent.findOne({ email });
        
        if (existingParent) {
          return res.status(400).json({
            success: false,
            message: 'Parent with this email already exists'
          });
        }

        // Validate parent-specific fields
        if (!additionalData.linkedStudentUSN) {
          return res.status(400).json({
            success: false,
            message: 'Please provide Linked Student USN'
          });
        }

        // Verify that the student USN exists
        const linkedStudent = await Student.findOne({ 
          usn: additionalData.linkedStudentUSN.toUpperCase() 
        });

        if (!linkedStudent) {
          return res.status(400).json({
            success: false,
            message: 'Student with provided USN does not exist'
          });
        }

        newUser = await Parent.create({
          name,
          email,
          password: hashedPassword,
          linkedStudentUSN: additionalData.linkedStudentUSN.toUpperCase()
        });
        break;

      case 'admin':
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        
        if (existingAdmin) {
          return res.status(400).json({
            success: false,
            message: 'Admin with this email already exists'
          });
        }

        newUser = await Admin.create({
          name,
          email,
          password: hashedPassword
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be student, teacher, parent, or admin'
        });
    }

    // Generate token
    const token = generateToken(newUser._id, role.toLowerCase());

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: role.toLowerCase(),
        ...(role.toLowerCase() === 'student' && { 
          usn: newUser.usn, 
          department: newUser.department,
          class: newUser.class,
          section: newUser.section
        }),
        ...(role.toLowerCase() === 'teacher' && { 
          department: newUser.department,
          subjects: newUser.subjects
        }),
        ...(role.toLowerCase() === 'parent' && { 
          linkedStudentUSN: newUser.linkedStudentUSN
        })
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and role'
      });
    }

    let user;
    let userModel;

    // Find user based on role
    switch (role.toLowerCase()) {
      case 'student':
        user = await Student.findOne({ email }).select('+password');
        userModel = 'Student';
        break;
      case 'teacher':
        user = await Teacher.findOne({ email }).select('+password');
        userModel = 'Teacher';
        break;
      case 'parent':
        user = await Parent.findOne({ email }).select('+password');
        userModel = 'Parent';
        break;
      case 'admin':
        user = await Admin.findOne({ email }).select('+password');
        userModel = 'Admin';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id, role.toLowerCase());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role.toLowerCase(),
        ...(role.toLowerCase() === 'student' && { 
          usn: user.usn, 
          department: user.department,
          class: user.class,
          section: user.section
        }),
        ...(role.toLowerCase() === 'teacher' && { 
          department: user.department,
          subjects: user.subjects
        }),
        ...(role.toLowerCase() === 'parent' && { 
          linkedStudentUSN: user.linkedStudentUSN
        })
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
});

export default router;
