import express from 'express';
import Internship from '../models/Internship.js';
import InternshipEnrollment from '../models/InternshipEnrollment.js';
import InternshipTask from '../models/InternshipTask.js';
import InternshipCertificate from '../models/InternshipCertificate.js';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';
import internshipAIService from '../services/internshipAIService.js';

const router = express.Router();

// @route   GET /api/internships
// @desc    Get all internships (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { domain, skillLevel, company } = req.query;

    let filter = { isActive: true };
    
    if (domain) filter.domain = domain;
    if (skillLevel) filter.skillLevel = skillLevel;
    if (company) filter.company = new RegExp(company, 'i');

    const internships = await Internship.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching internships',
      error: error.message
    });
  }
});

// @route   POST /api/internships/enroll
// @desc    Enroll student in internship
// @access  Private (Student)
router.post('/enroll', protect, authorize('student'), async (req, res) => {
  try {
    const { internshipId } = req.body;
    const studentUSN = req.user.usn;

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await InternshipEnrollment.findOne({
      studentUSN,
      internshipId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this internship'
      });
    }

    // Create enrollment
    const enrollment = await InternshipEnrollment.create({
      studentUSN,
      studentName: req.user.name,
      studentEmail: req.user.email,
      internshipId,
      company: internship.company,
      role: internship.role,
      domain: internship.domain,
      status: 'enrolled',
      totalTasks: internship.tasksCount
    });

    // Generate AI tasks
    console.log('🤖 Generating AI tasks for internship...');
    const tasksResult = await internshipAIService.instance.generateTasks(
      internship.company,
      internship.role,
      internship.domain,
      internship.tasksCount
    );

    if (tasksResult.success) {
      // Create task documents
      const taskPromises = tasksResult.tasks.map((task, index) => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + (index + 1) * Math.ceil((internship.duration * 7) / internship.tasksCount));

        return InternshipTask.create({
          enrollmentId: enrollment._id,
          studentUSN,
          internshipId,
          taskNumber: index + 1,
          title: task.title,
          description: task.description,
          taskType: task.taskType,
          requirements: task.requirements,
          deadline,
          status: 'assigned'
        });
      });

      await Promise.all(taskPromises);
      console.log(`✅ Created ${tasksResult.tasks.length} tasks for enrollment`);
    }

    // Update enrollment status
    enrollment.status = 'in-progress';
    enrollment.startedAt = new Date();
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in internship',
      data: enrollment
    });
  } catch (error) {
    console.error('Error enrolling in internship:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in internship',
      error: error.message
    });
  }
});

// @route   GET /api/internships/my-enrollments
// @desc    Get student's internship enrollments
// @access  Private (Student)
router.get('/my-enrollments', protect, authorize('student'), async (req, res) => {
  try {
    const enrollments = await InternshipEnrollment.find({
      studentUSN: req.user.usn
    })
      .populate('internshipId')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
});

// @route   GET /api/internships/enrollment/:enrollmentId/tasks
// @desc    Get tasks for an enrollment
// @access  Private (Student)
router.get('/enrollment/:enrollmentId/tasks', protect, authorize('student'), async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    // Verify enrollment belongs to student
    const enrollment = await InternshipEnrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.studentUSN !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these tasks'
      });
    }

    const tasks = await InternshipTask.find({ enrollmentId }).sort({ taskNumber: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

// @route   POST /api/internships/task/submit
// @desc    Submit internship task
// @access  Private (Student)
router.post('/task/submit', protect, authorize('student'), async (req, res) => {
  try {
    const { taskId, description, codeUrl, notes, files } = req.body;

    const task = await InternshipTask.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify task belongs to student
    if (task.studentUSN !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this task'
      });
    }

    // Update submission
    task.submission = {
      submittedAt: new Date(),
      description,
      codeUrl,
      notes,
      files: files || []
    };
    task.status = 'submitted';
    await task.save();

    // Trigger AI evaluation
    console.log('🤖 Evaluating task submission with AI...');
    const evaluationResult = await internshipAIService.instance.evaluateTask({
      task: {
        title: task.title,
        taskType: task.taskType,
        requirements: task.requirements
      },
      submission: task.submission,
      deadline: task.deadline
    });

    if (evaluationResult.success) {
      task.evaluation = {
        evaluatedAt: new Date(),
        evaluatedBy: 'AI',
        score: evaluationResult.evaluation.scores.overall,
        breakdown: evaluationResult.evaluation.scores,
        feedback: evaluationResult.evaluation.feedback,
        suggestions: evaluationResult.evaluation.suggestions,
        suggestedCourses: evaluationResult.evaluation.suggestedCourses,
        strengths: evaluationResult.evaluation.strengths,
        improvements: evaluationResult.evaluation.improvements
      };
      task.status = 'evaluated';
      await task.save();

      // Update enrollment progress
      const enrollment = await InternshipEnrollment.findById(task.enrollmentId);
      const allTasks = await InternshipTask.find({ enrollmentId: task.enrollmentId });
      const completedTasks = allTasks.filter(t => t.status === 'evaluated').length;
      const avgScore = allTasks
        .filter(t => t.evaluation && t.evaluation.score)
        .reduce((sum, t) => sum + t.evaluation.score, 0) / (completedTasks || 1);

      enrollment.tasksCompleted = completedTasks;
      enrollment.progress = Math.round((completedTasks / enrollment.totalTasks) * 100);
      enrollment.overallScore = Math.round(avgScore);

      // Check if all tasks completed
      if (completedTasks === enrollment.totalTasks) {
        enrollment.status = 'completed';
        enrollment.completedAt = new Date();
      }

      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Task submitted and evaluated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting task',
      error: error.message
    });
  }
});

