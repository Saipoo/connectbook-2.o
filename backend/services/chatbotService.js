import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * ConnectBook AI Chatbot Service
 * Provides context-aware responses about ConnectBook features
 */
class ChatbotService {
  
  /**
   * Get ConnectBook feature context based on user role
   */
  static getFeatureContext(role) {
    const baseFeatures = {
      common: `
ConnectBook Platform Features:
- **Dashboard**: Overview of all activities and quick stats
- **Real-Time Updates**: AI-curated news about education, tech, jobs, and motivation
- **Profile Management**: Update personal information and settings
- **PoornaGPT**: External AI tools platform (https://poornagpt.vercel.app)
`,
      student: `
Student-Specific Features:
- **Attendance Tracker**: View your attendance records and statistics
- **GradeMaster**: Check your grades, marks, and performance analytics
- **CourseMaster**: Browse and enroll in available courses
- **Study Planner**: AI-powered study schedule and task management
- **Career Advisor**: Get personalized career guidance and recommendations
- **Lecture Notes**: AI-generated short notes from recorded lectures
- **Interview Simulator**: Practice interviews with AI feedback
- **Internship Simulator**: Prepare for internships with simulated scenarios
- **MentorConnect**: Connect with mentors and schedule meetings
`,
      teacher: `
Teacher-Specific Features:
- **GradeMaster**: Upload answer keys, grade submissions, view analytics
- **CourseMaster**: Create and manage courses, upload materials
- **Attendance Management**: Mark and track student attendance
- **Lecture Recording**: Record live lectures with AI transcription
- **Meeting Scheduler**: Schedule sessions with students
- **Student Analytics**: View detailed performance reports
`,
      parent: `
Parent-Specific Features:
- **Student Dashboard**: Monitor your child's overall performance
- **Attendance Tracking**: View attendance records and patterns
- **Grade Reports**: Access detailed grade reports and analytics
- **Performance Insights**: AI-generated insights about student progress
- **Meeting Requests**: Schedule meetings with teachers or administrators
`
    };

    return baseFeatures.common + (baseFeatures[role] || '');
  }

  /**
   * Get navigation routes for features
   */
  static getNavigationMap() {
    return {
      'dashboard': '/dashboard/student',
      'attendance': '/dashboard/student/attendance-history',
      'grademaster': '/dashboard/student/grade-master',
      'coursemaster': '/dashboard/student/course-master',
      'study planner': '/dashboard/student/study-planner',
      'career advisor': '/dashboard/student/career-advisor',
      'lecture notes': '/dashboard/student/lectures',
      'interview simulator': '/dashboard/student/interview',
      'internship simulator': '/dashboard/student/internship',
      'mentorconnect': '/dashboard/student/mentor-connect',
      'real-time updates': '/dashboard/student/updates',
      'profile': '/dashboard/student/profile',
      'faq': '/dashboard/student/faq',
      'faqs': '/dashboard/student/faq',
      'help': '/dashboard/student/faq',
      'about': '/dashboard/student/about',
      'about us': '/dashboard/student/about',
      'team': '/dashboard/student/about',
      'contact': '/dashboard/student/about',
      // Teacher routes
      'teacher dashboard': '/dashboard/teacher',
      'grade management': '/dashboard/teacher/grading',
      'course management': '/dashboard/teacher/courses',
      'teacher faq': '/dashboard/teacher/faq',
      'teacher about': '/dashboard/teacher/about',
      // Parent routes
      'parent dashboard': '/dashboard/parent',
      'parent faq': '/dashboard/parent/faq',
      'parent about': '/dashboard/parent/about'
    };
  }

  /**
   * Extract navigation intent from query
   */
  static extractNavigationIntent(query) {
    const lowerQuery = query.toLowerCase();
    const navigationMap = this.getNavigationMap();
    
    for (const [feature, route] of Object.entries(navigationMap)) {
      if (lowerQuery.includes(feature) || 
          lowerQuery.includes(`go to ${feature}`) ||
          lowerQuery.includes(`open ${feature}`) ||
          lowerQuery.includes(`show ${feature}`)) {
        return { feature, route };
      }
    }
    
    return null;
  }

