import { GoogleGenerativeAI } from '@google/generative-ai';
import FAQ from '../models/FAQ.js';
import FAQFeedback from '../models/FAQFeedback.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Dummy FAQs - Always available fallback data
 */
const DUMMY_FAQS = [
  // Student FAQs
  {
    _id: 'dummy-1',
    role: 'student',
    category: 'Account and Login Issues',
    question: 'How do I reset my password?',
    shortAnswer: 'Use the "Forgot Password" link on the login page to receive a reset email.',
    longAnswer: `To reset your ConnectBook password:

1. Go to the login page
2. Click on **"Forgot Password?"** link below the login button
3. Enter your registered email address
4. Check your email for a password reset link (check spam folder if not visible)
5. Click the link and enter your new password
6. Confirm your new password and click **"Reset Password"**

**Important**: The reset link expires after 1 hour for security reasons.`,
    relatedFeatures: [],
    keywords: ['password', 'reset', 'forgot', 'login', 'account'],
    order: 1,
    isActive: true,
    helpfulCount: 125,
    notHelpfulCount: 5,
    viewCount: 500,
    aiGenerated: false
  },
  {
    _id: 'dummy-2',
    role: 'student',
    category: 'Using CourseMaster (Courses & Certificates)',
    question: 'How do I enroll in a course?',
    shortAnswer: 'Browse courses in CourseMaster, click on a course, and click the "Enroll Now" button.',
    longAnswer: `**Enrolling in a Course:**

1. Navigate to **CourseMaster** from your dashboard
2. Browse available courses or use the search bar
3. Click on a course that interests you
4. Review the course details, syllabus, and requirements
5. Click **"Enroll Now"** button
6. Confirm your enrollment
7. Start learning immediately!

**After Enrollment:**
- Access course materials anytime
- Track your progress in the dashboard
- Complete assignments and quizzes
- Earn certificates upon completion

**Tips:**
- Check course prerequisites before enrolling
- Review instructor ratings and reviews
- Set a study schedule in Study Planner`,
    relatedFeatures: [],
    keywords: ['course', 'enroll', 'coursemaster', 'register', 'join'],
    order: 2,
    isActive: true,
    helpfulCount: 230,
    notHelpfulCount: 8,
    viewCount: 850,
    aiGenerated: false
  },
  {
    _id: 'dummy-3',
    role: 'student',
    category: 'GradeMaster and AI Grading',
    question: 'How does AI grading work?',
    shortAnswer: 'ConnectBook uses Google Gemini AI to evaluate your assignments based on multiple criteria including content quality, accuracy, and presentation.',
    longAnswer: `**AI Grading System:**

ConnectBook's GradeMaster uses advanced **Google Gemini AI** to provide fair and comprehensive grading.

**Evaluation Criteria:**
1. **Content Quality** (40%)
   - Relevance to topic
   - Depth of understanding
   - Critical thinking

2. **Accuracy** (30%)
   - Factual correctness
   - Technical precision
   - Proper use of concepts

3. **Presentation** (20%)
   - Organization and structure
   - Clarity of expression
   - Proper formatting

4. **Completeness** (10%)
   - All requirements met
   - Adequate length
   - Supporting evidence

**Process:**
- Submit your assignment through CourseMaster
- AI analyzes your work within minutes
- Receive detailed feedback and score
- Teachers review AI grades for accuracy
- Appeal grades if needed

**Benefits:**
- Fast turnaround (usually < 5 minutes)
- Consistent evaluation standards
- Detailed feedback for improvement
- 24/7 availability`,
    relatedFeatures: [],
    keywords: ['grading', 'ai', 'grademaster', 'evaluation', 'score'],
    order: 3,
    isActive: true,
    helpfulCount: 312,
    notHelpfulCount: 15,
    viewCount: 1200,
    aiGenerated: false
  },
  {
    _id: 'dummy-4',
    role: 'student',
    category: 'Internship Simulator',
    question: 'How do I practice with the Internship Simulator?',
    shortAnswer: 'Gain real-world experience through virtual internships with AI-guided tasks and projects.',
    longAnswer: `**Internship Simulator Features:**

**Getting Started:**
1. Go to **Internship Simulator** from dashboard
2. Browse available virtual internships
3. Choose internship matching your interests
4. Start your virtual work experience

**During the Internship:**
- Complete real-world tasks and projects
- Receive AI guidance and mentorship
- Build your portfolio with actual deliverables
- Learn industry best practices
- Network with peers

**Benefits:**
- Risk-free learning environment
- Build real portfolio projects
- Gain industry experience
- Develop professional skills
- Prepare for real internships

**After Completion:**
- Receive internship completion certificate
- Get performance evaluation
- Add projects to resume
- Show work to potential employers`,
    relatedFeatures: [],
    keywords: ['internship', 'simulator', 'practice', 'experience', 'virtual'],
    order: 4,
    isActive: true,
    helpfulCount: 289,
    notHelpfulCount: 11,
    viewCount: 980,
    aiGenerated: false
  },
  {
    _id: 'dummy-5',
    role: 'student',
    category: 'Interview Simulator',
    question: 'How do I prepare for interviews using the simulator?',
    shortAnswer: 'Practice with AI-powered mock interviews that simulate real interview scenarios with instant feedback.',
    longAnswer: `**Interview Simulator Features:**

**Getting Started:**
1. Go to **Interview Simulator** from dashboard
2. Choose interview type (Technical, HR, Behavioral)
3. Select difficulty level (Entry, Mid, Senior)
4. Start your practice session

**During the Interview:**
- AI asks relevant questions based on your field
- Answer using text or voice (coming soon)
- Get real-time feedback on your responses
- Practice communication skills
- Build confidence

**After the Interview:**
- Receive comprehensive performance report
- Get suggestions for improvement
- Review strong points and areas to work on
- Track progress over multiple sessions

**Types of Interviews:**
- **Technical**: Coding, problem-solving, system design
- **HR**: Background, experience, soft skills
- **Behavioral**: Situational questions, team scenarios

**Tips for Success:**
- Practice regularly (at least 2-3 times per week)
- Review feedback carefully
- Work on weak areas
- Time your responses (2-3 minutes per answer)
- Be authentic and honest`,
    relatedFeatures: [],
    keywords: ['interview', 'simulator', 'practice', 'mock', 'preparation'],
    order: 5,
    isActive: true,
    helpfulCount: 445,
    notHelpfulCount: 12,
    viewCount: 1800,
    aiGenerated: false
  },
  {
    _id: 'dummy-6',
    role: 'student',
    category: 'Study Planner & Career Advisor',
    question: 'How can the AI Study Planner help me?',
    shortAnswer: 'AI Study Planner creates personalized study schedules based on your courses, deadlines, and learning pace.',
    longAnswer: `**AI-Powered Study Planning:**

**Features:**
1. **Personalized Schedules**
   - Analyzes your enrolled courses
   - Considers assignment deadlines
   - Adapts to your learning pace
   - Suggests optimal study times

2. **Smart Recommendations**
   - Prioritizes urgent tasks
   - Balances workload across subjects
   - Suggests break times
   - Reminds you of upcoming deadlines

3. **Progress Tracking**
   - Monitor completion rates
   - Visualize your progress
   - Adjust plans as needed
   - Celebrate achievements

**How to Use:**
1. Navigate to **Study Planner**
2. Review AI-generated schedule
3. Customize based on preferences
4. Set notification reminders
5. Follow the plan and track progress

**Career Advisor Integration:**
- Get course recommendations aligned with career goals
- Discover skill gaps and how to fill them
- Receive internship and project suggestions
- Plan long-term learning path

**Benefits:**
- Reduce study stress
- Improve time management
- Better grades through consistent study
- Stay organized and focused`,
    relatedFeatures: [],
    keywords: ['study', 'planner', 'schedule', 'career', 'ai', 'organization'],
    order: 6,
    isActive: true,
    helpfulCount: 378,
    notHelpfulCount: 9,
    viewCount: 1450,
    aiGenerated: false
  },
  // Teacher FAQs
  {
    _id: 'dummy-7',
    role: 'teacher',
    category: 'Creating & Publishing Courses',
    question: 'How do I create and publish a course?',
    shortAnswer: 'Use Course Creator to design your course with modules, lessons, assignments, and quizzes, then publish to make it available to students.',
    longAnswer: `**Course Creation Process:**

**Step 1: Course Setup**
1. Go to **Course Creator** dashboard
2. Click **"Create New Course"**
3. Enter course title, description, and category
4. Set course level (Beginner/Intermediate/Advanced)
5. Add course thumbnail and preview video

**Step 2: Build Course Content**
- **Add Modules**: Organize content into logical sections
- **Create Lessons**: Add video lectures, text content, PDFs
- **Design Assignments**: Set up graded work with rubrics
- **Build Quizzes**: Multiple choice, short answer, coding challenges
- **Upload Resources**: Supplementary materials, code samples

**Step 3: Configure Settings**
- Set enrollment options (Open/Closed/By Request)
- Define prerequisites if any
- Set course duration and deadlines
- Configure grading weights
- Add certification criteria

**Step 4: Review & Publish**
1. Preview course as a student would see it
2. Test all assignments and quizzes
3. Review AI grading configuration
4. Click **"Publish Course"**
5. Monitor enrollments and engagement

**Best Practices:**
- Break content into digestible chunks (10-15 min videos)
- Include practical examples and exercises
- Provide clear learning objectives
- Engage students with discussions
- Update content regularly`,
    relatedFeatures: [],
    keywords: ['course', 'create', 'publish', 'creator', 'teacher'],
    order: 1,
    isActive: true,
    helpfulCount: 189,
    notHelpfulCount: 6,
    viewCount: 650,
    aiGenerated: false
  },
  {
    _id: 'dummy-8',
    role: 'teacher',
    category: 'Managing Grades in GradeMaster',
    question: 'How do I review and adjust AI-generated grades?',
    shortAnswer: 'Access GradeEvaluator to review AI grades, read detailed feedback, and manually adjust scores if needed.',
    longAnswer: `**Grade Management in GradeMaster:**

**Reviewing AI Grades:**
1. Navigate to **GradeEvaluator**
2. Select course and assignment
3. View list of student submissions
4. Click on any submission to see:
   - AI-generated score
   - Detailed evaluation breakdown
   - Specific feedback comments
   - Rubric scoring

**Adjusting Grades:**
If you disagree with AI assessment:
1. Click **"Review Grade"** button
2. Review student's work thoroughly
3. Adjust score using grade slider
4. Add your own comments
5. Click **"Override AI Grade"**
6. Student receives notification of update

**Grade Analytics:**
- View class average and distribution
- Identify struggling students
- Track improvement over time
- Export grades to CSV

**Batch Operations:**
- Approve multiple grades at once
- Send feedback to multiple students
- Export grade reports
- Generate performance insights

**Best Practices:**
- Review AI grades regularly
- Provide constructive feedback
- Be consistent in adjustments
- Communicate grading criteria clearly
- Give students chance to improve`,
    relatedFeatures: [],
    keywords: ['grade', 'grading', 'evaluator', 'review', 'adjust', 'score'],
    order: 2,
    isActive: true,
    helpfulCount: 234,
    notHelpfulCount: 11,
    viewCount: 890,
    aiGenerated: false
  },
  {
    _id: 'dummy-9',
    role: 'teacher',
    category: 'Mentor Connect Usage',
    question: 'How do I use MentorConnect to communicate with students and parents?',
    shortAnswer: 'MentorConnect provides video meetings, chat, and scheduling tools for seamless communication with students and parents.',
    longAnswer: `**MentorConnect Communication Platform:**

**Features:**
1. **Video Meetings**
   - One-on-one or group sessions
   - Screen sharing for demonstrations
   - Recording option for later review
   - Whiteboard for collaboration

2. **Chat & Messaging**
   - Instant messaging with students/parents
   - File sharing (assignments, resources)
   - Group chats for project teams
   - Announcement broadcasts

3. **Meeting Scheduler**
   - Set office hours
   - Book appointments
   - Send meeting reminders
   - Sync with calendar

**How to Start a Meeting:**
1. Go to **MentorConnect** dashboard
2. Click **"Start Meeting"** or **"Schedule Meeting"**
3. Select participants (students/parents)
4. Set date, time, and duration
5. Add meeting agenda/notes
6. Send invitations

**Communication Tips:**
- Set clear office hours
- Respond to messages within 24 hours
- Use video for complex discussions
- Keep meeting notes and records
- Follow up on action items

**For Parent Meetings:**
- Schedule regular progress updates
- Share student performance data
- Discuss concerns and improvements
- Collaborate on student support plans
- Maintain professional communication`,
    relatedFeatures: [],
    keywords: ['mentor', 'connect', 'communication', 'meeting', 'video', 'chat'],
    order: 3,
    isActive: true,
    helpfulCount: 156,
    notHelpfulCount: 4,
    viewCount: 580,
    aiGenerated: false
  },
  // Parent FAQs
  {
    _id: 'dummy-10',
    role: 'parent',
    category: 'Viewing Student Grades and Course Progress',
    question: 'How can I track my child\'s academic progress?',
    shortAnswer: 'Access the Parent Dashboard to view real-time grades, course progress, attendance, and performance analytics.',
    longAnswer: `**Tracking Your Child's Progress:**

**Parent Dashboard Features:**
1. **Grade Overview**
   - Current grades across all subjects
   - Assignment scores and feedback
   - Test and quiz results
   - Grade trends and improvements

2. **Course Progress**
   - Enrollment status
   - Completion percentage
   - Upcoming assignments and deadlines
   - Course performance analytics

3. **Attendance Monitoring**
   - Daily attendance records
   - Class participation
   - Late arrivals or absences
   - Attendance percentage

4. **Performance Insights**
   - Strengths and areas for improvement
   - Comparison with class average
   - Learning pace and patterns
   - Skill development tracking

**How to Access:**
1. Log in to your parent account
2. Dashboard shows overview immediately
3. Click on specific course for details
4. View detailed reports and analytics

**Notifications:**
- Get alerts for:
  - Low grades or missing assignments
  - Attendance issues
  - Teacher communications
  - Important announcements

**Taking Action:**
- Schedule meetings with teachers via MentorConnect
- Review feedback and help your child improve
- Encourage consistent study habits
- Celebrate achievements and progress

**Tips:**
- Check dashboard weekly
- Discuss progress with your child
- Communicate with teachers proactively
- Support learning at home`,
    relatedFeatures: [],
    keywords: ['grades', 'progress', 'parent', 'dashboard', 'tracking', 'monitoring'],
    order: 1,
    isActive: true,
    helpfulCount: 267,
    notHelpfulCount: 7,
    viewCount: 920,
    aiGenerated: false
  },
  {
    _id: 'dummy-11',
    role: 'parent',
    category: 'Mentor Connect Communication',
    question: 'How do I communicate with my child\'s teachers?',
    shortAnswer: 'Use MentorConnect to message teachers, schedule meetings, and participate in video conferences.',
    longAnswer: `**Parent-Teacher Communication:**

**MentorConnect for Parents:**
1. **Direct Messaging**
   - Send messages to any teacher
   - Get responses within 24 hours
   - Share concerns or questions
   - Request progress updates

2. **Video Meetings**
   - Schedule parent-teacher conferences
   - Join online meetings from home
   - Discuss your child's progress
   - Collaborate on support strategies

3. **Meeting Scheduling**
   - View teacher availability
   - Book appointment slots
   - Receive meeting reminders
   - Reschedule if needed

**How to Contact a Teacher:**
1. Go to **MentorConnect** from parent dashboard
2. Select your child (if multiple children)
3. Choose the teacher you want to contact
4. Click **"Send Message"** or **"Schedule Meeting"**
5. Write your message or select meeting time

**Best Practices:**
- Be specific about concerns
- Schedule meetings for detailed discussions
- Prepare questions beforehand
- Keep communication respectful
- Follow up on agreed actions
- Document important conversations

**Common Topics to Discuss:**
- Academic performance and grades
- Behavioral concerns
- Learning challenges or disabilities
- Homework help and study strategies
- Social development
- College and career planning

**Response Times:**
- Messages: Within 24 hours (weekdays)
- Emergency: Contact school administration
- Regular updates: Weekly or as needed`,
    relatedFeatures: [],
    keywords: ['mentor', 'connect', 'teacher', 'communication', 'parent', 'meeting'],
    order: 2,
    isActive: true,
    helpfulCount: 198,
    notHelpfulCount: 5,
    viewCount: 710,
    aiGenerated: false
  }
];

