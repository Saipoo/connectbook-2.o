import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  MessageSquare,
  FileCheck,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  GraduationCap
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TeacherDashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    courses: { created: 0, published: 0, totalEnrollments: 0 },
    submissions: { pending: 0, verified: 0, total: 0 },
    students: { active: 0, total: 0 },
    messages: { unread: 0 },
    recentSubmissions: [],
    topCourses: []
  });

  const menuItems = [
    { icon: User, label: 'Profile', path: '/dashboard/teacher' },
    { icon: Calendar, label: 'Attendance Overview', path: '/dashboard/teacher/attendance-logs' },
    { icon: Clock, label: 'Timetable', path: '/dashboard/teacher/timetable' },
    { icon: MessageSquare, label: 'Mentor Connect', path: '/mentor-connect' },
    { divider: true, label: 'Academic' },
    { icon: FileCheck, label: 'GradeMaster Verification', path: '/dashboard/teacher/grade-evaluator' },
    { icon: BookOpen, label: 'Create Course', path: '/dashboard/teacher/course-creator' },
    { icon: BarChart3, label: 'Course Dashboard', path: '/dashboard/teacher/course-dashboard' },
    { icon: Users, label: 'Student Progress', path: '/dashboard/teacher/student-progress' },
    { divider: true, label: 'Settings' },
    { icon: Settings, label: 'Settings', path: '/dashboard/teacher/settings' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch teacher's courses
      const coursesRes = await api.get('/courses/teacher/my-courses');
      const courses = coursesRes.data.courses || [];
      const publishedCourses = courses.filter(c => c.published).length;
      
      // Calculate total enrollments
      let totalEnrollments = 0;
      courses.forEach(course => {
        totalEnrollments += course.enrollmentCount || 0;
      });

      // Fetch pending submissions
      const submissionsRes = await api.get('/grades/teacher/submissions');
      const submissions = submissionsRes.data.submissions || [];
      const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

      setDashboardData({
        courses: {
          created: courses.length,
          published: publishedCourses,
          totalEnrollments: totalEnrollments
        },
        submissions: {
          pending: pendingSubmissions,
          verified: submissions.length - pendingSubmissions,
          total: submissions.length
        },
        students: {
          active: totalEnrollments,
          total: totalEnrollments
        },
        messages: {
          unread: 0
        },
        recentSubmissions: submissions.slice(0, 5),
        topCourses: courses.slice(0, 3)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor, onClick, badge }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`${bgColor} rounded-xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl relative`}
    >
      {badge && (
        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`${color} p-3 rounded-lg bg-white/50`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
    </motion.div>
  );

  const RecentSubmissionCard = ({ submission }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        {submission.status === 'pending' ? (
          <AlertCircle className="w-5 h-5 text-orange-500" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        <div>
          <p className="font-medium text-gray-800 dark:text-white">
            {submission.studentName || 'Unknown Student'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {submission.subject || 'Assignment'} • {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate('/dashboard/teacher/grade-evaluator')}
        className={`px-3 py-1 rounded-lg text-xs font-medium ${
          submission.status === 'pending'
            ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            : 'bg-green-100 text-green-600'
        }`}
      >
        {submission.status === 'pending' ? 'Review' : 'View'}
      </button>
    </div>
  );

  const CourseCard = ({ course }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg cursor-pointer"
      onClick={() => navigate('/dashboard/teacher/course-dashboard')}
    >
      <div className="flex items-center justify-between mb-3">
        <BookOpen className="w-8 h-8 text-blue-600" />
        {course.published && (
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            Published
          </span>
        )}
      </div>
      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
        {course.title}
      </h4>
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>{course.enrollmentCount || 0} students</span>
        <span>{course.category}</span>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} role="teacher">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} role="teacher">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}! 👨‍🏫
          </h2>
          <p className="text-blue-100">
            {dashboardData.submissions.pending > 0 
              ? `You have ${dashboardData.submissions.pending} submissions awaiting verification`
              : 'All caught up! No pending submissions'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BookOpen}
            title="Courses Created"
            value={dashboardData.courses.created}
            subtitle={`${dashboardData.courses.published} published`}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30"
            onClick={() => navigate('/dashboard/teacher/course-dashboard')}
          />
          
          <StatCard
            icon={Users}
            title="Total Enrollments"
            value={dashboardData.courses.totalEnrollments}
            subtitle="Across all courses"
            color="text-green-600"
            bgColor="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30"
            onClick={() => navigate('/dashboard/teacher/student-progress')}
          />
          
          <StatCard
            icon={FileCheck}
            title="Pending Reviews"
            value={dashboardData.submissions.pending}
            subtitle={`${dashboardData.submissions.verified} completed`}
            color="text-orange-600"
            bgColor="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30"
            onClick={() => navigate('/dashboard/teacher/grade-evaluator')}
            badge={dashboardData.submissions.pending > 0 ? dashboardData.submissions.pending : null}
          />
          
          <StatCard
            icon={MessageSquare}
            title="Messages"
            value={dashboardData.messages.unread}
            subtitle="From students & parents"
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30"
            onClick={() => navigate('/mentor-connect')}
          />
        </div>

        {/* Recent Submissions & Top Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Recent Submissions
              </h3>
              <button
                onClick={() => navigate('/dashboard/teacher/grade-evaluator')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
            {dashboardData.recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentSubmissions.map((submission, index) => (
                  <RecentSubmissionCard key={index} submission={submission} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No submissions yet
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Your Courses
              </h3>
              <button
                onClick={() => navigate('/dashboard/teacher/course-creator')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create New
              </button>
            </div>
            {dashboardData.topCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {dashboardData.topCourses.map((course, index) => (
                  <CourseCard key={index} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No courses created yet
                </p>
                <button
                  onClick={() => navigate('/dashboard/teacher/course-creator')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Your First Course
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/dashboard/teacher/course-creator')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30 hover:shadow-lg transition-all"
            >
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Create Course
              </span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/teacher/grade-evaluator')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30 hover:shadow-lg transition-all"
            >
              <FileCheck className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Verify Submissions
              </span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/teacher/attendance-logs')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 hover:shadow-lg transition-all"
            >
              <Calendar className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                View Attendance
              </span>
            </button>
            
            <button
              onClick={() => navigate('/mentor-connect')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Messages
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboardNew;
