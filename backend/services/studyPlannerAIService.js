import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to clean JSON strings
function cleanJsonString(jsonStr) {
  return jsonStr
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\\n/g, ' ') // Replace escaped newlines with spaces
    .replace(/\\r/g, '') // Remove escaped carriage returns
    .replace(/\\t/g, ' '); // Replace escaped tabs with spaces
}

class StudyPlannerAIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Generate optimized weekly schedule based on student data
   */
  async generateWeeklySchedule(studentData) {
    try {
      const { 
        subjects = [], 
        weakSubjects = [], 
        attendanceData = [], 
        upcomingExams = [], 
        assignments = [],
        preferences = {},
        recentGrades = []
      } = studentData || {};

      const prompt = `
You are an AI study planner assistant. Generate an optimized weekly study schedule for a college student based on their detailed preferences.

Student Profile:
- Name: ${studentData?.name || 'Student'}
- Semester: ${studentData?.semester || 'N/A'}
- Subjects: ${(subjects || []).join(', ') || 'General subjects'}
- Weak Subjects (need extra focus): ${(weakSubjects || []).map(ws => `${ws.subject} (Current: ${ws.currentGrade}%)`).join(', ') || 'None identified'}

Study Preferences:
- Daily Study Hours: ${preferences?.studyHoursPerDay || 4} hours
- Preferred Study Time: ${preferences?.preferredStudyTime || 'flexible'}
- Break Duration: ${preferences?.breakDuration || 15} minutes
- Additional Preferences: ${preferences?.studyPreferences || 'None specified'}

Upcoming Commitments:
- Exams: ${(upcomingExams || []).join(', ') || 'None scheduled'}
- Pending Assignments: ${(assignments || []).map(a => `${a.title} (${a.subject}) - Due: ${new Date(a.dueDate).toLocaleDateString()}`).join(', ') || 'None'}

Recent Academic Performance:
${(recentGrades || []).map(g => `- ${g.subject}: ${g.percentage}%`).join('\n') || 'No recent grades available'}

Generate a DETAILED weekly study schedule following these requirements:
1. Allocate MORE study time to weak subjects (subjects below 60%)
2. Schedule difficult subjects during the student's preferred study time
3. Include ${preferences?.breakDuration || 15}-minute breaks after every study session
4. Prioritize subjects with upcoming exams
5. Include a mix of: new topic learning, practice problems, and revision
6. Make weekends lighter with review and consolidation sessions
7. Ensure ${preferences?.studyHoursPerDay || 4} hours of study per day
8. Create specific, actionable tasks for each time slot

Return a JSON array with this structure:
[
  {
    "day": "Monday",
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "11:00",
        "subject": "Subject Name",
        "activity": "Detailed activity description",
        "type": "study"
      },
      {
        "startTime": "11:00",
        "endTime": "11:15",
        "subject": "Break",
        "activity": "Short break",
        "type": "break"
      }
    ]
  }
]

Generate for all 7 days (Monday to Sunday).
IMPORTANT: Return ONLY the JSON array, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse schedule from AI response');
      }
      
      const schedule = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      // Add aiGenerated flag to all slots
      schedule.forEach(day => {
        day.slots = day.slots.map(slot => ({
          ...slot,
          aiGenerated: true
        }));
      });
      
      return {
        success: true,
        schedule,
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error generating weekly schedule:', error);
      return {
        success: false,
        message: 'Failed to generate schedule',
        error: error.message
      };
    }
  }

  /**
   * Analyze weak subjects and generate recommendations
   */
  async analyzeWeakSubjects(academicData) {
    try {
      const { grades = {}, attendance = {}, recentTests = [] } = academicData || {};

      const gradesEntries = Object.entries(grades || {});
      const gradesText = gradesEntries.length > 0 
        ? gradesEntries.map(([subject, grade]) => 
            `- ${subject}: ${grade}% (Attendance: ${attendance[subject] || 'N/A'}%)`
          ).join('\n')
        : 'No grade data available';

      const testsText = (recentTests || []).length > 0
        ? recentTests.map(t => `- ${t.subject}: ${t.score}/${t.maxScore} (${((t.score/t.maxScore)*100).toFixed(1)}%)`).join('\n')
        : 'No recent test data';

      const prompt = `
You are an AI academic advisor. Analyze the student's performance and identify weak subjects.

Performance Data:
${gradesText}

Recent Test Scores:
${testsText}

Analyze and identify:
1. Which subjects are weak (below 60% or declining trend)
2. Recommended study hours per week for each weak subject
3. Specific topics to focus on
4. Study techniques that would help

Return JSON:
[
  {
    "subject": "Subject Name",
    "currentGrade": 55,
    "targetGrade": 75,
    "recommendedHoursPerWeek": 8,
    "topics": ["Topic 1", "Topic 2", "Topic 3"],
    "studyTechniques": ["Technique 1", "Technique 2"]
  }
]

IMPORTANT: Return ONLY the JSON array, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse weak subjects from AI response');
      }
      
      const weakSubjects = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        weakSubjects,
        analyzedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error analyzing weak subjects:', error);
      return {
        success: false,
        message: 'Failed to analyze subjects',
        error: error.message
      };
    }
  }

  /**
   * Generate personalized study recommendations
   */
  async generateRecommendations(studentProfile) {
    try {
      const { 
        currentPerformance = { average: 0 }, 
        studyHabits = { hoursThisWeek: 0 }, 
        upcomingDeadlines = [],
        weakSubjects = [],
        currentStreak = 0
      } = studentProfile || {};

      const prompt = `
You are an AI study coach. Provide personalized study recommendations for this student.

Student Profile:
- Overall Performance: ${currentPerformance?.average || 0}%
- Current Study Streak: ${currentStreak} days
- Study Hours This Week: ${studyHabits?.hoursThisWeek || 0}
- Weak Subjects: ${(weakSubjects || []).join(', ') || 'None'}
- Upcoming Deadlines: ${(upcomingDeadlines || []).map(d => `${d.title} - ${d.daysLeft} days left`).join(', ') || 'None'}

Generate 5-7 actionable recommendations in this format:
[
  {
    "type": "focus-subject",
    "priority": "high",
    "message": "Spend 2 extra hours this week on Operating Systems - your recent test score dropped by 15%",
    "subject": "Operating Systems",
    "actionable": true
  },
  {
    "type": "study-technique",
    "priority": "medium",
    "message": "Try the Feynman Technique for DBMS concepts - explain topics in simple terms to understand better",
    "subject": "DBMS",
    "actionable": true
  }
]

Types: "focus-subject", "revision-topic", "study-technique", "time-management", "resource"
Priority: "low", "medium", "high"

IMPORTANT: Return ONLY the JSON array, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse recommendations from AI response');
      }
      
      const recommendations = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      // Add expiry date (7 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      const enrichedRecommendations = recommendations.map(rec => ({
        ...rec,
        generatedAt: new Date(),
        expiresAt: expiryDate,
        completed: false
      }));
      
      return {
        success: true,
        recommendations: enrichedRecommendations,
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        success: false,
        message: 'Failed to generate recommendations',
        error: error.message
      };
    }
  }

  /**
   * Suggest focus sessions and break timing (Pomodoro optimization)
   */
  async optimizePomodoroSession(context) {
    try {
      const { 
        subject = 'General Study', 
        difficulty = 'medium', 
        timeAvailable = 120, 
        currentEnergy = 'medium' 
      } = context || {};

      const prompt = `
You are a productivity coach. Suggest the optimal Pomodoro session configuration for this study session.

Context:
- Subject: ${subject}
- Difficulty Level: ${difficulty} (easy/medium/hard)
- Time Available: ${timeAvailable} minutes
- Student's Current Energy Level: ${currentEnergy} (low/medium/high)

Suggest:
1. Pomodoro duration (15-45 minutes)
2. Break duration (5-15 minutes)
3. Number of sessions
4. Specific focus areas for each session
5. Break activity suggestions

Return JSON:
{
  "pomodoroDuration": 25,
  "breakDuration": 5,
  "numberOfSessions": 4,
  "sessions": [
    {
      "sessionNumber": 1,
      "focusArea": "Specific topic or task",
      "tips": "Study tips for this session"
    }
  ],
  "breakActivities": ["Activity 1", "Activity 2"],
  "reasoning": "Why this configuration is optimal"
}

IMPORTANT: Return ONLY the JSON object, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse Pomodoro config from AI response');
      }
      
      const config = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        config,
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error optimizing Pomodoro session:', error);
      return {
        success: false,
        message: 'Failed to optimize session',
        error: error.message
      };
    }
  }

  /**
   * Generate study tips for a specific subject
   */
  async generateSubjectStudyTips(subject, topics = []) {
    try {
      const prompt = `
You are an expert teacher. Provide specific study tips and resources for ${subject || 'the subject'}.

Topics to cover: ${(topics || []).join(', ') || 'General topics'}

Provide:
1. Study approach for each topic
2. Common mistakes to avoid
3. Practice resources
4. Quick revision tips
5. Exam preparation strategies

Return JSON:
{
  "subject": "${subject}",
  "tips": [
    {
      "topic": "Topic name",
      "approach": "How to study this topic",
      "commonMistakes": ["Mistake 1", "Mistake 2"],
      "resources": ["Resource 1", "Resource 2"],
      "revisionTips": "Quick tips for revision"
    }
  ],
  "examStrategy": "Overall exam preparation strategy for this subject"
}

IMPORTANT: Return ONLY the JSON object, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse study tips from AI response');
      }
      
      const tips = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        tips,
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error generating study tips:', error);
      return {
        success: false,
        message: 'Failed to generate study tips',
        error: error.message
      };
    }
  }
}

const studyPlannerAIService = new StudyPlannerAIService();

// Export both default and named exports for convenience
export default studyPlannerAIService;

export const generateWeeklySchedule = (studentData) => studyPlannerAIService.generateWeeklySchedule(studentData);
export const analyzeWeakSubjects = (academicData) => studyPlannerAIService.analyzeWeakSubjects(academicData);
export const generateRecommendations = (studentProfile) => studyPlannerAIService.generateRecommendations(studentProfile);
export const optimizePomodoroSession = (context) => studyPlannerAIService.optimizePomodoroSession(context);
export const generateSubjectStudyTips = (subject, topics) => studyPlannerAIService.generateSubjectStudyTips(subject, topics);