// Log dummy FAQ count on module load
console.log(`🎯 Loaded ${DUMMY_FAQS.length} dummy FAQs`);
console.log(`   - Student: ${DUMMY_FAQS.filter(f => f.role === 'student').length}`);
console.log(`   - Teacher: ${DUMMY_FAQS.filter(f => f.role === 'teacher').length}`);
console.log(`   - Parent: ${DUMMY_FAQS.filter(f => f.role === 'parent').length}`);

/**
 * FAQ Service with AI-powered updates and search
 */
class FAQService {
  
  /**
   * Get FAQ categories for a specific role
   */
  static getFAQCategories(role) {
    const categories = {
      student: [
        'Account and Login Issues',
        'Using CourseMaster (Courses & Certificates)',
        'GradeMaster and AI Grading',
        'Internship Simulator',
        'Interview Simulator',
        'Study Planner & Career Advisor',
        'Real-Time Updates and AI Chatbot Usage',
        'MentorConnect',
        'Lecture Notes',
        'Attendance and Progress Tracking'
      ],
      teacher: [
        'Creating & Publishing Courses',
        'Managing Grades in GradeMaster',
        'Uploading Notes via Lecture Short Notes',
        'Mentor Connect Usage',
        'Dashboard Insights and Verification Process',
        'Managing Student Submissions',
        'Real-Time Updates and Announcements'
      ],
      parent: [
        'Viewing Student Grades and Course Progress',
        'Mentor Connect Communication',
        'Monitoring Student Activities and Attendance',
        'Understanding Real-Time Updates and Results',
        'Parent Dashboard Features'
      ]
    };
    
    return categories[role] || categories.student;
  }
  