  /**
   * Generate menu options based on role
   */
  static getMenuOptions(role) {
    const menus = {
      student: [
        { icon: '🏠', label: 'Dashboard Overview', route: '/dashboard/student' },
        { icon: '📊', label: 'Attendance Tracker', route: '/dashboard/student/attendance-history' },
        { icon: '🎓', label: 'GradeMaster', route: '/dashboard/student/grade-master' },
        { icon: '📚', label: 'CourseMaster', route: '/dashboard/student/course-master' },
        { icon: '📝', label: 'Study Planner', route: '/dashboard/student/study-planner' },
        { icon: '🎯', label: 'Career Advisor', route: '/dashboard/student/career-advisor' },
        { icon: '📖', label: 'Lecture Notes', route: '/dashboard/student/lectures' },
        { icon: '💼', label: 'Interview Simulator', route: '/dashboard/student/interview' },
        { icon: '🚀', label: 'Internship Simulator', route: '/dashboard/student/internship' },
        { icon: '👨‍🏫', label: 'MentorConnect', route: '/dashboard/student/mentor-connect' },
        { icon: '📰', label: 'Real-Time Updates', route: '/dashboard/student/updates' },
        { icon: '❓', label: 'FAQs & Help', route: '/dashboard/student/faq' },
        { icon: 'ℹ️', label: 'About ConnectBook', route: '/dashboard/student/about' },
        { icon: '🪄', label: 'Explore PoornaGPT', route: 'https://poornagpt.vercel.app', external: true }
      ],
      teacher: [
        { icon: '🏠', label: 'Dashboard Overview', route: '/dashboard/teacher' },
        { icon: '🎓', label: 'Grade Management', route: '/dashboard/teacher/grading' },
        { icon: '📚', label: 'Course Management', route: '/dashboard/teacher/courses' },
        { icon: '📊', label: 'Attendance Management', route: '/dashboard/teacher/attendance' },
        { icon: '🎥', label: 'Lecture Recording', route: '/dashboard/teacher/lectures' },
        { icon: '📰', label: 'Real-Time Updates', route: '/dashboard/teacher/updates' },
        { icon: '❓', label: 'FAQs & Help', route: '/dashboard/teacher/faq' },
        { icon: 'ℹ️', label: 'About ConnectBook', route: '/dashboard/teacher/about' },
        { icon: '🪄', label: 'Explore PoornaGPT', route: 'https://poornagpt.vercel.app', external: true }
      ],
      parent: [
        { icon: '🏠', label: 'Dashboard Overview', route: '/dashboard/parent' },
        { icon: '📊', label: 'Attendance Reports', route: '/dashboard/parent/attendance' },
        { icon: '🎓', label: 'Grade Reports', route: '/dashboard/parent/grades' },
        { icon: '📈', label: 'Performance Insights', route: '/dashboard/parent/insights' },
        { icon: '❓', label: 'FAQs & Help', route: '/dashboard/parent/faq' },
        { icon: 'ℹ️', label: 'About ConnectBook', route: '/dashboard/parent/about' },
        { icon: '🪄', label: 'Explore PoornaGPT', route: 'https://poornagpt.vercel.app', external: true }
      ]
    };

    return menus[role] || menus.student;
  }

  /**
   * Generate AI response using Gemini
   */
  static async generateResponse(query, role, context = {}) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      // Check for navigation intent first
      const navIntent = this.extractNavigationIntent(query);
      
      // Check for menu request
      if (query.toLowerCase().includes('menu') || query.toLowerCase().includes('options')) {
        return {
          response: `Here are the available features you can explore:\n\n${this.getMenuOptions(role).map(m => `${m.icon} **${m.label}**`).join('\n')}\n\nJust tell me which one you'd like to explore, or ask me anything!`,
          actionType: 'menu',
          menuOptions: this.getMenuOptions(role)
        };
      }

      // Check for PoornaGPT request
      if (query.toLowerCase().includes('poornagpt') || query.toLowerCase().includes('ai tools')) {
        return {
          response: `🪄 **PoornaGPT** is an all-in-one AI tools platform that offers:\n\n✨ Multiple AI assistants for different tasks\n🎨 Creative tools and generators\n📝 Writing and content assistance\n🧠 Problem-solving utilities\n\nIt's a separate platform designed to complement ConnectBook with additional AI capabilities. Would you like to explore it?`,
          actionType: 'poornagpt',
          externalLink: 'https://poornagpt.vercel.app'
        };
      }

