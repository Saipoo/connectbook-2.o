import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  MessageSquare,
  FileText,
  BookOpen,
  Award,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  GraduationCap,
  Scan
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import TodaysHighlights from '../../components/dashboard/TodaysHighlights';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentDashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    attendance: { percentage: 0, present: 0, absent: 0, totalClasses: 0 },
    courses: { enrolled: 0, completed: 0, inProgress: 0 },
    certificates: [],
    recentGrades: [],
    recentAttendance: []
  });

  const menuItems = [
    { icon: User, label: 'Profile', path: '/dashboard/student' },
    { icon: Calendar, label: 'Attendance', path: '/dashboard/student/attendance-history' },
    { icon: MessageSquare, label: 'Mentor Connect', path: '/mentor-connect' },
    { icon: FileText, label: 'GradeMaster', path: '/dashboard/student/grade-master' },
    { icon: BookOpen, label: 'CourseMaster', path: '/dashboard/student/course-master' },
    { icon: TrendingUp, label: 'Real-Time Updates', path: '/dashboard/student/updates', badge: true },
    { icon: Award, label: 'Certificates', path: '/dashboard/student/certificates' },
    { divider: true, label: 'Actions' },
    { icon: User, label: 'Register Face', path: '/dashboard/student/face-register' },
    { icon: Clock, label: 'Mark Attendance', path: '/dashboard/student/mark-attendance' },
    { icon: Settings, label: 'Settings', path: '/dashboard/student/settings' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch attendance data
      const attendanceRes = await api.get('/attendance/my-attendance');
      const attendanceData = attendanceRes.data.success 
        ? attendanceRes.data.statistics.overall 
        : { percentage: 0, present: 0, absent: 0, totalClasses: 0 };
      
      // Fetch course enrollment data
      const coursesRes = await api.get('/courses/my-enrollments');
      const enrollments = coursesRes.data.enrollments || [];
      const completedCourses = enrollments.filter(e => e.completed).length;
      
      // Fetch certificates
      const certsRes = await api.get('/courses/my-certificates');
      const certificates = certsRes.data.certificates || [];

      setDashboardData({
        attendance: attendanceData,
        courses: {
          enrolled: enrollments.length,
          completed: completedCourses,
          inProgress: enrollments.length - completedCourses
        },
        certificates: certificates.slice(0, 3),
        recentAttendance: attendanceRes.data.success ? attendanceRes.data.data.slice(0, 5) : []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`${bgColor} rounded-xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${color} p-3 rounded-lg bg-white/50`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
    </motion.div>
  );

  const RecentActivityCard = ({ title, data, emptyMessage }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {item.status === 'present' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {item.subject || item.courseName || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.date || item.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {item.score && (
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {item.score}%
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">{emptyMessage}</p>
      )}
    </motion.div>
  );

  const CertificateCard = ({ certificate }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 shadow-lg cursor-pointer"
      onClick={() => navigate('/dashboard/student/certificates')}
    >
      <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-2" />
      <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
        {certificate.courseName}
      </h4>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Earned: {new Date(certificate.issueDate).toLocaleDateString()}
      </p>
    </motion.div>
  );

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} role="student">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} role="student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-blue-100">
            Here's your academic overview for today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            title="Attendance"
            value={`${dashboardData.attendance.percentage}%`}
            subtitle={`${dashboardData.attendance.present}/${dashboardData.attendance.totalClasses} classes`}
            color="text-green-600"
            bgColor="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30"
            onClick={() => navigate('/dashboard/student/attendance-history')}
          />
          
          <StatCard
            icon={BookOpen}
            title="Courses Enrolled"
            value={dashboardData.courses.enrolled}
            subtitle={`${dashboardData.courses.completed} completed`}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30"
            onClick={() => navigate('/dashboard/student/course-master')}
          />
          
          <StatCard
            icon={GraduationCap}
            title="In Progress"
            value={dashboardData.courses.inProgress}
            subtitle="Active courses"
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30"
            onClick={() => navigate('/dashboard/student/course-dashboard')}
          />
          
          <StatCard
            icon={Award}
            title="Certificates"
            value={dashboardData.certificates.length}
            subtitle="Earned this semester"
            color="text-yellow-600"
            bgColor="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/30"
            onClick={() => navigate('/dashboard/student/certificates')}
          />
        </div>

        {/* Today's Highlights Widget */}
        <TodaysHighlights />

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityCard
            title="Recent Attendance"
            data={dashboardData.recentAttendance}
            emptyMessage="No attendance records yet"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Recent Certificates
            </h3>
            {dashboardData.certificates.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {dashboardData.certificates.map((cert, index) => (
                  <CertificateCard key={index} certificate={cert} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No certificates earned yet
                </p>
                <button
                  onClick={() => navigate('/dashboard/student/course-master')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Courses
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
              onClick={() => navigate('/dashboard/student/face-register')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-100 dark:from-indigo-900/20 dark:to-violet-900/30 hover:shadow-lg transition-all"
            >
              <Scan className="w-8 h-8 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Register Face
              </span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/student/mark-attendance')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 hover:shadow-lg transition-all"
            >
              <Clock className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mark Attendance
              </span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/student/course-master')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30 hover:shadow-lg transition-all"
            >
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Browse Courses
              </span>
            </button>
            
            <button
              onClick={() => navigate('/mentor-connect')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message Teacher
              </span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/student/grade-master')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/30 hover:shadow-lg transition-all"
            >
              <FileText className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Submit Assignment
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardNew;
