# 🚀 Quick Start Guide - Study Planner & Career Advisor

## ✅ What's Already Done

I've created the foundational backend architecture for both features:

### 1. **Backend Models** ✅ COMPLETE
- `backend/models/StudyPlan.js` - Full study planning system
- `backend/models/CareerProfile.js` - Complete career guidance system

### 2. **AI Services** ✅ COMPLETE
- `backend/services/studyPlannerAIService.js` - 5 AI methods ready
- `backend/services/careerAdvisorAIService.js` - 6 AI methods ready

### 3. **Documentation** ✅ COMPLETE
- `STUDY_PLANNER_CAREER_ADVISOR_GUIDE.md` - Comprehensive implementation guide

---

## 🎯 What You Need to Do Next

### Priority 1: Backend Routes (IMMEDIATE)

Create two new files:

#### File 1: `backend/routes/studyPlannerRoutes.js`

```javascript
import express from 'express';
import StudyPlan from '../models/StudyPlan.js';
import Student from '../models/Student.js';
import Grade from '../models/Grade.js'; // For GradeMaster integration
import { protect, authorize } from '../middleware/auth.js';
import studyPlannerAIService from '../services/studyPlannerAIService.js';

const router = express.Router();

// @route   POST /api/study-planner/create
// @desc    Create new study plan for current semester
// @access  Private (Student)
router.post('/create', protect, authorize('student'), async (req, res) => {
  try {
    const { semester, academicYear, preferences } = req.body;
    
    // Check if plan already exists
    const existingPlan = await StudyPlan.findOne({
      usn: req.user.usn,
      semester,
      academicYear,
      isActive: true
    });
    
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: 'Active study plan already exists for this semester'
      });
    }
    
    // Create new plan
    const studyPlan = await StudyPlan.create({
      usn: req.user.usn,
      semester,
      academicYear,
      preferences: preferences || {},
      tasks: [],
      goals: [],
      weeklySchedule: [],
      aiRecommendations: [],
      pomodoroSessions: []
    });
    
    res.status(201).json({
      success: true,
      message: 'Study plan created successfully',
      data: studyPlan
    });
    
  } catch (error) {
    console.error('Error creating study plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating study plan',
      error: error.message
    });
  }
});

// @route   GET /api/study-planner/my-plan
// @desc    Get student's current study plan
// @access  Private (Student)
router.get('/my-plan', protect, authorize('student'), async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      usn: req.user.usn,
      isActive: true
    }).sort({ createdAt: -1 });
    
    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'No active study plan found. Please create one.'
      });
    }
    
    // Calculate progress
    const progress = studyPlan.calculateProgress();
    
    // Get overdue tasks
    const overdueTasks = studyPlan.getOverdueTasks();
    
    // Get upcoming tasks
    const upcomingTasks = studyPlan.getUpcomingTasks(7);
    
    res.status(200).json({
      success: true,
      data: {
        plan: studyPlan,
        progress,
        overdueTasks,
        upcomingTasks
      }
    });
    
  } catch (error) {
    console.error('Error fetching study plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching study plan',
      error: error.message
    });
  }
});

// @route   POST /api/study-planner/task
// @desc    Add new task
// @access  Private (Student)
router.post('/task', protect, authorize('student'), async (req, res) => {
  try {
    const { title, description, subject, priority, type, dueDate, estimatedHours } = req.body;
    
    const studyPlan = await StudyPlan.findOne({
      usn: req.user.usn,
      isActive: true
    });
    
    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }
    
    // Add task
    studyPlan.tasks.push({
      title,
      description,
      subject,
      priority: priority || 'medium',
      type,
      dueDate,
      estimatedHours: estimatedHours || 1,
      status: 'pending',
      aiGenerated: false
    });
    
    await studyPlan.save();
    
    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      data: studyPlan.tasks[studyPlan.tasks.length - 1]
    });
    
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding task',
      error: error.message
    });
  }
});

// @route   PUT /api/study-planner/task/:taskId
// @desc    Update/complete task
// @access  Private (Student)
router.put('/task/:taskId', protect, authorize('student'), async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      usn: req.user.usn,
      isActive: true
    });
    
    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }
    
    const task = studyPlan.tasks.id(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Update task fields
    if (req.body.status) task.status = req.body.status;
    if (req.body.completedHours) task.completedHours = req.body.completedHours;
    if (req.body.notes) task.notes = req.body.notes;
    
    // If marking as completed
    if (req.body.status === 'completed') {
      task.completedAt = new Date();
      studyPlan.stats.totalTasksCompleted += 1;
      studyPlan.stats.totalStudyHours += task.completedHours || task.estimatedHours;
      studyPlan.updateStreak();
      
      // Update subject-wise hours
      if (!studyPlan.stats.subjectWiseHours) {
        studyPlan.stats.subjectWiseHours = new Map();
      }
      const currentHours = studyPlan.stats.subjectWiseHours.get(task.subject) || 0;
      studyPlan.stats.subjectWiseHours.set(
        task.subject, 
        currentHours + (task.completedHours || task.estimatedHours)
      );
    }
    
    await studyPlan.save();
    
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task,
        stats: studyPlan.stats
      }
    });
    
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

// @route   POST /api/study-planner/generate-schedule
// @desc    Generate AI-powered weekly schedule
// @access  Private (Student)
router.post('/generate-schedule', protect, authorize('student'), async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      usn: req.user.usn,
      isActive: true
    });
    
    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }
    
    // Gather student data for AI
    const student = await Student.findOne({ usn: req.user.usn });
    const grades = await Grade.find({ usn: req.user.usn });
    
    const studentData = {
      subjects: student.subjects || [],
      weakSubjects: studyPlan.weakSubjects,
      attendanceData: {}, // Integrate with Attendance module
      upcomingExams: req.body.upcomingExams || [],
      assignments: studyPlan.tasks.filter(t => t.type === 'assignment' && t.status !== 'completed'),
      preferences: studyPlan.preferences
    };
    
    // Generate schedule using AI
    const result = await studyPlannerAIService.generateWeeklySchedule(studentData);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }
    
    // Save schedule
    studyPlan.weeklySchedule = result.schedule;
    studyPlan.lastAISync = new Date();
    await studyPlan.save();
    
    res.status(200).json({
      success: true,
      message: 'Schedule generated successfully',
      data: result.schedule
    });
    
  } catch (error) {
    console.error('Error generating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating schedule',
      error: error.message
    });
  }
});

// ADD MORE ENDPOINTS AS NEEDED...

export default router;
```

