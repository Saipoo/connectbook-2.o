# 🎓 Study Planner & Career Advisor - Complete Implementation Guide

## 🌟 Overview

This document describes the implementation of two advanced AI-powered features for ConnectBook:
1. **Study Planner** - AI-powered academic planning and tracking
2. **Career Advisor** - AI-driven career guidance and skill development

Both features are fully integrated with existing modules (Attendance, GradeMaster, CourseMaster, MentorConnect, Interview Simulator, Internship Simulator, Hackathon Simulator).

---

## 📦 What Has Been Created

### ✅ Backend Models (MongoDB Schemas)

1. **`StudyPlan.js`** - Complete study planning system
   - Tasks management (assignments, revision, practice, projects)
   - Goals tracking with progress and milestones
   - AI-generated weekly schedules
   - Pomodoro session tracking
   - Weak subjects identification
   - AI recommendations system
   - Collaboration/sharing features
   - Statistics and streak tracking

2. **`CareerProfile.js`** - Comprehensive career guidance system
   - Career path recommendations with match scores
   - Skill gap analysis and tracking
   - AI resume generation
   - Career quiz results storage
   - Integration data from all modules
   - Mentor connection system
   - Career readiness scoring
   - Parent visibility controls

### ✅ AI Services (Gemini Integration)

1. **`studyPlannerAIService.js`** - Study Planner AI capabilities
   - `generateWeeklySchedule()` - Creates optimized 7-day schedule
   - `analyzeWeakSubjects()` - Identifies struggling areas
   - `generateRecommendations()` - Personalized study advice
   - `optimizePomodoroSession()` - Smart break timing
   - `generateSubjectStudyTips()` - Subject-specific guidance

2. **`careerAdvisorAIService.js`** - Career Advisor AI capabilities
   - `analyzeCareerPaths()` - Recommends top 5 career paths
   - `analyzeSkillGaps()` - Identifies missing skills
   - `generateResume()` - Creates ATS-friendly resume
   - `calculateReadinessScore()` - Career readiness assessment
   - `analyzeQuizResults()` - Quiz insights and recommendations
   - `generateCareerRoadmap()` - Month-by-month development plan

---

## 🔧 Next Steps to Complete Implementation

### Step 1: Create API Routes

You need to create two route files:

#### `backend/routes/studyPlannerRoutes.js`
```javascript
// Endpoints needed:
POST   /api/study-planner/create          // Create new study plan
GET    /api/study-planner/my-plan         // Get student's current plan
PUT    /api/study-planner/update          // Update plan settings
POST   /api/study-planner/task            // Add new task
PUT    /api/study-planner/task/:taskId    // Update/complete task
DELETE /api/study-planner/task/:taskId    // Delete task
POST   /api/study-planner/goal            // Add new goal
PUT    /api/study-planner/goal/:goalId    // Update goal
POST   /api/study-planner/generate-schedule  // AI schedule generation
GET    /api/study-planner/recommendations // Get AI recommendations
POST   /api/study-planner/pomodoro        // Log Pomodoro session
POST   /api/study-planner/share           // Share plan with teacher/parent
GET    /api/study-planner/statistics      // Get study statistics
GET    /api/study-planner/sync-weak-subjects // Sync from GradeMaster
```

#### `backend/routes/careerAdvisorRoutes.js`
```javascript
// Endpoints needed:
POST   /api/career/profile                // Create career profile
GET    /api/career/profile                // Get student's profile
PUT    /api/career/profile                // Update profile
POST   /api/career/analyze                // AI career path analysis
GET    /api/career/recommendations        // Get recommended paths
POST   /api/career/choose-path            // Student chooses career path
POST   /api/career/analyze-skills         // AI skill gap analysis
GET    /api/career/skill-gaps             // Get skill gaps
PUT    /api/career/skill-progress         // Update skill progress
POST   /api/career/generate-resume        // AI resume generation
GET    /api/career/resume                 // Get resume
POST   /api/career/quiz/:quizType         // Submit quiz answers
GET    /api/career/quiz-results           // Get quiz results
POST   /api/career/connect-mentor         // Request mentor connection
GET    /api/career/readiness-score        // Get readiness score
POST   /api/career/sync-data              // Sync from other modules
GET    /api/career/roadmap                // Get career roadmap
```