  /**
   * Get all FAQs for a role, optionally filtered by category
   */
  static async getFAQsByRole(role, category = null) {
    try {
      console.log(`📚 Fetching FAQs for role: ${role}, category: ${category || 'all'}`);
      
      // Get database FAQs
      const dbFAQs = await FAQ.getByRoleAndCategory(role, category);
      console.log(`   📦 Database FAQs: ${dbFAQs.length}`);
      
      // Filter dummy FAQs by role and category
      let dummyFAQs = DUMMY_FAQS.filter(faq => 
        (faq.role === role || faq.role === 'all')
      );
      
      if (category) {
        dummyFAQs = dummyFAQs.filter(faq => faq.category === category);
      }
      
      console.log(`   🎯 Dummy FAQs: ${dummyFAQs.length}`);
      console.log(`   ✅ Total FAQs: ${dbFAQs.length + dummyFAQs.length}`);
      
      // Combine database FAQs with dummy FAQs (dummy FAQs always available)
      const allFAQs = [...dbFAQs, ...dummyFAQs];
      
      // Sort by order and return
      return allFAQs.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('❌ Error fetching FAQs:', error);
      // On error, return at least the dummy FAQs
      const fallbackFAQs = DUMMY_FAQS.filter(faq => 
        (faq.role === role || faq.role === 'all') &&
        (!category || faq.category === category)
      );
      console.log(`   🆘 Returning ${fallbackFAQs.length} fallback dummy FAQs`);
      return fallbackFAQs;
    }
  }
  