#### File 2: `backend/routes/careerAdvisorRoutes.js`

```javascript
import express from 'express';
import CareerProfile from '../models/CareerProfile.js';
import Student from '../models/Student.js';
import Grade from '../models/Grade.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import InternshipEnrollment from '../models/InternshipEnrollment.js';
import { protect, authorize } from '../middleware/auth.js';
import careerAdvisorAIService from '../services/careerAdvisorAIService.js';

const router = express.Router();

// @route   POST /api/career/profile
// @desc    Create career profile
// @access  Private (Student)
router.post('/profile', protect, authorize('student'), async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await CareerProfile.findOne({ usn: req.user.usn });
    
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Career profile already exists. Use PUT to update.'
      });
    }
    
    // Create new profile
    const profile = await CareerProfile.create({
      usn: req.user.usn,
      interests: req.body.interests || [],
      chosenPaths: [],
      recommendedPaths: [],
      currentSkills: [],
      skillGaps: [],
      readinessScore: {
        overall: 0,
        technical: 0,
        softSkills: 0,
        experience: 0
      },
      parentVisibility: {
        showCareerPaths: true,
        showReadinessScore: true,
        showSkillGaps: true,
        showResume: false
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Career profile created successfully',
      data: profile
    });
    
  } catch (error) {
    console.error('Error creating career profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating career profile',
      error: error.message
    });
  }
});

// @route   GET /api/career/profile
// @desc    Get student's career profile
// @access  Private (Student)
router.get('/profile', protect, authorize('student'), async (req, res) => {
  try {
    const profile = await CareerProfile.findOne({ usn: req.user.usn });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found. Please create one.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
    
  } catch (error) {
    console.error('Error fetching career profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching career profile',
      error: error.message
    });
  }
});

// @route   POST /api/career/analyze
// @desc    AI-powered career path analysis
// @access  Private (Student)
router.post('/analyze', protect, authorize('student'), async (req, res) => {
  try {
    let profile = await CareerProfile.findOne({ usn: req.user.usn });
    
    if (!profile) {
      // Create profile if doesn't exist
      profile = await CareerProfile.create({
        usn: req.user.usn,
        interests: [],
        chosenPaths: []
      });
    }
    
    // Sync integration data first
    await syncIntegrationData(profile);
    
    // Prepare student data for AI
    const studentData = {
      academicPerformance: profile.integrationData.academicPerformance,
      completedCourses: profile.integrationData.completedCourses,
      internshipExperience: profile.integrationData.internshipExperience,
      interviewPerformance: profile.integrationData.interviewPerformance,
      interests: profile.interests,
      currentSkills: profile.currentSkills
    };
    
    // Get AI recommendations
    const result = await careerAdvisorAIService.analyzeCareerPaths(studentData);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }
    
    // Save recommendations
    profile.recommendedPaths = result.recommendations;
    profile.lastAIAnalysis = new Date();
    await profile.save();
    
    res.status(200).json({
      success: true,
      message: 'Career paths analyzed successfully',
      data: result.recommendations
    });
    
  } catch (error) {
    console.error('Error analyzing career paths:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing career paths',
      error: error.message
    });
  }
});

// Helper function to sync data from other modules
async function syncIntegrationData(profile) {
  // Sync from GradeMaster
  const grades = await Grade.find({ usn: profile.usn });
  // Calculate GPA and identify strong/weak subjects
  // ...
  
  // Sync from CourseMaster
  const enrollments = await CourseEnrollment.find({ studentUSN: profile.usn, completed: true });
  // ...
  
  // Sync from Internship Simulator
  const internships = await InternshipEnrollment.find({ usn: profile.usn });
  // ...
  
  // Save updated data
  await profile.save();
}

// ADD MORE ENDPOINTS AS NEEDED...

export default router;
```