### Step 2: Register Routes in server.js

Add these imports and routes to `backend/server.js`:

```javascript
import studyPlannerRoutes from './routes/studyPlannerRoutes.js';
import careerAdvisorRoutes from './routes/careerAdvisorRoutes.js';

// After existing routes
app.use('/api/study-planner', studyPlannerRoutes);
app.use('/api/career', careerAdvisorRoutes);
```

### Step 3: Create Frontend Components

#### Study Planner Components (in `frontend/src/pages/student/study-planner/`)

1. **StudyPlanner.jsx** - Main dashboard
   - Overview cards (tasks, goals, streak)
   - Quick actions
   - AI recommendations panel
   - Navigation to sub-pages

2. **ScheduleView.jsx** - Weekly schedule
   - Calendar view with drag-drop
   - Time-blocking interface
   - AI schedule generation button
   - Subject color-coding

3. **TaskManager.jsx** - Task management
   - Task list with filters (status, priority, subject)
   - Add/edit task modal
   - Due date calendar
   - Completion tracking

4. **ProgressDashboard.jsx** - Progress visualization
   - Subject-wise progress charts
   - Goal tracking with progress bars
   - Study hours graph
   - Streak visualization

5. **AIRecommendations.jsx** - AI suggestions
   - Recommendation cards
   - Priority-based sorting
   - Mark as completed
   - Actionable buttons

6. **PomodoroTimer.jsx** - Focus timer
   - Countdown timer
   - Session tracking
   - Break reminders
   - Statistics

#### Career Advisor Components (in `frontend/src/pages/student/career-advisor/`)

1. **CareerAdvisor.jsx** - Main dashboard
   - Career paths overview
   - Readiness score display
   - Quick links to features
   - Progress tracker

2. **CareerPathRecommendations.jsx** - Path selection
   - AI-recommended paths with match scores
   - Detailed path information cards
   - Compare paths feature
   - Choose path button

3. **SkillGapAnalyzer.jsx** - Skills analysis
   - Current skills vs required skills
   - Progress bars for each skill
   - Learning resources links
   - Priority-based ordering

4. **ResumeBuilder.jsx** - AI resume
   - Resume preview
   - Edit sections
   - Download PDF button
   - Tips sidebar

5. **CareerQuiz.jsx** - Assessment quizzes
   - Multi-step quiz interface
   - Progress indicator
   - Results analysis
   - Recommendations based on results

6. **CareerDashboard.jsx** - Overview
   - Chosen career paths
   - Skill development progress
   - Upcoming milestones
   - Mentor connections

### Step 4: Update Navigation

#### Student Sidebar (in `frontend/src/components/StudentSidebar.jsx`)

Add these menu items:

```javascript
{
  title: 'Study Planner',
  icon: <Calendar className="w-5 h-5" />,
  path: '/dashboard/student/study-planner',
  submenu: [
    { title: 'My Plan', path: '/dashboard/student/study-planner' },
    { title: 'Schedule', path: '/dashboard/student/study-planner/schedule' },
    { title: 'Tasks', path: '/dashboard/student/study-planner/tasks' },
    { title: 'Progress', path: '/dashboard/student/study-planner/progress' },
    { title: 'Pomodoro', path: '/dashboard/student/study-planner/pomodoro' }
  ]
},
{
  title: 'Career Advisor',
  icon: <Briefcase className="w-5 h-5" />,
  path: '/dashboard/student/career',
  submenu: [
    { title: 'Dashboard', path: '/dashboard/student/career' },
    { title: 'Career Paths', path: '/dashboard/student/career/paths' },
    { title: 'Skill Gaps', path: '/dashboard/student/career/skills' },
    { title: 'Resume Builder', path: '/dashboard/student/career/resume' },
    { title: 'Career Quiz', path: '/dashboard/student/career/quiz' }
  ]
}
```

