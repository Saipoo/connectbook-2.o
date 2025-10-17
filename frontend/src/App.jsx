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

// Components
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
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

          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
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
  </div>
  );
}

export default App;