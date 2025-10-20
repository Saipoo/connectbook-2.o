import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  Users,
  BookOpen,
  Clock,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  FileText,
  TrendingUp,
  Video,
  Briefcase,
  Code,
  Trophy,
  Film,
  HelpCircle,
  Info,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [timetableRes, logsRes] = await Promise.all([
        api.get('/timetable/my-schedule'),
        api.get('/attendance/logs?limit=5')
      ]);

      if (timetableRes.data.success) {
        setTimetable(timetableRes.data.data);
      }
      if (logsRes.data.success) {
        setRecentLogs(logsRes.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTodaySchedule = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return timetable.filter(entry => entry.day === today);
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

  const todaySchedule = getTodaySchedule();

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
            <BookOpen className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ConnectBook
            </span>
          </div>

          <div className="space-y-2">
            <SidebarLink
              to="/dashboard/teacher/timetable"
              icon={Calendar}
              label="Timetable Management"
            />
            <SidebarLink
              to="/dashboard/teacher/attendance-logs"
              icon={FileText}
              label="Attendance Logs"
            />
            <SidebarLink
              to="/mentor-connect"
              icon={Video}
              label="Mentor Connect"
            />
            <SidebarLink
              to="/dashboard/teacher/grade-evaluator"
              icon={TrendingUp}
              label="GradeEvaluator"
            />
            <SidebarLink
              to="/dashboard/teacher/course-creator"
              icon={BookOpen}
              label="Course Creator"
            />
            <SidebarLink
              to="/dashboard/teacher/interview-evaluations"
              icon={Briefcase}
              label="Interview Evaluations"
            />
            <SidebarLink
              to="/dashboard/teacher/internship-reports"
              icon={Code}
              label="Internship Reports"
            />
            <SidebarLink
              to="/dashboard/teacher/hackathon-reports"
              icon={Trophy}
              label="Hackathon Reports"
            />
            <SidebarLink
              to="/dashboard/teacher/lectures"
              icon={Film}
              label="Lecture Notes"
            />
            <SidebarLink
              to="/dashboard/teacher/faq"
              icon={HelpCircle}
              label="FAQs & Help"
            />
            <SidebarLink
              to="/dashboard/teacher/about"
              icon={Info}
              label="About ConnectBook"
            />
            <SidebarLink
              to="/dashboard/teacher/confessions"
              icon={MessageSquare}
              label="Student Confessions"
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
                  Welcome, {user?.name}! 👩‍🏫
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.department} Department
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={BookOpen}
              label="Subjects Teaching"
              value={user?.subjects?.length || 0}
              color="text-blue-600"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              icon={Calendar}
              label="Today's Classes"
              value={todaySchedule.length}
              color="text-green-600"
              bgColor="bg-green-50 dark:bg-green-900/20"
            />
            <StatCard
              icon={Users}
              label="Total Schedule Entries"
              value={timetable.length}
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
              to="/dashboard/teacher/timetable"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-primary-500 to-primary-700 text-white"
            >
              <Calendar className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Manage Timetable</h3>
              <p className="opacity-90">Create and manage your class schedule</p>
            </Link>

            <Link
              to="/dashboard/teacher/attendance-logs"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-green-500 to-green-700 text-white"
            >
              <FileText className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">View Attendance</h3>
              <p className="opacity-90">Check student attendance records</p>
            </Link>

            <Link
              to="/dashboard/teacher/grade-evaluator"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-orange-500 to-red-500 text-white"
            >
              <FileText className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Grade Evaluator</h3>
              <p className="opacity-90">AI-powered answer script evaluation</p>
            </Link>

            <Link
              to="/dashboard/teacher/course-creator"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            >
              <BookOpen className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Course Creator</h3>
              <p className="opacity-90">Create and manage courses</p>
            </Link>

            <Link
              to="/dashboard/teacher/course-dashboard"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-purple-500 to-pink-600 text-white"
            >
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Course Dashboard</h3>
              <p className="opacity-90">Monitor course enrollments & completions</p>
            </Link>

            <Link
              to="/dashboard/teacher/internship-reports"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
            >
              <Code className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Internship Reports</h3>
              <p className="opacity-90">View student internship progress</p>
            </Link>

            <Link
              to="/dashboard/teacher/hackathon-reports"
              className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-green-600 to-teal-700 text-white"
            >
              <Trophy className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Hackathon Reports</h3>
              <p className="opacity-90">Monitor hackathon participation</p>
            </Link>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-600" />
              Today's Schedule
            </h2>
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{entry.subject}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.class} - {entry.section} | {entry.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{entry.startTime} - {entry.endTime}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{entry.day}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </motion.div>

          {/* Subjects Teaching */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary-600" />
              Subjects You Teach
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user?.subjects?.map((subject, index) => (
                <div
                  key={index}
                  className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
                >
                  <h3 className="font-semibold text-primary-900 dark:text-primary-300">
                    {subject}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Attendance Logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              Recent Attendance Activity
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      USN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {log.usn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {log.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {log.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              log.status === 'Present'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No recent attendance logs
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/dashboard/teacher/attendance-logs"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All Logs →
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