#### Parent Dashboard

Add overview cards showing:
- Student's study streak and weekly hours
- Current study goals and completion rate
- Chosen career paths
- Career readiness score
- Upcoming tasks and deadlines

#### Teacher Dashboard

Add section showing:
- Shared study plans from students
- Comment/feedback on plans
- Track student progress
- Career path recommendations they can view

### Step 5: Integration with Existing Modules

#### Integration Code Examples:

**1. Sync Weak Subjects from GradeMaster:**
```javascript
// In studyPlannerRoutes.js
router.get('/sync-weak-subjects', protect, authorize('student'), async (req, res) => {
  // Fetch grades from GradeMaster
  const grades = await Grade.find({ usn: req.user.usn });
  
  // Analyze weak subjects (below 60%)
  const weakSubjects = grades
    .filter(g => g.marks < 60)
    .map(g => ({
      subject: g.subject,
      currentGrade: g.marks,
      targetGrade: 75,
      recommendedHoursPerWeek: Math.ceil((75 - g.marks) / 5)
    }));
  
  // Update study plan
  await StudyPlan.findOneAndUpdate(
    { usn: req.user.usn },
    { weakSubjects },
    { upsert: true }
  );
  
  // Generate AI recommendations
  const recommendations = await studyPlannerAIService.generateRecommendations({
    weakSubjects,
    // ... other data
  });
});
```

**2. Sync Career Data from All Modules:**
```javascript
// In careerAdvisorRoutes.js
router.post('/sync-data', protect, authorize('student'), async (req, res) => {
  const profile = await CareerProfile.findOne({ usn: req.user.usn });
  
  // Sync from GradeMaster
  const grades = await Grade.find({ usn: req.user.usn });
  profile.integrationData.academicPerformance = {
    overallGPA: calculateGPA(grades),
    subjectWiseGrades: extractSubjectGrades(grades),
    strongSubjects: identifyStrongSubjects(grades),
    weakSubjects: identifyWeakSubjects(grades),
    lastSynced: new Date()
  };
  
  // Sync from CourseMaster
  const completedCourses = await CourseEnrollment.find({
    studentUSN: req.user.usn,
    completed: true
  }).populate('courseId');
  
  // Sync from Internship Simulator
  const internships = await InternshipEnrollment.find({
    usn: req.user.usn
  });
  
  // Sync from Interview Simulator
  const interviews = await InterviewSession.find({
    usn: req.user.usn
  });
  
  await profile.save();
  
  // Trigger AI analysis with updated data
  const careerRecommendations = await careerAdvisorAIService.analyzeCareerPaths({
    academicPerformance: profile.integrationData.academicPerformance,
    completedCourses: profile.integrationData.completedCourses,
    // ... other data
  });
});
```

---

## 🎨 UI/UX Design Guidelines

### Color Scheme
- Study Planner: Blue/Indigo theme (focus, productivity)
- Career Advisor: Purple/Teal theme (growth, future)

### Key Components to Use
- **Charts**: Use recharts or chart.js for progress visualization
- **Calendar**: Use react-big-calendar or custom calendar
- **Drag & Drop**: Use react-beautiful-dnd for task management
- **Timer**: Custom Pomodoro component with circular progress
- **Cards**: Framer Motion animated cards for recommendations

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly buttons and sliders
- Swipe gestures for task completion

---

## 🔐 Access Control

### Student Access
- Full CRUD on their own study plans and career profiles
- Can share plans with teachers/parents
- View AI recommendations
- Take quizzes
- Connect with mentors

### Parent Access
- View-only access to student's:
  - Study plan overview
  - Weekly schedule
  - Task completion rate
  - Career paths chosen
  - Readiness score
- Based on `parentVisibility` settings in CareerProfile

### Teacher Access
- View shared study plans
- Add comments/feedback
- Suggest learning resources
- View career paths for guidance
- No direct edit access

