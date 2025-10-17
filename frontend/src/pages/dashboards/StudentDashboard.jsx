import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  ScanFace,
  Clock,
  Calendar,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  CheckCircle,
  XCircle,
  TrendingUp,
  History,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [subjectWise, setSubjectWise] = useState({});

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await api.get('/attendance/my-attendance');
      if (response.data.success) {
        setStats(response.data.statistics.overall);
        setSubjectWise(response.data.statistics.subjectWise);
        setRecentAttendance(response.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg bg-white dark:bg-gray-800`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </motion.div>
  );

  const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="sidebar-link"
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden fixed lg:sticky top-0 h-screen z-40`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <ScanFace className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ConnectBook
            </span>
          </div>

          <div className="space-y-2">
            <SidebarLink
              to="/dashboard/student/face-register"
              icon={ScanFace}
              label="Face Registration"
            />
            <SidebarLink
              to="/dashboard/student/mark-attendance"
              icon={CheckCircle}
              label="Mark Attendance"
            />
            <SidebarLink
              to="/dashboard/student/attendance-history"
              icon={History}
              label="Attendance History"
            />
            <button
              onClick={logout}
              className="sidebar-link w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  USN: {user?.usn} | {user?.department} | {user?.class} - {user?.section}
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              label="Total Classes"
              value={stats.totalClasses}
              color="text-blue-600"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              icon={CheckCircle}
              label="Present"
              value={stats.present}
              color="text-green-600"
              bgColor="bg-green-50 dark:bg-green-900/20"
            />
            <StatCard
              icon={XCircle}
              label="Absent"
              value={stats.absent}
              color="text-red-600"
              bgColor="bg-red-50 dark:bg-red-900/20"
            />
            <StatCard
              icon={TrendingUp}
              label="Attendance %"
              value={`${stats.percentage}%`}
              color="text-purple-600"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Link
              to="/dashboard/student/face-register"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-primary-500 to-primary-700 text-white"
            >
              <ScanFace className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Face Registration</h3>
              <p className="opacity-90">Register your face for automated attendance</p>
            </Link>

            <Link
              to="/dashboard/student/mark-attendance"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-green-500 to-green-700 text-white"
            >
              <CheckCircle className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Mark Attendance</h3>
              <p className="opacity-90">Use facial recognition to mark attendance</p>
            </Link>

            <Link
              to="/dashboard/student/grade-master"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-orange-500 to-red-500 text-white"
            >
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Grade Master</h3>
              <p className="opacity-90">AI-powered answer script evaluation</p>
            </Link>

            <Link
              to="/dashboard/student/course-master"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            >
              <BookOpen className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">CourseMaster</h3>
              <p className="opacity-90">Explore courses and earn certificates</p>
            </Link>

            <Link
              to="/dashboard/student/course-dashboard"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-purple-500 to-pink-600 text-white"
            >
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Learning Dashboard</h3>
              <p className="opacity-90">Track your progress and achievements</p>
            </Link>
          </motion.div>

          {/* Subject-wise Attendance */}
          {Object.keys(subjectWise).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                Subject-wise Attendance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(subjectWise).map(([subject, data]) => (
                  <div
                    key={subject}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <h3 className="font-semibold mb-2">{subject}</h3>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-600">Present: {data.present}</span>
                      <span className="text-red-600">Absent: {data.absent}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {data.percentage}% attendance
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Attendance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-600" />
              Recent Attendance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentAttendance.length > 0 ? (
                    recentAttendance.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {record.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {record.mode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              record.status === 'Present'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No attendance records yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/dashboard/student/attendance-history"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All Records →
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