      // Check for FAQ/Help request
      if (query.toLowerCase().includes('faq') || 
          query.toLowerCase().includes('frequently asked') ||
          query.toLowerCase().includes('help') ||
          query.toLowerCase().includes('how do i') ||
          query.toLowerCase().includes('how can i') ||
          query.toLowerCase().includes('how to')) {
        const roleMap = { student: 'student', teacher: 'teacher', parent: 'parent' };
        const faqRoute = `/dashboard/${roleMap[role] || 'student'}/faq`;
        return {
          response: `❓ I can help you with that! Our **FAQ section** has comprehensive answers to common questions about:\n\n• Account and login issues\n• Using platform features\n• Grading and courses\n• Technical support\n• And much more!\n\nWould you like to browse the FAQs or ask me a specific question here?`,
          actionType: 'navigation',
          navigationTarget: faqRoute
        };
      }

      // Check for About/Team/Contact request
      if (query.toLowerCase().includes('about') ||
          query.toLowerCase().includes('team') ||
          query.toLowerCase().includes('who made') ||
          query.toLowerCase().includes('who created') ||
          query.toLowerCase().includes('contact') ||
          query.toLowerCase().includes('feedback') ||
          query.toLowerCase().includes('suggestion')) {
        const roleMap = { student: 'student', teacher: 'teacher', parent: 'parent' };
        const aboutRoute = `/dashboard/${roleMap[role] || 'student'}/about`;
        return {
          response: `ℹ️ **About ConnectBook**\n\nConnectBook is built by the **IDEA_CRAP** team:\n• A POORNA SESHASEYAN - Senior Software Developer\n• Rakshith Subramanya Ravi - Team Lead\n• Chinmaya S Shetty - Senior Data and Product Analyst\n• Ajay S Patil - Senior Software Tester\n\nOur platform integrates AI-based education, communication, assessment, and simulation tools to revolutionize learning.\n\nWant to learn more about our team, technologies, or provide feedback?`,
          actionType: 'navigation',
          navigationTarget: aboutRoute
        };
      }

      // Build context-aware prompt
      const featureContext = this.getFeatureContext(role);
      const prompt = `You are the ConnectBook AI Assistant, a friendly and helpful chatbot for the ConnectBook educational platform.

User Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
User Query: "${query}"

Platform Context:
${featureContext}

Instructions:
1. Provide a helpful, conversational response (2-4 sentences max)
2. Use emojis to make it friendly
3. If the query is about a specific feature, explain it briefly and suggest opening it
4. If navigation is implied, mention you can take them there
5. Keep responses concise and actionable
6. Use markdown formatting for clarity

Response:`;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      return {
        response: aiResponse,
        actionType: navIntent ? 'navigation' : 'information',
        navigationTarget: navIntent?.route || null,
        featureName: navIntent?.feature || null
      };

    } catch (error) {
      console.error('Chatbot AI Error:', error);
      
      // Fallback response if Gemini fails
      return {
        response: `I'm here to help! 🤖 You can ask me about:\n\n📚 **Features**: What does GradeMaster do?\n🧭 **Navigation**: Take me to Study Planner\n📋 **Menu**: Show me all options\n\nWhat would you like to know?`,
        actionType: 'fallback',
        error: error.message
      };
    }
  }

  /**
   * Generate greeting message based on role and time
   */
  static getGreeting(role, userName = null) {
    const hour = new Date().getHours();
    let timeGreeting = 'Hello';
    
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    const name = userName ? `, ${userName}` : '';
    
    const roleMessages = {
      student: `${timeGreeting}${name}! 👋 I'm your ConnectBook Assistant.\n\nI can help you with:\n• 📊 Checking attendance & grades\n• 📚 Finding courses\n• 🎯 Planning your studies\n• 💼 Interview & internship prep\n• And much more!\n\nWhat would you like to explore today?`,
      teacher: `${timeGreeting}${name}! 👋 I'm your ConnectBook Assistant.\n\nI can help you with:\n• 🎓 Managing grades & courses\n• 📊 Tracking student progress\n• 🎥 Recording lectures\n• And much more!\n\nHow can I assist you today?`,
      parent: `${timeGreeting}${name}! 👋 I'm your ConnectBook Assistant.\n\nI can help you:\n• 📈 Monitor your child's progress\n• 📊 View attendance & grades\n• 💬 Understand platform features\n• And much more!\n\nWhat would you like to know?`
    };

    return roleMessages[role] || roleMessages.student;
  }
}

export default ChatbotService;
