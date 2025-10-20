import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import FAQ from './models/FAQ.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

/**
 * Comprehensive FAQ Data for ConnectBook Platform
 */
const faqData = [
  // ============ STUDENT FAQs ============
  
  // Category: Account and Login Issues
  {
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

**Important**: The reset link expires after 1 hour for security reasons. If expired, request a new reset link.

**Still having issues?** Contact your teacher or email support@connectbook.com`,
    relatedFeatures: [
      { name: 'Dashboard', route: '/dashboard/student' }
    ],
    keywords: ['password', 'reset', 'forgot', 'login', 'account', 'email'],
    order: 1
  },
  {
    role: 'student',
    category: 'Account and Login Issues',
    question: 'Why can\'t I log in to my account?',
    shortAnswer: 'Check your credentials, internet connection, and account status. Contact support if issues persist.',
    longAnswer: `Common reasons for login failures:

**1. Incorrect Credentials**
   - Double-check your username/email and password
   - Passwords are case-sensitive
   - Try the "Forgot Password" option

**2. Account Not Activated**
   - Check your email for an activation link
   - Ask your teacher if your account has been created

**3. Account Suspended**
   - Contact your teacher or school admin
   - Check for emails about account status

**4. Technical Issues**
   - Clear browser cache and cookies
   - Try a different browser (Chrome, Firefox, Edge)
   - Check your internet connection
   - Disable browser extensions temporarily

**5. Server Maintenance**
   - Check for maintenance notices on the login page
   - Try again after a few minutes

**Need Help?** Contact your teacher or email support@connectbook.com with your registered email.`,
    relatedFeatures: [
      { name: 'Dashboard', route: '/dashboard/student' }
    ],
    keywords: ['login', 'cant log in', 'access', 'account', 'credentials', 'suspended'],
    order: 2
  },

  // Category: Using CourseMaster
  {
    role: 'student',
    category: 'Using CourseMaster (Courses & Certificates)',
    question: 'How do I enroll in a course?',
    shortAnswer: 'Go to CourseMaster, browse available courses, and click "Enroll Now" on your desired course.',
    longAnswer: `**Enrolling in Courses on ConnectBook:**

1. **Navigate to CourseMaster**
   - Click **"CourseMaster"** in your sidebar menu
   - Or use the chatbot to navigate

2. **Browse Available Courses**
   - View all courses on the main page
   - Filter by category, difficulty, or instructor
   - Use the search bar to find specific courses

3. **Select a Course**
   - Click on a course card to view details
   - Review the course description, duration, and syllabus
   - Check prerequisites if any

4. **Enroll**
   - Click the **"Enroll Now"** button
   - Confirm your enrollment
   - The course will appear in "My Courses"

5. **Start Learning**
   - Access course materials from "My Courses"
   - Complete lessons, quizzes, and assignments
   - Track your progress on the dashboard

**Note**: Some courses may require teacher approval before enrollment.`,
    relatedFeatures: [
      { name: 'CourseMaster', route: '/dashboard/student/courses' },
      { name: 'Dashboard', route: '/dashboard/student' }
    ],
    keywords: ['enroll', 'course', 'coursemaster', 'join', 'register', 'class'],
    order: 1
  },
  {
    role: 'student',
    category: 'Using CourseMaster (Courses & Certificates)',
    question: 'How do I get my course certificate?',
    shortAnswer: 'Complete all course requirements and quizzes with a passing grade to automatically receive your certificate.',
    longAnswer: `**Getting Your Course Certificate:**

**Requirements:**
- Complete all course modules (100% progress)
- Pass all quizzes with minimum 60% score
- Submit all required assignments

**Certificate Generation:**
1. Once you meet all requirements, your certificate is **automatically generated**
2. Go to **CourseMaster** → **"My Certificates"** tab
3. Your certificate will be available for download

**Certificate Details:**
- **PDF Format**: High-quality printable certificate
- **Verification Code**: Unique code for authenticity
- **Includes**: Your name, course name, completion date, grade

**Downloading:**
- Click **"Download Certificate"** button
- Save the PDF to your device
- Print or share digitally

**Troubleshooting:**
- If certificate not generated after completion, refresh the page
- Check if all modules show 100% completion
- Verify all quiz scores are above 60%
- Contact your instructor if issues persist

**Certificate Validity**: All ConnectBook certificates are digitally signed and can be verified using the unique code.`,
    relatedFeatures: [
      { name: 'CourseMaster', route: '/dashboard/student/courses' }
    ],
    keywords: ['certificate', 'completion', 'download', 'course', 'achievement', 'credential'],
    order: 2
  },

  // Category: GradeMaster and AI Grading
  {
    role: 'student',
    category: 'GradeMaster and AI Grading',
    question: 'How does AI grading work?',
    shortAnswer: 'AI analyzes your answers using advanced algorithms to evaluate correctness, completeness, and quality.',
    longAnswer: `**ConnectBook's AI Grading System (Powered by Google Gemini):**

**How It Works:**
1. **Submission**: You submit your assignment/quiz answer
2. **AI Analysis**: Gemini AI reads and analyzes your response
3. **Evaluation Criteria**:
   - **Correctness**: Is the answer accurate?
   - **Completeness**: Did you cover all key points?
   - **Clarity**: Is the explanation clear?
   - **Depth**: Level of understanding demonstrated

4. **Feedback Generation**: AI provides detailed feedback on:
   - What you did well
   - Areas for improvement
   - Suggestions for better answers
   - Score with justification

**Benefits:**
- **Instant Results**: Get grades immediately after submission
- **Detailed Feedback**: Learn from specific comments
- **Fair Evaluation**: Consistent grading criteria
- **24/7 Availability**: Submit anytime

**Important Notes:**
- Teachers can review and adjust AI grades if needed
- For subjective questions, AI provides initial assessment
- Complex projects may require manual teacher review
- AI learns from teacher adjustments to improve

**Viewing Your Grades:**
- Go to **GradeMaster** to see all your grades
- Click on any grade to see detailed AI feedback
- Track your performance over time with analytics`,
    relatedFeatures: [
      { name: 'GradeMaster', route: '/dashboard/student/grades' },
      { name: 'CourseMaster', route: '/dashboard/student/courses' }
    ],
    keywords: ['ai grading', 'gemini', 'grademaster', 'automatic grading', 'feedback', 'evaluation'],
    order: 1
  },
  {
    role: 'student',
    category: 'GradeMaster and AI Grading',
    question: 'Can I challenge or appeal my grade?',
    shortAnswer: 'Yes, you can request a manual review from your teacher through GradeMaster.',
    longAnswer: `**Grade Appeal Process:**

**When to Appeal:**
- You believe the AI grading was incorrect
- Your answer was marked wrong but you think it's correct
- Partial credit wasn't given where deserved
- Technical issues during submission

**How to Appeal:**
1. Go to **GradeMaster**
2. Find the assignment/quiz you want to appeal
3. Click **"Request Review"** button
4. Provide a clear explanation:
   - Why you think the grade is incorrect
   - Reference specific parts of your answer
   - Attach any supporting materials

5. Submit the appeal
6. Your teacher will be notified automatically

**Review Process:**
- Teacher reviews your submission and appeal
- They can:
  - Adjust your grade
  - Provide additional feedback
  - Keep the original grade with explanation

- You'll receive notification when review is complete
- Timeline: Usually 2-3 business days

**Best Practices:**
- Be respectful and professional
- Provide specific reasons (not just "I deserve more marks")
- Submit appeals within 7 days of receiving the grade
- Only appeal if you have valid reasons

**Note**: Frivolous or repeated appeals may affect your relationship with teachers.`,
    relatedFeatures: [
      { name: 'GradeMaster', route: '/dashboard/student/grades' },
      { name: 'MentorConnect', route: '/dashboard/student/mentor-connect' }
    ],
    keywords: ['appeal', 'challenge', 'grade', 'review', 'regrade', 'dispute'],
    order: 2
  },

  // Category: Interview Simulator
  {
    role: 'student',
    category: 'Interview Simulator',
    question: 'How do I use the Interview Simulator?',
    shortAnswer: 'Choose an interview type, answer AI-generated questions, and receive instant feedback on your responses.',
    longAnswer: `**Using ConnectBook's Interview Simulator:**

**Step-by-Step Guide:**

1. **Access the Simulator**
   - Go to **Interview Simulator** from sidebar
   - Click **"Start New Interview"**

2. **Choose Interview Type**
   - Technical Interview (programming, problem-solving)
   - HR Interview (behavioral questions)
   - Domain-Specific (field-related questions)

3. **Select Difficulty**
   - Beginner: Entry-level questions
   - Intermediate: Mid-level questions
   - Advanced: Senior-level questions

4. **Start Interview**
   - AI generates 5-10 questions based on your selection
   - Questions appear one at a time
   - Type your answers (no time limit, but tracked)

5. **Receive Feedback**
   - **After each answer**: Quick AI analysis
   - **After completion**: Comprehensive report with:
     - Overall score
     - Strengths and weaknesses
     - Communication quality
     - Technical accuracy
     - Suggestions for improvement

**Features:**
- **Voice Recording**: Practice speaking answers (coming soon)
- **Save Sessions**: Review past interviews
- **Progress Tracking**: See improvement over time
- **Company-Specific**: Practice for specific companies

**Tips for Best Results:**
- Answer honestly (AI detects generic responses)
- Take your time to think
- Provide detailed explanations
- Practice regularly`,
    relatedFeatures: [
      { name: 'Interview Simulator', route: '/dashboard/student/interview-simulator' },
      { name: 'Career Advisor', route: '/dashboard/student/career-advisor' }
    ],
    keywords: ['interview', 'simulator', 'practice', 'mock interview', 'preparation', 'ai interview'],
    order: 1
  },

  // Category: Internship Simulator
  {
    role: 'student',
    category: 'Internship Simulator',
    question: 'What is the Internship Simulator and how does it work?',
    shortAnswer: 'It\'s a virtual internship experience where you complete real-world tasks and receive professional feedback.',
    longAnswer: `**Internship Simulator - Real-World Experience:**

**What It Is:**
A virtual internship program that simulates actual workplace projects and tasks, helping you gain practical experience before entering the job market.

**How It Works:**

1. **Choose an Internship**
   - Browse available virtual internships
   - Options: Software Development, Data Analysis, Marketing, Design, etc.
   - Select based on your interests and career goals

2. **Enrollment**
   - Apply for the internship
   - Review project brief and requirements
   - Accept the terms

3. **Complete Tasks**
   - Receive weekly tasks (similar to real internships)
   - Tasks include:
     - Project work
     - Reports and documentation
     - Problem-solving challenges
     - Team collaboration (if group internship)

4. **Submit Work**
   - Upload your completed tasks
   - AI evaluates immediately
   - Receive detailed feedback

5. **Earn Certificate**
   - Complete all tasks successfully
   - Receive official Internship Completion Certificate
   - Add to your resume/LinkedIn

**Features:**
- **Real Projects**: Based on actual industry scenarios
- **Deadlines**: Learn time management
- **Feedback**: Detailed AI and mentor feedback
- **Portfolio**: Build your professional portfolio
- **Networking**: Connect with other virtual interns

**Benefits:**
- Gain practical experience
- Enhance your resume
- Learn industry best practices
- Discover your interests
- Prepare for real internships`,
    relatedFeatures: [
      { name: 'Internship Simulator', route: '/dashboard/student/internship-simulator' },
      { name: 'Career Advisor', route: '/dashboard/student/career-advisor' }
    ],
    keywords: ['internship', 'simulator', 'virtual internship', 'experience', 'projects', 'certificate'],
    order: 1
  },

  // Category: Study Planner & Career Advisor
  {
    role: 'student',
    category: 'Study Planner & Career Advisor',
    question: 'How does the AI Study Planner create my schedule?',
    shortAnswer: 'AI analyzes your courses, deadlines, and preferences to generate a personalized study schedule.',
    longAnswer: `**AI-Powered Study Planner:**

**How It Creates Your Schedule:**

1. **Data Collection**:
   - Your enrolled courses
   - Upcoming assignments and exams
   - Current grades and weak areas
   - Study preferences (morning/night person)
   - Daily available time

2. **AI Analysis**:
   - Prioritizes based on deadlines
   - Identifies topics needing more attention
   - Considers your learning pace
   - Balances workload across days

3. **Schedule Generation**:
   - Creates day-by-day study plan
   - Allocates time for each subject
   - Includes breaks and revision time
   - Suggests optimal study times

**Using Your Study Plan:**

1. Go to **Study Planner**
2. View your daily schedule
3. Mark tasks as completed
4. AI adjusts future plans based on progress

**Features:**
- **Smart Notifications**: Reminders for study sessions
- **Progress Tracking**: Visual progress bars
- **Flexibility**: Manually adjust if needed
- **Analytics**: See study time per subject
- **Goal Setting**: Set and track study goals

**Tips:**
- Update your progress daily
- Mark completed tasks promptly
- Adjust AI suggestions if needed
- Sync with your personal calendar`,
    relatedFeatures: [
      { name: 'Study Planner', route: '/dashboard/student/study-planner' },
      { name: 'Dashboard', route: '/dashboard/student' }
    ],
    keywords: ['study planner', 'schedule', 'ai planner', 'study schedule', 'time management'],
    order: 1
  },
  {
    role: 'student',
    category: 'Study Planner & Career Advisor',
    question: 'What can the Career Advisor help me with?',
    shortAnswer: 'Career Advisor provides AI-powered career guidance, skill recommendations, and personalized career paths.',
    longAnswer: `**Career Advisor - Your AI Career Guide:**

**Features:**

**1. Career Path Recommendations**
   - Based on your interests and skills
   - Analysis of your academic performance
   - Industry trends and job market insights
   - Personalized career suggestions

**2. Skill Gap Analysis**
   - Identifies skills you need
   - Compares your skills with industry requirements
   - Suggests courses and resources
   - Tracks skill development

**3. Job Market Insights**
   - Current demand for different roles
   - Salary expectations
   - Required qualifications
   - Growth opportunities

**4. Resume & Interview Tips**
   - Resume building guidance
   - Interview preparation strategies
   - Common interview questions
   - Professional communication tips

**5. Educational Guidance**
   - Recommended courses on ConnectBook
   - External certifications to pursue
   - Higher education suggestions
   - Scholarship opportunities

**How to Use:**

1. Go to **Career Advisor**
2. Complete career assessment (if first time)
3. Explore AI-generated career recommendations
4. Click on any career for detailed information
5. Follow suggested action plans
6. Track your progress

**AI Chat Feature:**
- Ask specific career questions
- Get instant AI responses
- Receive personalized advice
- Explore different career options

**Example Questions:**
- "What career suits my skills?"
- "How do I become a data scientist?"
- "What skills do I need for software development?"
- "Should I pursue higher studies or start working?"`,
    relatedFeatures: [
      { name: 'Career Advisor', route: '/dashboard/student/career-advisor' },
      { name: 'CourseMaster', route: '/dashboard/student/courses' },
      { name: 'Interview Simulator', route: '/dashboard/student/interview-simulator' }
    ],
    keywords: ['career', 'advisor', 'guidance', 'job', 'skills', 'career path'],
    order: 2
  },

  // Category: Real-Time Updates and AI Chatbot
  {
    role: 'student',
    category: 'Real-Time Updates and AI Chatbot Usage',
    question: 'How do I use the AI Chatbot Assistant?',
    shortAnswer: 'Click the chatbot icon (bottom-left), type your question, and get instant AI-powered responses.',
    longAnswer: `**ConnectBook AI Chatbot Assistant:**

**Accessing the Chatbot:**
- Look for the **blue chat icon** at bottom-left of your screen
- Click to open the chat window
- Available on all pages

**What It Can Do:**

**1. Navigation Help**
   - "Take me to GradeMaster"
   - "Show my attendance"
   - "Open Career Advisor"
   - Instant navigation to any feature

**2. Feature Information**
   - "What is CourseMaster?"
   - "How does AI grading work?"
   - "Explain Interview Simulator"
   - Get detailed explanations

**3. Quick Actions**
   - Click **"Menu"** for feature shortcuts
   - Access frequently used pages
   - View system status

**4. PoornaGPT Integration**
   - Ask about advanced AI tools
   - Get redirected to PoornaGPT platform
   - Extended AI capabilities

**Using the Chatbot:**

1. **Type Your Question**
   - Use natural language
   - Be specific for better results
   - Examples:
     - "How do I reset my password?"
     - "Show my recent grades"
     - "When is my next assignment due?"

2. **Review Response**
   - AI provides detailed answer
   - May include navigation buttons
   - Click buttons for quick actions

3. **Follow-Up**
   - Ask clarifying questions
   - Chat history is maintained
   - Context-aware responses

**Tips for Best Results:**
- Be clear and specific
- Ask one question at a time
- Use the Menu for quick navigation
- Provide feedback (helpful/not helpful)

**Privacy**: Your chat history is private and used only to improve responses.`,
    relatedFeatures: [
      { name: 'Dashboard', route: '/dashboard/student' }
    ],
    keywords: ['chatbot', 'ai assistant', 'help', 'chat', 'support', 'ai chat'],
    order: 1
  },

  // ============ TEACHER FAQs ============
  
  // Category: Creating & Publishing Courses
  {
    role: 'teacher',
    category: 'Creating & Publishing Courses',
    question: 'How do I create a new course?',
    shortAnswer: 'Go to CourseMaster, click "Create Course", fill in details, add modules, and publish.',
    longAnswer: `**Creating Courses on ConnectBook:**

**Step-by-Step:**

1. **Access Course Creation**
   - Go to **CourseMaster** from teacher dashboard
   - Click **"Create New Course"** button

2. **Basic Information**
   - **Course Title**: Clear, descriptive name
   - **Category**: Select appropriate category
   - **Difficulty**: Beginner/Intermediate/Advanced
   - **Duration**: Estimated completion time
   - **Description**: Detailed course overview
   - **Prerequisites**: Any required prior knowledge

3. **Add Course Content**
   - **Modules**: Organize content into modules
   - **Lessons**: Add lessons within modules
   - **Materials**: Upload:
     - PDFs, documents
     - Videos
     - Presentations
     - External links

4. **Add Assessments**
   - **Quizzes**: Multiple choice, true/false, short answer
   - **Assignments**: Project-based assessments
   - **Grading Criteria**: Define evaluation parameters

5. **Set Course Settings**
   - **Enrollment**: Open/Approval Required
   - **Visibility**: Public/Private
   - **Certificate**: Enable/disable certificates
   - **Passing Grade**: Set minimum score

6. **Preview & Publish**
   - Preview as student would see it
   - Make final adjustments
   - Click **"Publish Course"**

**After Publishing:**
- Course appears in student catalog
- Monitor enrollments
- Track student progress
- Update content anytime

**Best Practices:**
- Start with clear learning objectives
- Use multimedia content
- Include regular assessments
- Provide clear instructions
- Update regularly based on feedback`,
    relatedFeatures: [
      { name: 'CourseMaster', route: '/dashboard/teacher/courses' },
      { name: 'Dashboard', route: '/dashboard/teacher' }
    ],
    keywords: ['create course', 'new course', 'coursemaster', 'publish', 'teaching'],
    order: 1
  },

  // Category: Managing Grades
  {
    role: 'teacher',
    category: 'Managing Grades in GradeMaster',
    question: 'How do I review and adjust AI-generated grades?',
    shortAnswer: 'Go to GradeMaster, select a submission, review AI grading, and adjust if needed.',
    longAnswer: `**Reviewing & Adjusting AI Grades:**

**Access Student Submissions:**
1. Go to **GradeMaster** → **"Grade Management"**
2. Select course and assignment
3. View all student submissions

**For Each Submission:**

**1. View AI Evaluation**
   - **Score**: AI-assigned grade
   - **Feedback**: Detailed AI comments
   - **Rubric**: Criteria breakdown
   - **Confidence**: AI confidence level

**2. Review Student Answer**
   - Read the full submission
   - Compare with correct answer/rubric
   - Consider context and effort

**3. AI Feedback Analysis**
   - Is the AI feedback accurate?
   - Did AI catch all key points?
   - Are there nuances AI missed?

**4. Manual Adjustment (if needed)**
   - Click **"Adjust Grade"**
   - Change score (0-100)
   - Add/edit feedback comments
   - Provide reason for adjustment
   - Save changes

**5. Bulk Actions**
   - Review multiple submissions
   - Filter by score range
   - Approve all AI grades at once
   - Export grade reports

**When to Adjust:**
- AI misunderstood context
- Student showed exceptional work
- Answer style differs but is correct
- Partial credit warranted
- Extenuating circumstances

**System Learning:**
- AI learns from your adjustments
- Future grading improves
- Your input helps train the system

**Student Notification:**
- Students notified of grade changes
- Your feedback comments visible to students
- Maintains transparency

**Grading Analytics:**
- Track AI accuracy
- Monitor grade distributions
- Identify common errors`,
    relatedFeatures: [
      { name: 'GradeMaster', route: '/dashboard/teacher/grading' },
      { name: 'CourseMaster', route: '/dashboard/teacher/courses' }
    ],
    keywords: ['grading', 'ai grading', 'review grades', 'adjust grades', 'grademaster'],
    order: 1
  },

  // Category: Mentor Connect
  {
    role: 'teacher',
    category: 'Mentor Connect Usage',
    question: 'How do I use MentorConnect to communicate with students and parents?',
    shortAnswer: 'Access MentorConnect to send messages, schedule meetings, and respond to queries from students and parents.',
    longAnswer: `**MentorConnect - Communication Hub:**

**Features:**

**1. Messaging**
   - **Direct Messages**: One-on-one chat with students/parents
   - **Group Chats**: Class or project groups
   - **Announcements**: Broadcast to all students

**2. Meetings**
   - **Schedule Meetings**: Set up virtual meetings
   - **Meeting Rooms**: Integrated video conferencing
   - **Calendar**: View all scheduled meetings

**3. Notifications**
   - Get notified of new messages
   - Meeting reminders
   - Parent inquiry alerts

**Using MentorConnect:**

**Messaging Students:**
1. Go to **MentorConnect** → **"Messages"**
2. Click **"New Message"**
3. Select student(s)
4. Type message
5. Send

**Communicating with Parents:**
1. Same interface as student messaging
2. Parent can see their child's conversations
3. Discuss progress, concerns, achievements

**Scheduling Meetings:**
1. Go to **"Meetings"** tab
2. Click **"Schedule New Meeting"**
3. Select participants
4. Set date, time, duration
5. Add agenda (optional)
6. Send invites

**Best Practices:**
- Respond within 24 hours
- Be professional and clear
- Document important conversations
- Use meetings for complex discussions
- Keep parents informed of major issues

**Privacy:**
- All conversations are encrypted
- Maintain student confidentiality
- Follow school policies`,
    relatedFeatures: [
      { name: 'MentorConnect', route: '/dashboard/teacher/mentor-connect' },
      { name: 'Dashboard', route: '/dashboard/teacher' }
    ],
    keywords: ['mentor connect', 'communication', 'messaging', 'meetings', 'parent contact'],
    order: 1
  },

  // ============ PARENT FAQs ============
  
  // Category: Viewing Student Progress
  {
    role: 'parent',
    category: 'Viewing Student Grades and Course Progress',
    question: 'How can I track my child\'s academic progress?',
    shortAnswer: 'Access the Parent Dashboard to view grades, attendance, course progress, and performance analytics.',
    longAnswer: `**Tracking Your Child's Progress:**

**Parent Dashboard Overview:**

**1. Performance Summary**
   - Overall GPA
   - Recent grades
   - Attendance percentage
   - Active courses

**2. Detailed Grades View**
   - Go to **"Grades"** section
   - See all assignments and quizzes
   - View scores and feedback
   - Track trends over time

**3. Course Progress**
   - Current enrollments
   - Completion percentages
   - Upcoming deadlines
   - Course performance

**4. Attendance Tracking**
   - Daily attendance records
   - Absence history
   - Late arrivals
   - Leave requests

**5. Insights & Analytics**
   - Strengths and weaknesses
   - Subject-wise performance
   - Comparison with class average
   - AI-generated insights

**How to Use:**

**Viewing Grades:**
1. Go to **"Grades"** → **"All Grades"**
2. Filter by subject or date
3. Click on any grade for details
4. View teacher feedback

**Course Progress:**
1. Go to **"Course Progress"**
2. See all enrolled courses
3. Check completion status
4. View upcoming assignments

**Setting Up Alerts:**
- Enable notifications for:
  - New grades posted
  - Low performance alerts
  - Attendance issues
  - Important announcements

**Comparing Performance:**
- View class averages
- Track improvement over time
- Identify areas needing support

**Taking Action:**
- Contact teachers via MentorConnect
- Schedule parent-teacher meetings
- Encourage your child based on insights`,
    relatedFeatures: [
      { name: 'Dashboard', route: '/dashboard/parent' },
      { name: 'Grades', route: '/dashboard/parent/grades' },
      { name: 'Insights', route: '/dashboard/parent/insights' }
    ],
    keywords: ['progress', 'grades', 'tracking', 'performance', 'parent dashboard', 'monitoring'],
    order: 1
  },

  // Category: Mentor Connect Communication
  {
    role: 'parent',
    category: 'Mentor Connect Communication',
    question: 'How do I communicate with my child\'s teachers?',
    shortAnswer: 'Use MentorConnect to send messages or schedule meetings with teachers directly.',
    longAnswer: `**Parent-Teacher Communication via MentorConnect:**

**Accessing MentorConnect:**
1. Go to **"MentorConnect"** from sidebar
2. View all your child's teachers
3. See message history

**Sending Messages:**

**1. New Message**
   - Click **"New Message"**
   - Select teacher (subject/class)
   - Type your message
   - Send

**2. Message Types**
   - **General Inquiry**: Questions about course/performance
   - **Concern**: Behavioral or academic issues
   - **Meeting Request**: Request for discussion
   - **Appreciation**: Positive feedback

**Scheduling Meetings:**
1. Click **"Schedule Meeting"**
2. Select teacher
3. Propose date/time options
4. Add reason for meeting
5. Wait for teacher confirmation

**Best Practices:**

**Communication Etiquette:**
- Be respectful and professional
- State purpose clearly
- Provide context if needed
- Allow 24-48 hours for response

**What to Discuss:**
- Academic performance
- Behavioral concerns
- Learning difficulties
- Extracurricular opportunities
- Special accommodations

**When to Contact:**
- Significant grade drop
- Consistent absence
- Behavioral changes
- Questions about assignments
- Celebration of achievements

**Emergency Situations:**
- For urgent matters, call school directly
- MentorConnect for non-urgent communication
- Follow school's emergency protocols

**Privacy & Security:**
- Messages are private and secure
- Teachers cannot share other students' information
- Maintain confidentiality

**Tips:**
- Check MentorConnect regularly
- Respond to teacher messages promptly
- Keep communication constructive
- Work collaboratively with teachers`,
    relatedFeatures: [
      { name: 'MentorConnect', route: '/dashboard/parent/mentor-connect' },
      { name: 'Dashboard', route: '/dashboard/parent' }
    ],
    keywords: ['mentor connect', 'teacher communication', 'messages', 'parent teacher', 'contact'],
    order: 1
  },

  // Category: Monitoring Activities
  {
    role: 'parent',
    category: 'Monitoring Student Activities and Attendance',
    question: 'How can I monitor my child\'s attendance?',
    shortAnswer: 'View real-time attendance records, absence history, and receive alerts for attendance issues.',
    longAnswer: `**Attendance Monitoring for Parents:**

**Accessing Attendance:**
1. Go to **"Attendance"** from your dashboard
2. View comprehensive attendance records

**Attendance Dashboard:**

**1. Overview**
   - Current attendance percentage
   - Total present/absent days
   - Late arrivals count
   - Monthly trends

**2. Calendar View**
   - Visual calendar showing:
     - ✅ Present days (green)
     - ❌ Absent days (red)
     - ⏰ Late arrivals (orange)
     - 📅 Holidays (gray)

**3. Detailed Records**
   - Date-wise breakdown
   - Subject-wise attendance (if applicable)
   - Reason for absence (if provided)
   - Time of arrival/departure

**4. Patterns & Insights**
   - Attendance trends
   - Most missed subjects
   - Peak absence periods
   - AI-generated insights

**Setting Up Alerts:**

**Notification Options:**
- Absence notification (real-time)
- Late arrival alerts
- Low attendance warnings (<85%)
- Weekly attendance summary

**How to Enable:**
1. Go to **"Settings"** → **"Notifications"**
2. Toggle attendance alerts
3. Choose notification method (email/SMS)
4. Save preferences

**Taking Action:**

**If Attendance is Low:**
1. Review absence reasons
2. Discuss with your child
3. Check for underlying issues:
   - Health problems
   - Transportation issues
   - Academic difficulties
   - Social concerns

4. Contact teachers via MentorConnect
5. Schedule meeting if needed
6. Work on improvement plan

**Reporting Absences:**
- Submit leave requests in advance
- Provide medical certificates if needed
- Use app to notify school
- Follow up with teachers for missed work

**Attendance Impact:**
- Affects overall performance
- May impact eligibility for exams
- Certificates require minimum attendance
- Some schools have attendance policies

**Positive Reinforcement:**
- Acknowledge good attendance
- Discuss importance of regularity
- Set attendance goals together`,
    relatedFeatures: [
      { name: 'Attendance', route: '/dashboard/parent/attendance' },
      { name: 'Dashboard', route: '/dashboard/parent' },
      { name: 'Insights', route: '/dashboard/parent/insights' }
    ],
    keywords: ['attendance', 'monitoring', 'absence', 'present', 'tracking', 'alerts'],
    order: 1
  },

  // ============ COMMON FAQs (All Roles) ============
  
  {
    role: 'all',
    category: 'General',
    question: 'What is ConnectBook?',
    shortAnswer: 'ConnectBook is an AI-powered educational platform connecting students, teachers, and parents.',
    longAnswer: `**ConnectBook - Comprehensive Educational Ecosystem**

ConnectBook is a cutting-edge educational platform that integrates **AI-based learning**, **communication**, **assessment**, and **simulation tools** to create a holistic educational experience.

**Core Philosophy:**
Bridging the gap between traditional education and modern technology to provide **personalized**, **data-driven**, and **engaging** learning experiences.

**Key Components:**

**For Students:**
- AI-powered learning and assessment
- Career guidance and skill development
- Real-world simulations (interviews, internships)
- Personalized study planning
- Interactive courses and certifications

**For Teachers:**
- Efficient course creation and management
- AI-assisted grading and feedback
- Student progress analytics
- Streamlined communication
- Data-driven insights

**For Parents:**
- Real-time progress monitoring
- Direct teacher communication
- Comprehensive attendance tracking
- Performance insights and alerts
- Active involvement in education

**Technology Stack:**
- **Google Gemini AI**: Advanced AI capabilities
- **Cloud-Based**: Access anywhere, anytime
- **Secure**: Enterprise-grade security
- **Mobile-Responsive**: Works on all devices

**Vision:**
To transform education through technology while maintaining the human touch that makes learning meaningful.`,
    relatedFeatures: [],
    keywords: ['connectbook', 'platform', 'about', 'what is', 'overview'],
    order: 1
  },
  
  {
    role: 'all',
    category: 'General',
    question: 'How do I update my profile information?',
    shortAnswer: 'Go to your Dashboard, click on your profile icon, and select "Edit Profile" to update your information.',
    longAnswer: `**Updating Your Profile:**

**Step-by-Step Guide:**

1. **Access Profile Settings**
   - Click on your profile icon (top-right corner)
   - Select **"Profile"** or **"Edit Profile"**

2. **Update Personal Information**
   - Name and contact details
   - Email address
   - Phone number
   - Profile picture

3. **Update Password** (if needed)
   - Click **"Change Password"**
   - Enter current password
   - Enter new password (min 8 characters)
   - Confirm new password

4. **Update Preferences**
   - Notification settings
   - Language preferences
   - Theme (light/dark mode)
   - Email preferences

5. **Save Changes**
   - Review all changes
   - Click **"Save"** or **"Update Profile"**
   - Confirmation message will appear

**Profile Picture:**
- Click on profile picture to upload new one
- Accepted formats: JPG, PNG, GIF
- Max size: 5MB
- Recommended: Square image (500x500px)

**Important Notes:**
- Email changes require verification
- Some fields may be locked by administrator
- Changes are reflected immediately
- Old sessions remain active until logout

**Privacy Settings:**
- Control who can see your profile
- Manage visibility of personal information
- Set communication preferences`,
    relatedFeatures: [
      { name: 'Dashboard', route: '/dashboard/student' }
    ],
    keywords: ['profile', 'update', 'edit', 'personal information', 'settings', 'change'],
    order: 2
  },
  
  {
    role: 'all',
    category: 'General',
    question: 'Is my data secure on ConnectBook?',
    shortAnswer: 'Yes, ConnectBook uses enterprise-grade security including encryption, secure authentication, and regular security audits.',
    longAnswer: `**ConnectBook Security & Privacy:**

**Data Protection Measures:**

**1. Encryption**
   - All data encrypted in transit (SSL/TLS)
   - Database encryption at rest
   - Password hashing (bcrypt)
   - Secure token-based authentication

**2. Authentication & Access Control**
   - JWT (JSON Web Tokens) for sessions
   - Role-based access control (RBAC)
   - Multi-factor authentication option
   - Automatic session timeout

**3. Data Privacy**
   - Compliance with data protection regulations
   - Regular privacy audits
   - Transparent data usage policies
   - User consent management

**4. Infrastructure Security**
   - Secure cloud hosting
   - Regular security patches
   - Firewall protection
   - DDoS protection
   - Regular backups

**5. Monitoring & Response**
   - 24/7 security monitoring
   - Intrusion detection systems
   - Incident response team
   - Regular security assessments

**Your Rights:**
- Access your data anytime
- Request data deletion
- Export your data
- Update privacy preferences
- Report security concerns

**What We Collect:**
- Account information (name, email)
- Academic records (grades, attendance)
- Usage data (for improvement)
- Communication data (messages, feedback)

**What We DON'T Share:**
- Personal data with third parties (without consent)
- Academic records publicly
- Private messages
- Financial information

**Best Practices:**
- Use strong, unique passwords
- Don't share login credentials
- Log out on shared devices
- Report suspicious activity
- Keep contact information updated

**Contact Security Team:**
- Email: security@connectbook.com
- Report vulnerabilities: security@connectbook.com`,
    relatedFeatures: [],
    keywords: ['security', 'privacy', 'data protection', 'safe', 'encryption', 'secure'],
    order: 3
  },
  
  {
    role: 'all',
    category: 'Technical Support',
    question: 'What browsers are supported by ConnectBook?',
    shortAnswer: 'ConnectBook works best on Chrome, Firefox, Safari, and Edge (latest versions). Mobile browsers are also supported.',
    longAnswer: `**Supported Browsers & Devices:**

**Recommended Desktop Browsers:**

**Fully Supported:**
- ✅ **Google Chrome** (v90+)
- ✅ **Mozilla Firefox** (v88+)
- ✅ **Microsoft Edge** (v90+)
- ✅ **Safari** (v14+) - macOS

**Limited Support:**
- ⚠️ Internet Explorer - Not supported
- ⚠️ Older browser versions - May have issues

**Mobile Browsers:**
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Firefox Mobile
- ✅ Samsung Internet

**Operating Systems:**

**Desktop:**
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu, Fedora)

**Mobile:**
- iOS 13+
- Android 8+

**Features by Browser:**

**All Modern Browsers:**
- Full platform functionality
- Video conferencing
- File uploads
- Real-time updates
- Notifications

**Screen Resolutions:**
- Minimum: 1024x768
- Recommended: 1920x1080
- Mobile-responsive design

**Browser Settings:**

**Required:**
- JavaScript enabled
- Cookies enabled
- Pop-ups allowed (for meetings)
- Camera/Microphone permissions (for video features)

**Recommended:**
- Latest browser version
- Hardware acceleration enabled
- Disable aggressive ad blockers
- Allow notifications

**Troubleshooting:**

**If features don't work:**
1. Update your browser to latest version
2. Clear browser cache and cookies
3. Disable browser extensions temporarily
4. Check internet connection
5. Try incognito/private mode

**Performance Tips:**
- Close unnecessary tabs
- Restart browser regularly
- Update graphics drivers
- Use wired internet for video calls

**Mobile App:**
- Coming soon for iOS and Android
- Progressive Web App (PWA) available now
- Install from browser for app-like experience`,
    relatedFeatures: [],
    keywords: ['browser', 'supported', 'compatible', 'chrome', 'firefox', 'safari', 'edge', 'mobile'],
    order: 1
  },
  
  {
    role: 'all',
    category: 'Technical Support',
    question: 'I\'m experiencing technical issues. What should I do?',
    shortAnswer: 'Try clearing cache, updating browser, checking internet connection. If issues persist, contact support with error details.',
    longAnswer: `**Troubleshooting Technical Issues:**

**Quick Fixes (Try First):**

**1. Refresh the Page**
   - Press F5 or Ctrl+R (Windows)
   - Press Cmd+R (Mac)
   - Hard refresh: Ctrl+Shift+R / Cmd+Shift+R

**2. Clear Browser Cache**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Options → Privacy → Clear Data
   - Safari: Preferences → Privacy → Manage Website Data
   - Select "Cached images and files"
   - Click "Clear data"

**3. Check Internet Connection**
   - Test speed: speedtest.net
   - Minimum required: 5 Mbps
   - Recommended: 25+ Mbps for video
   - Try restarting router

**4. Update Browser**
   - Check for latest version
   - Install updates
   - Restart browser

**5. Disable Extensions**
   - Temporarily disable ad blockers
   - Disable VPN if causing issues
   - Test in incognito/private mode

**Common Issues & Solutions:**

**Can't Log In:**
- Verify username/email
- Check Caps Lock is off
- Try "Forgot Password"
- Clear cookies
- Try different browser

**Page Loading Slowly:**
- Check internet speed
- Close other tabs/apps
- Disable heavy extensions
- Clear cache
- Try different network

**Video Not Working:**
- Allow camera/microphone permissions
- Check device is not in use by other apps
- Update browser
- Try different browser
- Restart device

**File Upload Failing:**
- Check file size (max 50MB usually)
- Check file format is supported
- Verify internet connection
- Try smaller files first
- Use different browser

**Features Not Displaying:**
- Update browser
- Enable JavaScript
- Clear cache
- Disable ad blockers
- Check browser console for errors

**Getting Error Messages:**
- Note exact error text
- Take screenshot
- Note what you were doing
- Check if error persists

**Contacting Support:**

**Before Contacting:**
- Try troubleshooting steps above
- Note your browser and version
- Note your operating system
- Save error messages
- Note steps to reproduce issue

**How to Contact:**
1. **Email**: support@connectbook.com
2. **In-App**: Click "Help" → "Contact Support"
3. **Chatbot**: Ask "I need technical support"

**Include in Your Message:**
- Description of the problem
- What you've already tried
- Browser and version
- Operating system
- Screenshots of errors
- When issue started

**Response Time:**
- General issues: 24-48 hours
- Critical issues: 4-8 hours
- Security issues: Immediate

**System Status:**
Check system status page for known issues:
status.connectbook.com (example)

**Useful Information:**
- Clear cache weekly
- Update browser monthly
- Restart device weekly
- Check for platform updates`,
    relatedFeatures: [],
    keywords: ['troubleshooting', 'technical issues', 'problems', 'errors', 'not working', 'help', 'support'],
    order: 2
  },
  
  {
    role: 'all',
    category: 'General',
    question: 'Can I access ConnectBook on mobile devices?',
    shortAnswer: 'Yes, ConnectBook is fully mobile-responsive and works on smartphones and tablets through mobile browsers.',
    longAnswer: `**Mobile Access to ConnectBook:**

**Browser Access:**

**Supported Mobile Browsers:**
- ✅ Chrome (Android/iOS)
- ✅ Safari (iOS)
- ✅ Firefox Mobile
- ✅ Samsung Internet

**Features Available on Mobile:**

**Full Functionality:**
- ✓ Dashboard access
- ✓ View grades and attendance
- ✓ Browse courses
- ✓ Take quizzes and assignments
- ✓ Chat via MentorConnect
- ✓ View real-time updates
- ✓ AI chatbot
- ✓ Notifications

**Limited Functionality:**
- ⚠️ Video meetings (works but better on desktop)
- ⚠️ Large file uploads (may be slower)
- ⚠️ Complex document editing

**How to Use on Mobile:**

1. **Open Browser**
   - Use Chrome or Safari for best experience

2. **Visit ConnectBook**
   - Go to connectbook.com (example)
   - Bookmark for quick access

3. **Login**
   - Enter credentials
   - Check "Remember me" for convenience

4. **Install as PWA** (Progressive Web App)
   - Android Chrome: Menu → "Add to Home Screen"
   - iOS Safari: Share → "Add to Home Screen"
   - Creates app icon on home screen
   - Launches like native app

**Mobile Optimization:**

**Responsive Design:**
- Auto-adjusts to screen size
- Touch-friendly buttons
- Swipe gestures
- Optimized layouts

**Performance:**
- Compressed images
- Lazy loading
- Cached content
- Offline capability (coming soon)

**Tips for Mobile Use:**

**Best Practices:**
- Use landscape mode for videos
- Rotate to portrait for reading
- Enable auto-brightness
- Keep browser updated
- Close unnecessary tabs

**Data Usage:**
- Video calls: ~500MB/hour
- General browsing: ~10MB/hour
- Recommend Wi-Fi for video
- Download materials on Wi-Fi

**Notifications:**
- Enable browser notifications
- Allow background sync
- Check notification settings

**Native Mobile App:**
- Coming soon for iOS and Android
- Will include:
  - Offline access
  - Better performance
  - Native notifications
  - Background sync
  - Optimized UI

**Tablet Support:**
- Fully supported on iPad and Android tablets
- Larger screen = better experience
- Keyboard support
- Split-screen multitasking

**Minimum Requirements:**
- iOS 13+ or Android 8+
- 2GB RAM minimum
- Stable internet connection
- Modern browser

**Mobile vs Desktop:**

**Better on Mobile:**
- Quick checks
- Notifications
- Chat messages
- View updates
- On-the-go access

**Better on Desktop:**
- Video meetings
- Taking tests
- Writing assignments
- Course creation (teachers)
- Detailed analytics`,
    relatedFeatures: [],
    keywords: ['mobile', 'smartphone', 'tablet', 'android', 'ios', 'app', 'phone'],
    order: 4
  },
  
  {
    role: 'all',
    category: 'General',
    question: 'How do I enable notifications?',
    shortAnswer: 'Go to Settings → Notifications, enable the types you want, and allow browser notifications when prompted.',
    longAnswer: `**Setting Up Notifications:**

**Enable Browser Notifications:**

**Desktop:**
1. **Browser Prompt**
   - When you login, browser asks for permission
   - Click **"Allow"** when prompted

2. **If You Missed the Prompt:**
   - Chrome: Click lock icon → Site settings → Notifications → Allow
   - Firefox: Click lock icon → Permissions → Notifications → Allow
   - Safari: Safari menu → Preferences → Websites → Notifications → Allow

**Mobile:**
1. **iOS (Safari)**
   - Can't enable push notifications in browser
   - Use email notifications instead
   - Native app (coming soon) will support push

2. **Android (Chrome)**
   - Chrome asks for permission
   - Click "Allow" when prompted
   - Or: Settings → Site Settings → Notifications → Allow

**Configure Notification Types:**

1. **Go to Settings**
   - Click profile icon → Settings
   - Navigate to **"Notifications"** tab

2. **Choose Notification Types:**

**For Students:**
- ✓ New grades posted
- ✓ Assignment deadlines
- ✓ Quiz availability
- ✓ Course updates
- ✓ Messages from teachers
- ✓ Meeting reminders
- ✓ Real-time updates

**For Teachers:**
- ✓ New submissions
- ✓ Student questions
- ✓ Meeting requests
- ✓ Course enrollments
- ✓ System announcements

**For Parents:**
- ✓ Grade updates
- ✓ Attendance alerts
- ✓ Teacher messages
- ✓ Performance reports
- ✓ Important announcements

3. **Choose Delivery Method:**
   - Browser push notifications
   - Email notifications
   - Both
   - None (disable)

4. **Set Notification Frequency:**
   - Real-time (immediate)
   - Daily digest
   - Weekly summary

**Notification Settings:**

**Timing:**
- Quiet hours: Set do-not-disturb times
- Weekend notifications: On/Off
- Priority notifications: Always show

**Sound:**
- Enable/disable notification sounds
- Choose sound type
- Adjust volume

**Troubleshooting:**

**Not Receiving Notifications:**

1. **Check Browser Settings**
   - Ensure notifications are allowed
   - Check site isn't blocked

2. **Check ConnectBook Settings**
   - Verify notification types are enabled
   - Check delivery method

3. **Check Device Settings**
   - Desktop: System notification settings
   - Mobile: App notification settings

4. **Check Internet Connection**
   - Notifications require active connection

5. **Clear Browser Cache**
   - Sometimes fixes notification issues

**Email Notifications Not Working:**
- Check spam/junk folder
- Add noreply@connectbook.com to contacts
- Verify email address is correct
- Check email settings in profile

**Too Many Notifications:**
- Adjust frequency to daily/weekly
- Disable less important types
- Set quiet hours
- Use digest mode

**Best Practices:**
- Enable important notifications only
- Use email for non-urgent updates
- Set quiet hours during sleep
- Review settings regularly
- Disable when on vacation`,
    relatedFeatures: [],
    keywords: ['notifications', 'alerts', 'enable', 'push notifications', 'email alerts', 'settings'],
    order: 7
  }
];

/**
 * Seed FAQs into database
 * @param {boolean} standalone - If true, exits process after completion
 */
export async function seedFAQs(standalone = false) {
  try {
    console.log('🌱 Starting FAQ seeding...');
    
    // Only connect to MongoDB if running standalone
    if (standalone) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    }
    
    // Check if FAQs already exist
    const existingFAQCount = await FAQ.countDocuments();
    
    // Only skip if running in auto-seed mode AND FAQs exist
    // Always seed if running standalone (manual seed)
    if (existingFAQCount > 0 && !standalone) {
      console.log(`ℹ️  FAQs already seeded (${existingFAQCount} FAQs found). Skipping auto-seed.`);
      console.log(`💡 To re-seed, run: node backend/seedFAQs.js`);
      return;
    }
    
    if (existingFAQCount > 0 && standalone) {
      console.log(`⚠️  Found ${existingFAQCount} existing FAQs. They will be replaced.`);
    }
    
    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('🗑️  Cleared existing FAQs');
    
    // Insert FAQs
    const result = await FAQ.insertMany(faqData);
    console.log(`✅ Inserted ${result.length} FAQs`);
    
    // Display statistics
    const studentFAQs = result.filter(f => f.role === 'student').length;
    const teacherFAQs = result.filter(f => f.role === 'teacher').length;
    const parentFAQs = result.filter(f => f.role === 'parent').length;
    const commonFAQs = result.filter(f => f.role === 'all').length;
    
    console.log('\n📊 FAQ Statistics:');
    console.log(`   Student FAQs: ${studentFAQs}`);
    console.log(`   Teacher FAQs: ${teacherFAQs}`);
    console.log(`   Parent FAQs: ${parentFAQs}`);
    console.log(`   Common FAQs: ${commonFAQs}`);
    console.log(`   Total: ${result.length}`);
    
    console.log('\n✅ FAQ seeding completed successfully!');
    
    if (standalone) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    if (standalone) {
      process.exit(1);
    }
  }
}

// Run seeding only if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFAQs(true);
}