// @route   POST /api/internships/task/ai-help
// @desc    Get AI help for a task
// @access  Private (Student)
router.post('/task/ai-help', protect, authorize('student'), async (req, res) => {
  try {
    const { taskId, question } = req.body;

    const task = await InternshipTask.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify task belongs to student
    if (task.studentUSN !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get AI help
    const helpResult = await internshipAIService.instance.getAIHelp(question, {
      title: task.title,
      taskType: task.taskType,
      description: task.description
    });

    if (helpResult.success) {
      // Store conversation
      task.aiHelpRequested += 1;
      task.aiConversations.push({
        timestamp: new Date(),
        question,
        response: helpResult.response
      });
      await task.save();

      res.status(200).json({
        success: true,
        response: helpResult.response
      });
    } else {
      res.status(500).json({
        success: false,
        message: helpResult.message
      });
    }
  } catch (error) {
    console.error('Error getting AI help:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting AI help',
      error: error.message
    });
  }
});

// @route   GET /api/internships/task/:taskId/evaluation
// @desc    Get task evaluation details
// @access  Private (Student)
router.get('/task/:taskId/evaluation', protect, authorize('student'), async (req, res) => {
  try {
    const task = await InternshipTask.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.studentUSN !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        task: {
          title: task.title,
          taskType: task.taskType,
          status: task.status
        },
        evaluation: task.evaluation || null
      }
    });
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching evaluation',
      error: error.message
    });
  }
});

// @route   POST /api/internships/certificate
// @desc    Generate internship completion certificate
// @access  Private (Student)
router.post('/certificate', protect, authorize('student'), async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await InternshipEnrollment.findById(enrollmentId).populate('internshipId');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.studentUSN !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (enrollment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Internship not completed yet'
      });
    }

    if (enrollment.certificateGenerated) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already generated'
      });
    }

    // Generate certificate
    const certificateId = `INT-${Date.now()}-${enrollment.studentUSN}`;
    const verificationCode = `VER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Calculate grade based on score
    let grade = 'D';
    if (enrollment.overallScore >= 90) grade = 'A+';
    else if (enrollment.overallScore >= 85) grade = 'A';
    else if (enrollment.overallScore >= 80) grade = 'B+';
    else if (enrollment.overallScore >= 75) grade = 'B';
    else if (enrollment.overallScore >= 70) grade = 'C+';
    else if (enrollment.overallScore >= 65) grade = 'C';

    const certificate = await InternshipCertificate.create({
      certificateId,
      enrollmentId: enrollment._id,
      studentUSN: enrollment.studentUSN,
      studentName: enrollment.studentName,
      studentEmail: enrollment.studentEmail,
      internshipId: enrollment.internshipId._id,
      company: enrollment.company,
      role: enrollment.role,
      domain: enrollment.domain,
      duration: enrollment.internshipId.duration,
      startDate: enrollment.startedAt,
      completionDate: enrollment.completedAt,
      overallScore: enrollment.overallScore,
      grade,
      skills: enrollment.internshipId.learningObjectives || [],
      achievements: [`Completed ${enrollment.totalTasks} tasks`, `Achieved ${grade} grade`],
      verificationCode,
      issuedAt: new Date()
    });

    // Update enrollment
    enrollment.certificateGenerated = true;
    enrollment.certificateId = certificate._id;
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating certificate',
      error: error.message
    });
  }
});

// @route   GET /api/internships/certificates
// @desc    Get student's internship certificates
// @access  Private (Student)
router.get('/certificates', protect, authorize('student'), async (req, res) => {
  try {
    const certificates = await InternshipCertificate.find({
      studentUSN: req.user.usn
    }).sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching certificates',
      error: error.message
    });
  }
});

// @route   GET /api/internships/student/:usn
// @desc    Get student's internship data (for parent/teacher)
// @access  Private (Parent, Teacher, Admin)
router.get('/student/:usn', protect, authorize('parent', 'teacher', 'admin'), async (req, res) => {
  try {
    const { usn } = req.params;

    // Authorization check for parents
    if (req.user.role === 'parent' && req.user.linkedStudentUSN !== usn.toUpperCase()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student\'s data'
      });
    }

    const enrollments = await InternshipEnrollment.find({
      studentUSN: usn.toUpperCase()
    }).populate('internshipId');

    const certificates = await InternshipCertificate.find({
      studentUSN: usn.toUpperCase()
    });

    res.status(200).json({
      success: true,
      data: {
        enrollments,
        certificates
      }
    });
  } catch (error) {
    console.error('Error fetching student internships:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student internships',
      error: error.message
    });
  }
});

// @route   GET /api/internships/:id
// @desc    Get single internship details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching internship',
      error: error.message
    });
  }
});

export default router;
