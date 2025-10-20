import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

const FAQPage = ({ userRole = 'student' }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Role-based colors
  const roleColors = {
    student: 'blue',
    teacher: 'green',
    parent: 'purple'
  };
  const color = roleColors[userRole] || 'blue';

  // Simple hardcoded FAQs for each role
  const DUMMY_FAQS = {
    student: [
      {
        id: 1,
        category: 'Account and Login',
        question: 'How do I reset my password?',
        answer: 'To reset your password:\n1. Click on "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your email for the password reset link\n4. Click the link and create a new password\n5. Login with your new password'
      },
      {
        id: 2,
        category: 'Account and Login',
        question: 'How do I update my profile information?',
        answer: 'To update your profile:\n1. Go to your dashboard\n2. Click on your profile icon in the top right\n3. Select "Edit Profile"\n4. Update your information (name, email, phone, etc.)\n5. Click "Save Changes"'
      },
      {
        id: 3,
        category: 'Courses and Learning',
        question: 'How do I enroll in a course?',
        answer: 'To enroll in a course:\n1. Go to "CourseMaster" from your dashboard\n2. Browse available courses\n3. Click on the course you want to enroll in\n4. Click "Enroll Now" button\n5. Confirm your enrollment\n6. Start learning!'
      },
      {
        id: 4,
        category: 'Courses and Learning',
        question: 'Where can I see my course progress?',
        answer: 'You can view your course progress in multiple ways:\n1. On your main dashboard - see overall progress cards\n2. In CourseMaster - each course shows completion percentage\n3. In Study Planner - track your learning goals\n4. Your parents can also see your progress in their Parent Dashboard'
      },
      {
        id: 5,
        category: 'Courses and Learning',
        question: 'How do I download my course certificate?',
        answer: 'To download your certificate:\n1. Complete all course modules (100% completion required)\n2. Pass any required assessments\n3. Go to "CourseMaster"\n4. Find your completed course\n5. Click "Download Certificate"\n6. Your certificate will be downloaded as a PDF'
      },
      {
        id: 6,
        category: 'Grades and Assessments',
        question: 'How is my work graded?',
        answer: 'ConnectBook uses AI-powered GradeMaster for instant grading:\n1. Submit your assignments through the course portal\n2. AI analyzes your submission based on rubrics\n3. You receive instant feedback and grades\n4. Teachers can review and adjust AI grades if needed\n5. All grades are visible in your dashboard and GradeMaster section'
      },
      {
        id: 7,
        category: 'Grades and Assessments',
        question: 'Can I view my grade history?',
        answer: 'Yes! To view your grade history:\n1. Go to "GradeMaster" from your dashboard\n2. Select "Grade History"\n3. Filter by course, subject, or date range\n4. View detailed breakdowns of all your assessments\n5. Download grade reports for your records'
      },
      {
        id: 8,
        category: 'Career Tools',
        question: 'What is the Internship Simulator?',
        answer: 'The Internship Simulator helps you prepare for real internships:\n1. Choose from various industry scenarios\n2. Complete realistic workplace tasks\n3. Make decisions and solve problems\n4. Receive feedback on your performance\n5. Build confidence before applying for real internships\n6. Access it from your dashboard under "Career Tools"'
      },
      {
        id: 9,
        category: 'Career Tools',
        question: 'How does the Interview Simulator work?',
        answer: 'The Interview Simulator prepares you for job interviews:\n1. Select interview type (technical, HR, behavioral)\n2. AI conducts a realistic interview with you\n3. Practice answering common questions\n4. Receive instant feedback on your responses\n5. Review your performance and improve\n6. Practice unlimited times until you feel confident'
      },
      {
        id: 10,
        category: 'Career Tools',
        question: 'What is the Study Planner and Career Advisor?',
        answer: 'Two powerful tools to guide your academic journey:\n\nStudy Planner:\n- Create personalized study schedules\n- Set learning goals and track progress\n- Get AI recommendations for optimal study times\n- Balance multiple courses effectively\n\nCareer Advisor:\n- Discover career paths based on your interests\n- Get course recommendations aligned with career goals\n- Learn about industry trends and job opportunities\n- Plan your educational journey strategically'
      },
      {
        id: 11,
        category: 'Technical Support',
        question: 'How do I use the AI Chatbot?',
        answer: 'The AI Chatbot is your 24/7 assistant:\n1. Click the chat icon in the bottom right corner\n2. Type your question or concern\n3. Get instant AI-powered responses\n4. Ask about courses, assignments, deadlines, or platform features\n5. Chatbot can also help navigate the platform\n6. For complex issues, it will direct you to human support'
      },
      {
        id: 12,
        category: 'Technical Support',
        question: 'What should I do if I encounter a technical issue?',
        answer: 'If you experience technical problems:\n1. First, try refreshing your browser\n2. Clear your browser cache and cookies\n3. Check your internet connection\n4. Try using a different browser\n5. Contact support through the chatbot\n6. Email support@connectbook.com with details\n7. Include screenshots if possible'
      }
    ],
    teacher: [
      {
        id: 1,
        category: 'Account and Login',
        question: 'How do I reset my password?',
        answer: 'To reset your password:\n1. Click on "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your email for the password reset link\n4. Click the link and create a new password\n5. Login with your new password'
      },
      {
        id: 2,
        category: 'Course Management',
        question: 'How do I create a new course?',
        answer: 'To create a new course:\n1. Go to "CourseMaster" in your teacher dashboard\n2. Click "Create New Course"\n3. Fill in course details (name, description, category)\n4. Add course modules and content\n5. Set assessment criteria and rubrics\n6. Upload course materials (videos, PDFs, etc.)\n7. Publish when ready'
      },
      {
        id: 3,
        category: 'Course Management',
        question: 'Can I update course content after publishing?',
        answer: 'Yes! You can update courses anytime:\n1. Go to your course in CourseMaster\n2. Click "Edit Course"\n3. Modify any content, modules, or assessments\n4. Students will see updated content immediately\n5. Consider notifying students of major changes\n6. Version history is maintained for your reference'
      },
      {
        id: 4,
        category: 'Grading and Assessment',
        question: 'How does AI grading work for my courses?',
        answer: 'GradeMaster AI assists with grading:\n1. Students submit assignments through the platform\n2. AI analyzes submissions based on your rubrics\n3. AI provides instant grades and detailed feedback\n4. You can review AI grades in your dashboard\n5. Override or adjust grades as needed\n6. Add personal comments for students\n7. All changes are tracked and logged'
      },
      {
        id: 5,
        category: 'Grading and Assessment',
        question: 'Can I create custom rubrics for assignments?',
        answer: 'Yes! Custom rubrics are fully supported:\n1. Go to any assignment in your course\n2. Click "Create Rubric"\n3. Define criteria and scoring levels\n4. Assign points for each criterion\n5. Add descriptions for each scoring level\n6. Save rubric for reuse in other assignments\n7. AI will grade based on your rubric'
      },
      {
        id: 6,
        category: 'Student Management',
        question: 'How do I track student progress?',
        answer: 'Monitor student progress easily:\n1. Go to your course dashboard\n2. View "Student Analytics" section\n3. See completion rates, grades, and engagement\n4. Identify students who need help\n5. Export progress reports\n6. Set up automated progress alerts\n7. Contact students directly through MentorConnect'
      },
      {
        id: 7,
        category: 'Student Management',
        question: 'What is MentorConnect?',
        answer: 'MentorConnect is your communication hub:\n1. Schedule one-on-one sessions with students\n2. Conduct virtual office hours\n3. Send messages and announcements\n4. Share resources and feedback\n5. Track interaction history\n6. Integrate with your calendar\n7. Record sessions for student review'
      },
      {
        id: 8,
        category: 'Attendance and Tracking',
        question: 'How do I take attendance for virtual classes?',
        answer: 'Taking attendance is simple:\n1. Start your virtual class session\n2. System auto-tracks student login times\n3. Manually mark attendance in the class roster\n4. Set attendance requirements for your course\n5. View attendance reports and trends\n6. Export attendance data for records\n7. Parents receive automatic attendance notifications'
      },
      {
        id: 9,
        category: 'Technical Support',
        question: 'How do I upload and manage course materials?',
        answer: 'Upload course materials easily:\n1. Go to your course in CourseMaster\n2. Click "Add Content"\n3. Choose content type (video, PDF, quiz, etc.)\n4. Upload files (supports multiple formats)\n5. Organize content into modules\n6. Set release schedules if needed\n7. Update or remove materials anytime'
      },
      {
        id: 10,
        category: 'Technical Support',
        question: 'What should I do if I encounter a technical issue?',
        answer: 'If you experience technical problems:\n1. First, try refreshing your browser\n2. Clear your browser cache and cookies\n3. Check your internet connection\n4. Try using a different browser\n5. Contact support through the teacher portal\n6. Email support@connectbook.com\n7. Priority support available for teachers'
      }
    ],
    parent: [
      {
        id: 1,
        category: 'Account and Login',
        question: 'How do I reset my password?',
        answer: 'To reset your password:\n1. Click on "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your email for the password reset link\n4. Click the link and create a new password\n5. Login with your new password'
      },
      {
        id: 2,
        category: 'Monitoring Progress',
        question: 'How can I track my child\'s academic progress?',
        answer: 'Your Parent Dashboard provides comprehensive tracking:\n1. Login to your parent dashboard\n2. View real-time grade updates\n3. See course completion percentages\n4. Track attendance records\n5. Review assignment submissions\n6. Monitor study time and engagement\n7. Receive automated progress reports weekly'
      },
      {
        id: 3,
        category: 'Monitoring Progress',
        question: 'What notifications will I receive?',
        answer: 'You\'ll receive important notifications about:\n1. Grade updates and report cards\n2. Assignment submissions and due dates\n3. Attendance alerts and absences\n4. Course enrollments and completions\n5. Teacher messages and announcements\n6. Upcoming parent-teacher meetings\n7. Platform updates and new features'
      },
      {
        id: 4,
        category: 'Communication',
        question: 'How do I communicate with my child\'s teachers?',
        answer: 'Connect with teachers easily:\n1. Go to "Teacher Communication" in your dashboard\n2. View list of your child\'s teachers\n3. Send direct messages\n4. Schedule parent-teacher meetings\n5. View teacher announcements\n6. Receive responses within 24-48 hours\n7. All communication is tracked and archived'
      },
      {
        id: 5,
        category: 'Communication',
        question: 'Can I schedule meetings with teachers?',
        answer: 'Yes! Schedule meetings easily:\n1. Go to "Teacher Communication"\n2. Select the teacher you want to meet\n3. View their available time slots\n4. Choose a convenient time\n5. Add meeting agenda/topics\n6. Receive confirmation and reminders\n7. Join virtual meetings through the platform'
      },
      {
        id: 6,
        category: 'Attendance and Reports',
        question: 'How do I view attendance records?',
        answer: 'Access attendance information:\n1. Go to "Attendance Tracking" in your dashboard\n2. View daily, weekly, or monthly attendance\n3. See detailed login/logout times\n4. Check class participation rates\n5. Download attendance reports\n6. Receive alerts for absences\n7. View attendance trends and patterns'
      },
      {
        id: 7,
        category: 'Attendance and Reports',
        question: 'Can I download my child\'s progress reports?',
        answer: 'Yes! Download comprehensive reports:\n1. Go to "Reports" section in dashboard\n2. Select report type (grades, attendance, progress)\n3. Choose date range\n4. Click "Generate Report"\n5. Download as PDF or Excel\n6. Reports include detailed analytics\n7. Share reports with other family members'
      },
      {
        id: 8,
        category: 'Account Management',
        question: 'How do I add multiple children to my account?',
        answer: 'Manage multiple children easily:\n1. Go to "Account Settings"\n2. Click "Add Child"\n3. Enter child\'s student ID or email\n4. Send connection request\n5. Wait for school/student approval\n6. Switch between children in your dashboard\n7. View combined or individual reports'
      },
      {
        id: 9,
        category: 'Account Management',
        question: 'Can I control what my child accesses?',
        answer: 'Yes! Parental controls include:\n1. View all courses your child is enrolled in\n2. See assignment due dates and priorities\n3. Monitor login times and duration\n4. Review AI chatbot conversations (if enabled)\n5. Set study time reminders\n6. Receive alerts for specific activities\n7. Note: Cannot restrict teacher-assigned content'
      },
      {
        id: 10,
        category: 'Technical Support',
        question: 'What should I do if I encounter a technical issue?',
        answer: 'If you experience technical problems:\n1. First, try refreshing your browser\n2. Clear your browser cache and cookies\n3. Check your internet connection\n4. Try using a different browser\n5. Contact support through the parent portal\n6. Email support@connectbook.com\n7. Include your child\'s student ID when contacting support'
      }
    ]
  };

  // Get FAQs for current role
  const allFAQs = DUMMY_FAQS[userRole] || [];

  // Extract unique categories
  const categories = ['all', ...new Set(allFAQs.map(faq => faq.category))];

  // Filter FAQs
  const filteredFAQs = allFAQs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className={`text-${color}-600 mr-3`} size={48} />
            <h1 className={`text-4xl font-bold text-${color}-600`}>
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Find answers to common questions about ConnectBook
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search FAQs... (e.g., 'How do I reset my password?')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter by Category:</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? `bg-${color}-600 text-white shadow-md`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQs List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-xl shadow-sm"
            >
              <HelpCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">
                {searchQuery
                  ? `No FAQs found for "${searchQuery}"`
                  : 'No FAQs available in this category'}
              </p>
            </motion.div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-${color}-100 text-${color}-600 flex items-center justify-center font-semibold`}>
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {faq.question}
                        </h3>
                        <span className={`text-sm text-${color}-600 font-medium`}>
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className={`text-${color}-600 flex-shrink-0`} size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                  )}
                </button>

                <AnimatePresence>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 pb-6 pt-2 border-t border-gray-100`}>
                        <div className={`bg-${color}-50 rounded-lg p-4`}>
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