  /**
   * Search FAQs with text search
   */
  static async searchFAQs(searchQuery, role) {
    try {
      if (!searchQuery || searchQuery.trim().length < 2) {
        return await this.getFAQsByRole(role);
      }
      
      // Search in database FAQs
      const dbResults = await FAQ.searchFAQs(searchQuery, role);
      
      // Search in dummy FAQs
      const searchLower = searchQuery.toLowerCase();
      const dummyResults = DUMMY_FAQS.filter(faq => {
        const matchesRole = faq.role === role || faq.role === 'all';
        const matchesSearch = 
          faq.question.toLowerCase().includes(searchLower) ||
          faq.shortAnswer.toLowerCase().includes(searchLower) ||
          faq.longAnswer.toLowerCase().includes(searchLower) ||
          faq.keywords.some(k => k.toLowerCase().includes(searchLower));
        
        return matchesRole && matchesSearch;
      });
      
      // Combine and remove duplicates
      const allResults = [...dbResults, ...dummyResults];
      return allResults;
    } catch (error) {
      console.error('Error searching FAQs:', error);
      // On error, search in dummy FAQs only
      const searchLower = searchQuery.toLowerCase();
      return DUMMY_FAQS.filter(faq => {
        const matchesRole = faq.role === role || faq.role === 'all';
        const matchesSearch = 
          faq.question.toLowerCase().includes(searchLower) ||
          faq.shortAnswer.toLowerCase().includes(searchLower) ||
          faq.longAnswer.toLowerCase().includes(searchLower);
        return matchesRole && matchesSearch;
      });
    }
  }
  