### Priority 2: Register Routes in `backend/server.js`

Add these lines after your existing route imports:

```javascript
import studyPlannerRoutes from './routes/studyPlannerRoutes.js';
import careerAdvisorRoutes from './routes/careerAdvisorRoutes.js';

// After other app.use statements
app.use('/api/study-planner', studyPlannerRoutes);
app.use('/api/career', careerAdvisorRoutes);
```

### Priority 3: Test Backend APIs

Use Postman or Thunder Client to test:

1. **Create Study Plan:**
   - POST `http://localhost:5000/api/study-planner/create`
   - Body: `{ "semester": "5", "academicYear": "2024-2025" }`

2. **Get Study Plan:**
   - GET `http://localhost:5000/api/study-planner/my-plan`

3. **Create Career Profile:**
   - POST `http://localhost:5000/api/career/profile`
   - Body: `{ "interests": [{"area": "Software Development", "level": "high"}] }`

4. **Analyze Career Paths:**
   - POST `http://localhost:5000/api/career/analyze`

---

## 📋 Complete Implementation Checklist

### Backend ✅ (DONE)
- [x] StudyPlan model
- [x] CareerProfile model
- [x] Study Planner AI service
- [x] Career Advisor AI service
- [ ] Study Planner routes (IN PROGRESS)
- [ ] Career Advisor routes (IN PROGRESS)
- [ ] Integration with existing modules

### Frontend 🔨 (TODO)
- [ ] Study Planner components (6 components)
- [ ] Career Advisor components (6 components)
- [ ] Update navigation
- [ ] Update parent dashboard
- [ ] Update teacher dashboard

### Testing 🧪 (TODO)
- [ ] API endpoint testing
- [ ] Frontend component testing
- [ ] Integration testing
- [ ] Parent/Teacher view testing

---

## 💡 Pro Tips

1. **Start Small**: Implement one feature at a time
2. **Test AI First**: Make sure Gemini API key works
3. **Use Postman**: Test all APIs before building frontend
4. **Check Integrations**: Ensure data from GradeMaster/CourseMaster flows correctly
5. **Mobile-First**: Design for mobile, then scale up

---

## 🆘 Need Help?

Refer to the main guide: `STUDY_PLANNER_CAREER_ADVISOR_GUIDE.md`

It contains:
- Detailed API specifications
- Frontend component structure
- Integration strategies
- Code examples
- Troubleshooting guide

---

## 🎉 You're Ready!

The foundation is solid. Now just:
1. Create the route files (copy the examples above)
2. Test the APIs
3. Build the frontend components
4. Integrate with existing modules

Good luck! 🚀