### Admin Access
- View all data
- Generate reports
- Monitor AI service usage

---

## 📊 Database Collections Summary

### `studyplans`
- Stores all study planning data
- One active plan per student per semester
- Indexed on: `usn`, `semester`, `academicYear`

### `careerprofiles`
- Stores career guidance data
- One profile per student (lifetime)
- Indexed on: `usn`, `chosenPaths.title`

---

## 🧪 Testing Checklist

### Study Planner
- [ ] Create study plan
- [ ] Add tasks with different priorities
- [ ] Generate AI schedule
- [ ] Complete tasks and track progress
- [ ] Set goals and milestones
- [ ] Use Pomodoro timer
- [ ] Get AI recommendations
- [ ] Share plan with parent/teacher
- [ ] View statistics and streak

### Career Advisor
- [ ] Create career profile
- [ ] Get AI career recommendations
- [ ] Choose career paths
- [ ] Analyze skill gaps
- [ ] Update skill progress
- [ ] Generate AI resume
- [ ] Take career quiz
- [ ] View readiness score
- [ ] Connect with mentor
- [ ] Sync data from other modules

---

## 🚀 Deployment Notes

1. **Environment Variables**: Ensure `GEMINI_API_KEY` is set
2. **Database Indexes**: Run index creation on first deploy
3. **Cron Jobs**: Set up daily AI sync jobs
4. **Rate Limiting**: Add rate limits for AI service calls
5. **Caching**: Cache AI responses for 24 hours
6. **Monitoring**: Track AI API usage and costs

---

## 📈 Future Enhancements

1. **Study Planner**
   - Group study sessions
   - Study material library
   - Flashcard generation
   - Voice-activated task addition
   - Mobile app with notifications

2. **Career Advisor**
   - Job market trends integration
   - Salary negotiation tips
   - Interview preparation specific to company
   - Alumni network connections
   - Virtual career fairs

---

## 🆘 Troubleshooting

### Common Issues

1. **AI Service Not Responding**
   - Check GEMINI_API_KEY
   - Verify API quota
   - Check internet connection

2. **Data Not Syncing**
   - Check module integration endpoints
   - Verify user permissions
   - Check database connections

3. **Schedule Generation Fails**
   - Ensure student has subjects assigned
   - Check for valid preferences
   - Verify attendance data exists

---

## 📝 Code Examples

### Example: Complete Task Endpoint

```javascript
router.put('/task/:taskId', protect, authorize('student'), async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({ usn: req.user.usn });
    
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
    
    // Update task
    task.status = 'completed';
    task.completedAt = new Date();
    task.completedHours = req.body.hoursSpent || task.estimatedHours;
    
    // Update statistics
    studyPlan.stats.totalTasksCompleted += 1;
    studyPlan.stats.totalStudyHours += task.completedHours;
    
    // Update streak
    studyPlan.updateStreak();
    
    // Save
    await studyPlan.save();
    
    res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      data: {
        task,
        stats: studyPlan.stats
      }
    });
    
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing task',
      error: error.message
    });
  }
});
```

---

## 📚 Documentation Files Created

1. ✅ `StudyPlan.js` - MongoDB model
2. ✅ `CareerProfile.js` - MongoDB model
3. ✅ `studyPlannerAIService.js` - AI service
4. ✅ `careerAdvisorAIService.js` - AI service
5. ✅ `STUDY_PLANNER_CAREER_ADVISOR_GUIDE.md` - This documentation

---

## 🎯 Summary

You now have:
- ✅ Complete backend models with all fields and methods
- ✅ Full AI services with Gemini integration
- ✅ Detailed implementation guide
- ✅ API endpoint specifications
- ✅ Frontend component structure
- ✅ Integration strategies
- ✅ Testing checklists

**Next Steps:**
1. Create the API route files
2. Build the frontend components
3. Update navigation and dashboards
4. Test integration with existing modules
5. Deploy and monitor

Good luck with the implementation! 🚀
