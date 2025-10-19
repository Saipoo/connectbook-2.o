import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  BookOpen,
  Target,
  Lightbulb,
  AlertCircle,
  Play,
  Plus,
  Share2
} from 'lucide-react';

const StudyPlanner = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    type: 'assignment',
    priority: 'medium',
    estimatedHours: 2,
    dueDate: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/api/study-planner/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      
      // If no plan exists, create one
      if (error.response?.status === 404) {
        await createInitialPlan();
      }
    } finally {
      setLoading(false);
    }
  };

  const createInitialPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/api/study-planner/create`,
        {
          semester: 5, // Default semester
          academicYear: '2024-25',
          weeklyGoalHours: 20
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch dashboard again
      fetchDashboard();
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/api/study-planner/task`,
        {
          planId: dashboardData?.plan?._id,
          ...newTask
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddTask(false);
      setNewTask({
        title: '',
        subject: '',
        type: 'assignment',
        priority: 'medium',
        estimatedHours: 2,
        dueDate: ''
      });
      
      fetchDashboard();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${API_URL}/api/study-planner/task/${taskId}`,
        {
          planId: dashboardData?.plan?._id,
          status: 'completed',
          actualHours: 2 // Could be made dynamic
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchDashboard();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const generateSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/api/study-planner/generate-schedule`,
        { planId: dashboardData?.plan?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('✨ AI Schedule generated successfully!');
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Failed to generate schedule');
    }
  };

  const syncWeakSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/api/study-planner/sync-weak-subjects`,
        { planId: dashboardData?.plan?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('✅ Weak subjects synced successfully!');
      fetchDashboard();
    } catch (error) {
      console.error('Error syncing weak subjects:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-red-600 bg-red-50 border-red-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      assignment: '📝',
      revision: '📖',
      practice: '💻',
      project: '🚀',
      'exam-prep': '📚'
    };
    return icons[type] || '📝';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load study planner</p>
        </div>
      </div>
    );
  }

  const { 
    plan = {}, 
    overdueTasks = [], 
    upcomingTasks = [], 
    progress = { overallProgress: 0, tasksProgress: '0/0' }, 
    recommendations = [], 
    statistics = { currentStreak: 0, totalStudyHours: 0, totalTasksCompleted: 0 } 
  } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                Study Planner
              </h1>
              <p className="text-gray-600 mt-2">
                Semester {plan?.semester || 'N/A'} • {plan?.academicYear || 'N/A'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {statistics?.currentStreak || 0}
                </div>
                <div className="text-sm text-gray-600">🔥 Day Streak</div>
              </div>
              
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(statistics?.totalStudyHours || 0).toFixed(1)}h
                </p>
                <p className="text-xs text-gray-500">of {plan?.weeklyGoalHours || 20}h goal</p>
              </div>
              <Clock className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(((statistics?.totalStudyHours || 0) / (plan?.weeklyGoalHours || 20)) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics?.totalTasksCompleted || 0}
                </p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress?.overallProgress || 0}%
                </p>
                <p className="text-xs text-gray-500">{progress?.tasksProgress || '0/0'}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-600">
                  {overdueTasks.length}
                </p>
                <p className="text-xs text-gray-500">Needs attention</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <div className="flex gap-4 px-6">
              {['overview', 'schedule', 'tasks', 'recommendations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 border-b-2 font-medium transition capitalize ${
                    activeTab === tab
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={generateSchedule}
                    className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                  >
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <div className="text-left">
                      <div className="font-semibold text-indigo-900">Generate Schedule</div>
                      <div className="text-sm text-indigo-600">AI-powered weekly plan</div>
                    </div>
                  </button>

                  <button
                    onClick={syncWeakSubjects}
                    className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
                  >
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                    <div className="text-left">
                      <div className="font-semibold text-orange-900">Sync Grades</div>
                      <div className="text-sm text-orange-600">Update weak subjects</div>
                    </div>
                  </button>

                  <button
                    onClick={() => alert('Feature coming soon!')}
                    className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
                  >
                    <Play className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <div className="font-semibold text-green-900">Start Pomodoro</div>
                      <div className="text-sm text-green-600">Focus timer session</div>
                    </div>
                  </button>
                </div>

                {/* Upcoming Tasks */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Tasks</h3>
                  {upcomingTasks.length > 0 ? (
                    <div className="space-y-2">
                      {upcomingTasks.map((task) => (
                        <div
                          key={task._id}
                          className={`flex items-center justify-between p-4 border rounded-lg ${getPriorityColor(task.priority)}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getTypeIcon(task.type)}</span>
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm opacity-75">
                                {task.subject} • Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleCompleteTask(task._id)}
                            className="px-4 py-2 bg-white border border-current rounded-lg hover:bg-opacity-20 transition"
                          >
                            Mark Complete
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No upcoming tasks! You're all caught up 🎉</p>
                    </div>
                  )}
                </div>

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Overdue Tasks
                    </h3>
                    <div className="space-y-2">
                      {overdueTasks.map((task) => (
                        <div
                          key={task._id}
                          className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getTypeIcon(task.type)}</span>
                            <div>
                              <div className="font-medium text-red-900">{task.title}</div>
                              <div className="text-sm text-red-600">
                                {task.subject} • Was due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleCompleteTask(task._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Complete Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendations */}
                {recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      AI Recommendations
                    </h3>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <span className="text-2xl">💡</span>
                          <div>
                            <div className="font-medium text-yellow-900">{rec.title}</div>
                            <div className="text-sm text-yellow-700 mt-1">{rec.description}</div>
                            <div className="text-xs text-yellow-600 mt-2">
                              Priority: {rec.priority} • Type: {rec.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                {plan?.weeklySchedule && plan.weeklySchedule.length > 0 ? (
                  <div className="space-y-4">
                    {plan.weeklySchedule.map((day, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="font-semibold text-lg text-gray-900 mb-3">
                          {day.day}
                        </div>
                        
                        <div className="space-y-2">
                          {(day.tasks || []).map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-shrink-0 text-sm font-medium text-indigo-600 min-w-[100px]">
                                {task.timeSlot}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{task.subject}</div>
                                <div className="text-sm text-gray-600">{task.topic}</div>
                              </div>
                              <div className="text-sm text-gray-500">
                                {task.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No schedule generated yet</p>
                    <button
                      onClick={generateSchedule}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Generate AI Schedule
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div>
                <p className="text-gray-600">All tasks view - Coming soon!</p>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div>
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💡</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{rec.title}</div>
                            <div className="text-gray-600 mt-1">{rec.description}</div>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <span className={`px-2 py-1 rounded ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {rec.priority} priority
                              </span>
                              <span className="text-gray-500">
                                Type: {rec.type}
                              </span>
                              <span className="text-gray-400">
                                Expires: {new Date(rec.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No recommendations available yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Task</h3>
            
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Complete DBMS Assignment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Database Management"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="revision">Revision</option>
                    <option value="practice">Practice</option>
                    <option value="project">Project</option>
                    <option value="exam-prep">Exam Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
