import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import StudentDashboardNew from './pages/dashboards/StudentDashboardNew';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import TeacherDashboardNew from './pages/dashboards/TeacherDashboardNew';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import ParentDashboardNew from './pages/dashboards/ParentDashboardNew';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import CertificatesPage from './pages/student/CertificatesPage';
import FaceRegister from './pages/student/FaceRegister';
import MarkAttendance from './pages/student/MarkAttendance';
import AttendanceHistory from './pages/student/AttendanceHistory';
import TimetableManagement from './pages/teacher/TimetableManagement';
import AttendanceLogs from './pages/teacher/AttendanceLogs';
import MentorConnect from './pages/MentorConnect';
import VideoMeeting from './pages/VideoMeeting';
import GradeMaster from './pages/student/GradeMaster';
import GradeEvaluator from './pages/teacher/GradeEvaluator';
import GradeViewer from './pages/parent/GradeViewer';
import CourseMaster from './pages/student/CourseMaster';
import CourseCreator from './pages/teacher/CourseCreator';
import CourseDashboard from './pages/teacher/CourseDashboard';
import StudentCourseDashboard from './pages/student/StudentCourseDashboard';
import InterviewSimulator from './pages/student/InterviewSimulator';
import LiveInterviewSession from './pages/student/LiveInterviewSession';
import InterviewResults from './pages/student/InterviewResults';
import TeacherInterviewEvaluations from './pages/teacher/TeacherInterviewEvaluations';
import InternshipReports from './pages/teacher/InternshipReports';
import HackathonReports from './pages/teacher/HackathonReports';
import InternshipSimulator from './pages/student/internship/InternshipSimulator';
import InternshipWorkspace from './pages/student/internship/InternshipWorkspace';
import TaskSubmission from './pages/student/internship/TaskSubmission';
import HackathonChallenges from './pages/student/hackathon/HackathonChallenges';
import HackathonDetails from './pages/student/hackathon/HackathonDetails';
import ProjectRoom from './pages/student/hackathon/ProjectRoom';
import Leaderboard from './pages/student/hackathon/Leaderboard';
import StudyPlanner from './pages/student/StudyPlanner';
import CareerAdvisor from './pages/student/CareerAdvisor';
import ResumeBuilder from './pages/student/ResumeBuilder';
import StudentLectures from './pages/student/StudentLectures';
import RealTimeUpdates from './pages/student/RealTimeUpdates';
import TeacherLectures from './pages/teacher/TeacherLectures';
import FAQPage from './pages/FAQPage_Simple';
import AboutPage from './pages/AboutPage';
import TeacherConfessionPage from './pages/TeacherConfessionPage';
import ParentWellbeingPage from './pages/ParentWellbeingPage';
import AdminConfessionPage from './pages/AdminConfessionPage';
import MyConfessionsPage from './pages/MyConfessionsPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import FloatingChatbot from './components/chatbot/FloatingChatbot';

// Hook to get user role
import { useState, useEffect } from 'react';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
  }, []);

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/face-register" element={
            <ProtectedRoute allowedRoles={['student']}>
              <FaceRegister />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/mark-attendance" element={
            <ProtectedRoute allowedRoles={['student']}>
              <MarkAttendance />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/attendance-history" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AttendanceHistory />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/grade-master" element={
            <ProtectedRoute allowedRoles={['student']}>
              <GradeMaster />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/course-master" element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseMaster />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/course-dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCourseDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/certificates" element={
            <ProtectedRoute allowedRoles={['student']}>
              <CertificatesPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/interview" element={
            <ProtectedRoute allowedRoles={['student']}>
              <InterviewSimulator />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/interview/session/:sessionId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <LiveInterviewSession />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/interview/results/:reportId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <InterviewResults />
            </ProtectedRoute>
          } />
          
          {/* Internship Routes */}
          <Route path="/dashboard/student/internship" element={
            <ProtectedRoute allowedRoles={['student']}>
              <InternshipSimulator />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/internship/:enrollmentId/workspace" element={
            <ProtectedRoute allowedRoles={['student']}>
              <InternshipWorkspace />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/internship/task/:taskId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <TaskSubmission />
            </ProtectedRoute>
          } />

          {/* Hackathon Routes */}
          <Route path="/dashboard/student/hackathon" element={
            <ProtectedRoute allowedRoles={['student']}>
              <HackathonChallenges />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/hackathon/:hackathonId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <HackathonDetails />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/hackathon/:hackathonId/room" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProjectRoom />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/hackathon/:hackathonId/leaderboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Leaderboard />
            </ProtectedRoute>
          } />

          {/* Study Planner & Career Advisor Routes */}
          <Route path="/dashboard/student/study-planner" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudyPlanner />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/career-advisor" element={
            <ProtectedRoute allowedRoles={['student']}>
              <CareerAdvisor />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/resume-builder" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/lectures" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLectures />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/updates" element={
            <ProtectedRoute allowedRoles={['student']}>
              <RealTimeUpdates />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/faq" element={
            <ProtectedRoute allowedRoles={['student']}>
              <FAQPage userRole="student" />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/about" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AboutPage userRole="student" />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/my-confessions" element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyConfessionsPage />
            </ProtectedRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/dashboard/teacher" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/timetable" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TimetableManagement />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/attendance-logs" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AttendanceLogs />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/grade-evaluator" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <GradeEvaluator />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/course-creator" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <CourseCreator />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/course-dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <CourseDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/interview-evaluations" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherInterviewEvaluations />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/interview-report/:reportId" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <InterviewResults />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/internship-reports" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <InternshipReports />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/hackathon-reports" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <HackathonReports />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/lectures" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLectures />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/faq" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <FAQPage userRole="teacher" />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/about" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AboutPage userRole="teacher" />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/teacher/confessions" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherConfessionPage />
            </ProtectedRoute>
          } />

          {/* Parent Routes */}
          <Route path="/dashboard/parent" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/parent/grade-viewer" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <GradeViewer />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/parent/certificates" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <CertificatesPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/parent/faq" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <FAQPage userRole="parent" />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/parent/about" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <AboutPage userRole="parent" />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/parent/student-wellbeing" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentWellbeingPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/confessions" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminConfessionPage />
            </ProtectedRoute>
          } />

          {/* Mentor Connect Routes */}
          <Route path="/mentor-connect" element={
            <ProtectedRoute allowedRoles={['teacher', 'parent']}>
              <MentorConnect />
            </ProtectedRoute>
          } />
          <Route path="/meeting/:meetingId" element={
            <ProtectedRoute allowedRoles={['teacher', 'parent']}>
              <VideoMeeting />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />

      {/* Floating Chatbot - Available on all pages for authenticated users */}
      {userRole && <FloatingChatbot userRole={userRole} />}
  </div>
  );
}

export default App;