  /**
   * Get a single FAQ by ID and increment view count
   */
  static async getFAQById(faqId) {
    try {
      // Check if it's a dummy FAQ
      if (faqId.startsWith('dummy-')) {
        const dummyFAQ = DUMMY_FAQS.find(faq => faq._id === faqId);
        return dummyFAQ || null;
      }
      
      // Otherwise, get from database
      const faq = await FAQ.findById(faqId);
      if (faq) {
        await faq.incrementViews();
      }
      return faq;
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      // Try to find in dummy FAQs as fallback
      const dummyFAQ = DUMMY_FAQS.find(faq => faq._id === faqId);
      return dummyFAQ || null;
    }
  }
  
  /**
   * Get all dummy FAQs (for reference)
   */
  static getDummyFAQs() {
    return DUMMY_FAQS;
  }
  
  /**
   * Get most helpful FAQs for a role
   */
  static async getMostHelpfulFAQs(role, limit = 5) {
    try {
      return await FAQ.getMostHelpful(role, limit);
    } catch (error) {
      console.error('Error fetching most helpful FAQs:', error);
      throw error;
    }
  }
  
  /**
   * Record user feedback on an FAQ
   */
  static async recordFeedback(faqId, userId, userModel, role, wasHelpful, additionalData = {}) {
    try {
      // Update FAQ helpful counts
      const faq = await FAQ.findById(faqId);
      if (faq) {
        await faq.recordFeedback(wasHelpful);
      }
      
      // Create feedback record
      const feedback = new FAQFeedback({
        faqId,
        userId,
        userModel,
        role,
        wasHelpful,
        comment: additionalData.comment,
        suggestedQuestion: additionalData.suggestedQuestion,
        suggestedAnswer: additionalData.suggestedAnswer
      });
      
      return await feedback.save();
    } catch (error) {
      console.error('Error recording feedback:', error);
      throw error;
    }
  }
  
