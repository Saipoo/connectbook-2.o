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
  CheckCircle,
  XCircle,
  Download,
  Eye,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ParentDashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    attendance: { percentage: 0, present: 0, absent: 0, totalClasses: 0 },
    courses: { completed: 0, inProgress: 0, total: 0 },
    grades: { recent: [], average: 0 },
    certificates: []
  });

  const menuItems = [
    { icon: User, label: 'Child Profile', path: '/dashboard/parent' },
    { icon: FileText, label: 'GradeMaster Results', path: '/dashboard/parent/grade-viewer' },
    { icon: Award, label: 'Certificates', path: '/dashboard/parent/certificates' },
    { icon: MessageSquare, label: 'Mentor Connect', path: '/mentor-connect' },
    { divider: true, label: 'Settings' },
    { icon: Settings, label: 'Settings', path: '/dashboard/parent' }
  ];

  useEffect(() => {
    fetchParentDashboardData();
  }, []);

  const fetchParentDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch linked student data
      const studentRes = await api.get('/parents/my-student');
      const student = studentRes.data.student;

      if (!student) {
        setStudentData(null);
        setLoading(false);
        toast.error('No linked student found');
        return;
      }

      // Fetch all data before updating state
      const attendanceRes = await api.get(`/attendance/student/${student.usn}`);
      const attendanceData = attendanceRes.data.success 
        ? attendanceRes.data.statistics.overall 
        : { percentage: 0, present: 0, absent: 0, totalClasses: 0 };

      const coursesRes = await api.get(`/courses/student/${student._id}/enrollments`);
      const enrollments = coursesRes.data.enrollments || [];
      const completedCourses = enrollments.filter(e => e.completed).length;

      const gradesRes = await api.get(`/grades/student/${student._id}/results`);
      const grades = gradesRes.data.grades || [];

      const certsRes = await api.get(`/courses/student/${student._id}/certificates`);
      const certificates = certsRes.data.certificates || [];

      // Update all state at once after all data is fetched
      setStudentData(student);
      setDashboardData({
        attendance: attendanceData,
        courses: {
          completed: completedCourses,
          inProgress: enrollments.length - completedCourses,
          total: enrollments.length
        },
        grades: {
          recent: grades.slice(0, 5),
          average: grades.length > 0 
            ? grades.reduce((sum, g) => sum + (g.score || 0), 0) / grades.length 
            : 0
        },
        certificates: certificates
      });
    } catch (error) {
      console.error('Error fetching parent dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setStudentData(null);
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
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
    </motion.div>
  );

  const GradeCard = ({ grade }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-blue-500" />
        <div>
          <p className="font-medium text-gray-800 dark:text-white">
            {grade.subject || 'Assignment'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(grade.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-lg font-bold ${
          grade.score >= 70 ? 'text-green-600' : grade.score >= 50 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {grade.score}%
        </span>
        {grade.feedback && (
          <button
            onClick={() => navigate('/dashboard/parent/grade-viewer')}
            className="text-xs text-blue-600 hover:underline"
          >
            View Feedback
          </button>
        )}
      </div>
    </div>
  );

  const CertificateCard = ({ certificate }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        <div className="flex gap-2">
          <button
            onClick={() => window.open(certificate.url, '_blank')}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => window.open(certificate.url, '_blank')}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
          >
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
        {certificate.courseName || certificate.subject}
      </h4>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Earned: {new Date(certificate.issueDate).toLocaleDateString()}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        {certificate.type === 'course' ? 'CourseMaster' : 'GradeMaster'}
      </p>
    </motion.div>
  );

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} role="parent">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!studentData) {
    return (
      <DashboardLayout menuItems={menuItems} role="parent">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Student Linked
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please contact admin to link your child's account
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} role="parent">
      <div className="space-y-6">
        {/* Welcome Section with Student Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {studentData.name}'s Academic Overview 👨‍🎓
              </h2>
              <p className="text-blue-100">
                USN: {studentData.usn} • {studentData.department || 'N/A'}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-100">Overall Progress</p>
              <p className="text-3xl font-bold">{Math.round(dashboardData?.attendance?.percentage || 0)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            title="Attendance"
            value={`${dashboardData?.attendance?.percentage || 0}%`}
            subtitle={`${dashboardData?.attendance?.present || 0}/${dashboardData?.attendance?.totalClasses || 0} classes`}
            color="text-green-600"
            bgColor="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30"
            onClick={() => navigate('/dashboard/parent/attendance')}
          />
          
          <StatCard
            icon={GraduationCap}
            title="Courses Completed"
            value={dashboardData?.courses?.completed || 0}
            subtitle={`${dashboardData?.courses?.total || 0} total enrolled`}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30"
            onClick={() => navigate('/dashboard/parent/courses')}
          />
          
          <StatCard
            icon={FileText}
            title="Average Grade"
            value={`${Math.round(dashboardData?.grades?.average || 0)}%`}
            subtitle={`${dashboardData?.grades?.recent?.length || 0} assignments`}
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30"
            onClick={() => navigate('/dashboard/parent/grade-viewer')}
          />
          
          <StatCard
            icon={Award}
            title="Certificates"
            value={dashboardData?.certificates?.length || 0}
            subtitle="Total earned"
            color="text-yellow-600"
            bgColor="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/30"
            onClick={() => navigate('/dashboard/parent/certificates')}
          />
        </div>

        {/* Recent Grades & Certificates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Grades */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Latest GradeMaster Results
              </h3>
              <button
                onClick={() => navigate('/dashboard/parent/grade-viewer')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
            {dashboardData?.grades?.recent?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.grades.recent.map((grade, index) => (
                  <GradeCard key={index} grade={grade} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No grades available yet
              </p>
            )}
          </motion.div>

          {/* Recent Certificates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Certificates Earned
              </h3>
              <button
                onClick={() => navigate('/dashboard/parent/certificates')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
            {dashboardData?.certificates?.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {dashboardData.certificates.slice(0, 3).map((cert, index) => (
                  <CertificateCard key={index} certificate={cert} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No certificates earned yet
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Course Progress Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {dashboardData.courses.total}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {dashboardData.courses.inProgress}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {dashboardData.courses.completed}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/dashboard/parent/attendance')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 hover:shadow-lg transition-all"
            >
              <Calendar className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                View Attendance
              </span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard/parent/grade-viewer')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 hover:shadow-lg transition-all"
            >
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Check Grades
              </span>
            </button>
            
            <button
              onClick={() => navigate('/mentor-connect')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30 hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message Teacher
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboardNew;
