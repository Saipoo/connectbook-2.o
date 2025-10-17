import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  UserCheck,
  Activity,
  TrendingUp,
  Calendar,
  Shield,
  RefreshCw,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalAttendanceLogs: 0,
    faceRecognitionCount: 0,
    manualCount: 0,
    overallAttendanceRate: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [systemActivities, setSystemActivities] = useState([]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all necessary data
      const [logsResponse, statsResponse] = await Promise.all([
        api.get('/attendance/logs?limit=10'),
        api.get('/attendance/stats')
      ]);

      if (logsResponse.data.success) {
        const logs = logsResponse.data.data;
        setRecentLogs(logs);

        // Calculate stats from logs
        const faceRecognition = logs.filter(log => log.mode === 'Face Recognition').length;
        const manual = logs.filter(log => log.mode === 'Manual').length;
        const present = logs.filter(log => log.status === 'Present').length;
        const attendanceRate = logs.length > 0 ? ((present / logs.length) * 100).toFixed(1) : 0;

        setStats({
          totalStudents: Math.floor(Math.random() * 500) + 200, // Mock data
          totalTeachers: Math.floor(Math.random() * 50) + 20, // Mock data
          totalParents: Math.floor(Math.random() * 400) + 150, // Mock data
          totalAttendanceLogs: logs.length,
          faceRecognitionCount: faceRecognition,
          manualCount: manual,
          overallAttendanceRate: parseFloat(attendanceRate)
        });

        // Generate system activities from logs
        const activities = logs.slice(0, 5).map(log => ({
          action: `${log.name} marked ${log.status.toLowerCase()} for ${log.subject}`,
          time: new Date(log.date).toLocaleString(),
          type: log.mode
        }));
        setSystemActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getUserDistributionData = () => [
    { name: 'Students', value: stats.totalStudents, color: COLORS[0] },
    { name: 'Teachers', value: stats.totalTeachers, color: COLORS[1] },
    { name: 'Parents', value: stats.totalParents, color: COLORS[2] }
  ];

  const getAttendanceModeData = () => [
    { name: 'Face Recognition', value: stats.faceRecognitionCount },
    { name: 'Manual', value: stats.manualCount }
  ];

  const getWeeklyTrendData = () => {
    // Mock data for weekly trend
    return [
      { day: 'Mon', attendance: 85 },
      { day: 'Tue', attendance: 88 },
      { day: 'Wed', attendance: 82 },
      { day: 'Thu', attendance: 90 },
      { day: 'Fri', attendance: 87 },
      { day: 'Sat', attendance: 75 }
    ];
  };

  const getSubjectPerformanceData = () => {
    // Mock data for subject performance
    return [
      { subject: 'Mathematics', present: 120, absent: 20 },
      { subject: 'Physics', present: 110, absent: 30 },
      { subject: 'Chemistry', present: 115, absent: 25 },
      { subject: 'Computer Science', present: 130, absent: 10 },
      { subject: 'English', present: 125, absent: 15 }
    ];
  };

  const exportSystemReport = () => {
    const report = {
      generatedAt: new Date().toLocaleString(),
      stats,
      recentActivities: systemActivities,
      userDistribution: getUserDistributionData(),
      attendanceMode: getAttendanceModeData()
    };

    const reportContent = JSON.stringify(report, null, 2);
    const blob = new Blob([reportContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_report_${new Date().toLocaleDateString()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('System report exported');
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg bg-white dark:bg-gray-800`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  const userDistribution = getUserDistributionData();
  const attendanceModeData = getAttendanceModeData();
  const weeklyTrend = getWeeklyTrendData();
  const subjectPerformance = getSubjectPerformanceData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome, {user?.name} - System Overview & Analytics
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              onClick={exportSystemReport}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Students"
            value={stats.totalStudents}
            color="text-blue-600"
            bgColor="bg-blue-50 dark:bg-blue-900/20"
            trend={5}
          />
          <StatCard
            icon={BookOpen}
            label="Total Teachers"
            value={stats.totalTeachers}
            color="text-green-600"
            bgColor="bg-green-50 dark:bg-green-900/20"
            trend={3}
          />
          <StatCard
            icon={Users}
            label="Total Parents"
            value={stats.totalParents}
            color="text-purple-600"
            bgColor="bg-purple-50 dark:bg-purple-900/20"
            trend={4}
          />
          <StatCard
            icon={UserCheck}
            label="Attendance Rate"
            value={`${stats.overallAttendanceRate}%`}
            color="text-orange-600"
            bgColor="bg-orange-50 dark:bg-orange-900/20"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">User Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attendance Mode Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Attendance Mode Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#94a3b8" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Face Recognition</p>
                <p className="text-2xl font-bold text-blue-600">{stats.faceRecognitionCount}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Manual</p>
                <p className="text-2xl font-bold text-gray-600">{stats.manualCount}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Attendance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Weekly Attendance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={2} name="Attendance %" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Subject-wise Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name="Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* System Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary-600" />
            Recent System Activities
          </h2>
          <div className="space-y-3">
            {systemActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'Face Recognition'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                  }`}
                >
                  {activity.type}
                </span>
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
            <Calendar className="w-6 h-6 text-primary-600" />
            Recent Attendance Logs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    USN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student Name
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mode
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentLogs.map((log, index) => (
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
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.status === 'Present'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.mode === 'Face Recognition'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {log.mode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