  /**
   * Get feedback statistics for an FAQ
   */
  static async getFeedbackStats(faqId) {
    try {
      return await FAQFeedback.getFeedbackStats(faqId);
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  }
  
  /**
   * AI-powered FAQ generation using Gemini
   * Generates or updates FAQs based on user questions and feature updates
   */
  static async generateFAQWithAI(question, role, category, context = '') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });
      
      const prompt = `
You are an expert FAQ writer for ConnectBook, an AI-powered educational platform.

Generate a comprehensive FAQ entry for the following:

**Role**: ${role}
**Category**: ${category}
**Question**: ${question}

${context ? `**Additional Context**: ${context}` : ''}

**ConnectBook Platform Overview**:
ConnectBook integrates AI-based education, communication, assessment, and simulation tools including:
- CourseMaster (courses & certificates)
- GradeMaster (AI-powered grading)
- Study Planner & Career Advisor
- Interview Simulator & Internship Simulator
- MentorConnect (student-teacher-parent communication)
- Real-Time Updates (AI-curated news)
- Lecture Short Notes (AI transcription)
- AI Chatbot Assistant

Please provide:
1. A **short answer** (1-2 sentences, max 150 characters)
2. A **detailed answer** (comprehensive, 3-5 paragraphs, with step-by-step guidance if applicable)
3. **Related features** (list features that are relevant, with format "FeatureName")
4. **Search keywords** (5-10 relevant terms for search optimization)

Format your response as JSON:
{
  "shortAnswer": "brief answer here",
  "longAnswer": "detailed answer with formatting like **bold**, *italic*, and bullet points using - ",
  "relatedFeatures": ["GradeMaster", "CourseMaster"],
  "keywords": ["grades", "marks", "results", "performance"]
}
`;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Parse AI response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }
      
      const aiResponse = JSON.parse(jsonMatch[0]);
      
      return {
        question,
        shortAnswer: aiResponse.shortAnswer,
        longAnswer: aiResponse.longAnswer,
        relatedFeatures: this.mapRelatedFeatures(aiResponse.relatedFeatures, role),
        keywords: aiResponse.keywords,
        role,
        category,
        aiGenerated: true,
        lastAIUpdate: new Date()
      };
    } catch (error) {
      console.error('Error generating FAQ with AI:', error);
      
      // Return fallback structure
      return {
        question,
        shortAnswer: 'Please check the documentation or contact support for assistance.',
        longAnswer: 'We are currently unable to generate a detailed answer. Please refer to the user guide or reach out to our support team for personalized help.',
        relatedFeatures: [],
        keywords: [question.toLowerCase().split(' ')[0]],
        role,
        category,
        aiGenerated: false
      };
    }
  }
  
  /**
   * Map feature names to routes
   */
  static mapRelatedFeatures(featureNames, role) {
    const routeMap = {
      student: {
        'Dashboard': '/dashboard/student',
        'Attendance': '/dashboard/student/attendance',
        'GradeMaster': '/dashboard/student/grades',
        'CourseMaster': '/dashboard/student/courses',
        'Study Planner': '/dashboard/student/study-planner',
        'Career Advisor': '/dashboard/student/career-advisor',
        'Lecture Notes': '/dashboard/student/lecture-notes',
        'Interview Simulator': '/dashboard/student/interview-simulator',
        'Internship Simulator': '/dashboard/student/internship-simulator',
        'MentorConnect': '/dashboard/student/mentor-connect',
        'Real-Time Updates': '/dashboard/student/real-time-updates'
      },
      teacher: {
        'Dashboard': '/dashboard/teacher',
        'CourseMaster': '/dashboard/teacher/courses',
        'GradeMaster': '/dashboard/teacher/grading',
        'Attendance': '/dashboard/teacher/attendance',
        'Lectures': '/dashboard/teacher/lectures',
        'MentorConnect': '/dashboard/teacher/mentor-connect',
        'Real-Time Updates': '/dashboard/teacher/real-time-updates'
      },
      parent: {
        'Dashboard': '/dashboard/parent',
        'Grades': '/dashboard/parent/grades',
        'Attendance': '/dashboard/parent/attendance',
        'Insights': '/dashboard/parent/insights',
        'MentorConnect': '/dashboard/parent/mentor-connect'
      }
    };
    
    const roleRoutes = routeMap[role] || routeMap.student;
    
    return featureNames.map(name => ({
      name: name.trim(),
      route: roleRoutes[name.trim()] || '#'
    }));
  }
  
  /**
   * Update existing FAQs with AI improvements
   * Checks FAQs that need improvement and regenerates them
   */
  static async updateFAQsWithAI() {
    try {
      const needImprovement = await FAQFeedback.getFAQsNeedingImprovement(50);
      const updatedFAQs = [];
      
      for (const faqStat of needImprovement) {
        const faq = await FAQ.findById(faqStat._id);
        if (!faq) continue;
        
        // Regenerate FAQ with AI
        const improved = await this.generateFAQWithAI(
          faq.question,
          faq.role,
          faq.category,
          `This FAQ has a ${faqStat.helpfulPercentage}% helpful rate. Please improve the answer to be more clear and actionable.`
        );
        
        // Update FAQ
        faq.shortAnswer = improved.shortAnswer;
        faq.longAnswer = improved.longAnswer;
        faq.relatedFeatures = improved.relatedFeatures;
        faq.keywords = improved.keywords;
        faq.lastAIUpdate = new Date();
        faq.updatedAt = new Date();
        
        await faq.save();
        updatedFAQs.push(faq);
        
        // Rate limiting - wait 5 seconds between AI calls
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      return {
        updated: updatedFAQs.length,
        faqs: updatedFAQs
      };
    } catch (error) {
      console.error('Error updating FAQs with AI:', error);
      throw error;
    }
  }
  
  /**
   * Create a new FAQ (manual or AI-generated)
   */
  static async createFAQ(faqData, useAI = false) {
    try {
      let finalData = faqData;
      
      if (useAI) {
        finalData = await this.generateFAQWithAI(
          faqData.question,
          faqData.role,
          faqData.category,
          faqData.context
        );
      }
      
      const faq = new FAQ(finalData);
      return await faq.save();
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing FAQ
   */
  static async updateFAQ(faqId, updates) {
    try {
      updates.updatedAt = new Date();
      return await FAQ.findByIdAndUpdate(faqId, updates, { new: true });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }
  
  /**
   * Delete an FAQ (soft delete by marking inactive)
   */
  static async deleteFAQ(faqId) {
    try {
      return await FAQ.findByIdAndUpdate(
        faqId,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }
}

export default FAQService;
