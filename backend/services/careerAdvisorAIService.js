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

class CareerAdvisorAIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Analyze student profile and recommend career paths
   */
  async analyzeCareerPaths(studentData) {
    try {
      const {
        academicPerformance,
        completedCourses = [],
        internshipExperience = [],
        interviewPerformance = {},
        interests = [],
        currentSkills = []
      } = studentData || {};

      const prompt = `
You are an AI career counselor. Analyze this student's profile and recommend top 5 suitable career paths.

Student Profile:
Academic Performance:
- Overall GPA: ${academicPerformance?.overallGPA || 'N/A'}
- Strong Subjects: ${academicPerformance?.strongSubjects?.join(', ') || 'N/A'}
- Weak Subjects: ${academicPerformance?.weakSubjects?.join(', ') || 'N/A'}

Completed Courses:
${(completedCourses || []).map(c => `- ${c.title} (${c.domain})`).join('\n') || 'None'}

Internship Experience:
${(internshipExperience || []).map(i => `- ${i.title} - ${i.domain} (Rating: ${i.rating}/5)`).join('\n') || 'None'}

Interview Performance:
- Average Score: ${interviewPerformance?.averageScore || 'N/A'}%
- Strong Areas: ${interviewPerformance?.strongAreas?.join(', ') || 'N/A'}
- Improvement Areas: ${interviewPerformance?.improvementAreas?.join(', ') || 'N/A'}

Interests:
${(interests || []).map(i => `- ${i.area} (${i.level} interest)`).join('\n') || 'Not specified'}

Current Skills:
${(currentSkills || []).map(s => `- ${s.name} (${s.level})`).join('\n') || 'None listed'}

Recommend 5 career paths with match score (0-100) based on their profile. Include:
1. Career title
2. Description
3. Required skills
4. Average salary range (in INR per annum)
5. Top hiring companies in India
6. Match reasoning

Return JSON:
[
  {
    "path": {
      "title": "Software Development Engineer",
      "description": "Design, develop, and maintain software applications...",
      "category": "software",
      "requiredSkills": ["Java", "Data Structures", "Algorithms", "System Design"],
      "optionalSkills": ["Cloud", "DevOps", "Microservices"],
      "averageSalary": {
        "min": 600000,
        "max": 1500000,
        "currency": "INR"
      },
      "topCompanies": ["Google", "Microsoft", "Amazon", "Flipkart", "PayTM"],
      "growthRate": "15% annually",
      "workEnvironment": "Office/Remote/Hybrid",
      "educationRequired": "B.Tech/B.E. in Computer Science or related field",
      "certifications": ["AWS Certified Developer", "Oracle Java Certification"]
    },
    "matchScore": 85,
    "reasoning": "Strong performance in programming courses, completed Java internship, good problem-solving skills evident from interview performance"
  }
]

IMPORTANT: Return ONLY the JSON array, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse career paths from AI response');
      }
      
      const recommendations = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      // Add generation timestamp
      const enrichedRecommendations = recommendations.map(rec => ({
        ...rec,
        generatedAt: new Date()
      }));
      
      return {
        success: true,
        recommendations: enrichedRecommendations,
        analyzedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error analyzing career paths:', error);
      return {
        success: false,
        message: 'Failed to analyze career paths',
        error: error.message
      };
    }
  }

  /**
   * Analyze skill gaps for chosen career path
   */
  async analyzeSkillGaps(currentProfile, targetCareerPath) {
    try {
      const { currentSkills = [], completedCourses = [] } = currentProfile || {};
      const { requiredSkills = [], optionalSkills = [], title = 'Target Career' } = targetCareerPath || {};

      const prompt = `
You are a career development advisor. Analyze skill gaps for a student targeting "${title}".

Current Skills:
${(currentSkills || []).map(s => `- ${s.name} (${s.level})`).join('\n') || 'None'}

Completed Courses:
${(completedCourses || []).map(c => `- ${c.title}`).join('\n') || 'None'}

Target Career Required Skills:
${(requiredSkills || []).join(', ') || 'N/A'}

Target Career Optional Skills:
${(optionalSkills || []).join(', ') || 'N/A'}

Identify:
1. Skills the student MUST learn (required but missing)
2. Skills they should improve (have but low level)
3. Optional skills that would give an advantage
4. Suggest learning resources for each skill gap

Return JSON:
[
  {
    "skill": "Skill Name",
    "category": "technical",
    "importance": "required",
    "currentLevel": "none",
    "targetLevel": "intermediate",
    "resources": [
      {
        "type": "course",
        "title": "Resource Title",
        "platform": "Platform Name",
        "url": "https://example.com"
      }
    ],
    "estimatedTimeToLearn": "2-3 months",
    "priority": 1
  }
]

Categories: "technical", "soft-skill", "tool", "language", "framework", "domain-knowledge"
Importance: "required", "recommended", "optional"
Current Level: "none", "beginner", "intermediate", "advanced"
Target Level: "beginner", "intermediate", "advanced", "expert"
Resource Types: "course", "book", "project", "certification", "practice"

Order by priority (1 = highest).
IMPORTANT: Return ONLY the JSON array, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse skill gaps from AI response');
      }
      
      const skillGaps = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        skillGaps,
        analyzedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      return {
        success: false,
        message: 'Failed to analyze skill gaps',
        error: error.message
      };
    }
  }

  /**
   * Generate AI-powered resume
   */
  async generateResume(studentProfile) {
    try {
      const {
        personalInfo,
        academicPerformance,
        completedCourses,
        internshipExperience,
        projects,
        currentSkills = [],
        certifications = [],
        targetCareerPath = 'Software Developer'
      } = studentProfile || {};

      const prompt = `
You are a professional resume writer. Create an ATS-friendly resume for this student targeting "${targetCareerPath}".

Personal Information:
- Name: ${personalInfo?.name || 'Student Name'}
- Email: ${personalInfo?.email || 'student@example.com'}
- Phone: ${personalInfo?.phone || 'N/A'}

Education:
- Degree: ${personalInfo?.degree || 'Bachelor of Engineering'}
- College: ${personalInfo?.college || 'Engineering College'}
- GPA: ${academicPerformance?.overallGPA || 'N/A'}
- Strong Subjects: ${academicPerformance?.strongSubjects?.join(', ') || 'N/A'}

Courses Completed:
${(completedCourses || []).map(c => `- ${c.title} (${c.domain}) - Grade: ${c.grade}`).join('\n') || 'None'}

Internship Experience:
${(internshipExperience || []).map(i => `- ${i.title} at ${i.company || 'N/A'} - ${i.duration || 'N/A'}`).join('\n') || 'None'}

Projects:
${(projects || []).map(p => `- ${p.title}: ${p.description} (Tech: ${p.technologies?.join(', ')})`).join('\n') || 'None'}

Skills:
${(currentSkills || []).map(s => s.name).join(', ') || 'N/A'}

Certifications:
${(certifications || []).map(c => `- ${c.name} by ${c.issuer}`).join('\n') || 'None'}

Generate:
1. Professional summary (2-3 sentences highlighting strengths and career goal)
2. Structured experience descriptions
3. Project descriptions with impact
4. Skills categorization

Return JSON:
{
  "summary": "Results-driven Computer Science student with strong foundation in...",
  "sections": {
    "education": [
      {
        "degree": "B.Tech in Computer Science",
        "institution": "College Name",
        "year": "2021-2025",
        "grade": "8.5 GPA"
      }
    ],
    "experience": [
      {
        "title": "Software Development Intern",
        "company": "Company Name",
        "duration": "Jun 2024 - Aug 2024",
        "description": "• Developed RESTful APIs using Node.js\n• Improved performance by 30%\n• Collaborated with team of 5 developers",
        "source": "internship-simulator"
      }
    ],
    "projects": [
      {
        "title": "Project Name",
        "description": "• Built full-stack web app using MERN\n• Implemented JWT authentication\n• Deployed on AWS",
        "technologies": ["React", "Node.js", "MongoDB"],
        "url": "https://github.com/...",
        "source": "personal"
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Developer",
        "issuer": "Amazon Web Services",
        "date": "2024-05-15",
        "url": "https://...",
        "source": "external"
      }
    ],
    "skills": ["JavaScript", "Python", "React", "Node.js", "MongoDB", "AWS"]
  },
  "tips": ["Tip 1 for improving resume", "Tip 2", "Tip 3"]
}

IMPORTANT: Return ONLY the JSON object, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse resume from AI response');
      }
      
      const resume = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        resume: {
          ...resume,
          aiGenerated: true,
          lastGenerated: new Date()
        },
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error generating resume:', error);
      return {
        success: false,
        message: 'Failed to generate resume',
        error: error.message
      };
    }
  }

  /**
   * Calculate career readiness score with detailed breakdown
   */
  async calculateReadinessScore(studentProfile, targetCareerPath) {
    try {
      const {
        currentSkills = [],
        completedCourses = [],
        internshipExperience = [],
        interviewPerformance = {},
        projects = []
      } = studentProfile || {};

      const { requiredSkills = [], optionalSkills = [], title = 'Target Career' } = targetCareerPath || {};

      const prompt = `
You are a career readiness assessor. Evaluate this student's readiness for "${title}".

Current Profile:
- Skills: ${(currentSkills || []).map(s => `${s.name} (${s.level})`).join(', ') || 'None'}
- Completed Courses: ${(completedCourses || []).length || 0}
- Internship Experience: ${(internshipExperience || []).length || 0}
- Projects: ${(projects || []).length || 0}
- Interview Average Score: ${interviewPerformance?.averageScore || 0}%

Required Skills for Career:
${(requiredSkills || []).join(', ') || 'N/A'}

Optional Skills:
${(optionalSkills || []).join(', ') || 'N/A'}

Evaluate readiness in these categories (0-100):
1. Technical Skills (40% weight) - How many required skills they have and at what level
2. Soft Skills (20% weight) - Based on interview performance
3. Experience (40% weight) - Internships, projects, courses

Return JSON:
{
  "overall": 72,
  "technical": 65,
  "softSkills": 80,
  "experience": 75,
  "breakdown": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Area to improve 1", "Area to improve 2"],
    "nextSteps": ["Action 1", "Action 2", "Action 3"]
  },
  "timeline": "Expected job-ready in 4-6 months with focused skill development",
  "confidence": "high"
}

Confidence levels: "low" (<50), "medium" (50-70), "high" (70-85), "very-high" (85+)
IMPORTANT: Return ONLY the JSON object, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse readiness score from AI response');
      }
      
      const readinessScore = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        readinessScore: {
          ...readinessScore,
          lastUpdated: new Date()
        },
        analyzedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error calculating readiness score:', error);
      return {
        success: false,
        message: 'Failed to calculate readiness score',
        error: error.message
      };
    }
  }

  /**
   * Analyze career quiz results and provide insights
   */
  async analyzeQuizResults(quizAnswers, quizType) {
    try {
      const prompt = `
You are a career psychologist. Analyze these ${quizType} quiz results and provide insights.

Quiz Answers:
${quizAnswers.map((a, i) => `Q${i+1}. ${a.question}\nAnswer: ${a.answer}`).join('\n\n')}

Based on the answers, determine:
1. Primary personality/skill type
2. Secondary type
3. Key strengths
4. Areas for development
5. Career recommendations based on this profile

Return JSON:
{
  "primaryType": "Analytical Thinker",
  "secondaryType": "Problem Solver",
  "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "weaknesses": ["Area 1", "Area 2"],
  "recommendations": [
    "Career path 1 - Reasoning why suitable",
    "Career path 2 - Reasoning why suitable",
    "Career path 3 - Reasoning why suitable"
  ],
  "developmentTips": ["Tip 1", "Tip 2", "Tip 3"],
  "score": 78,
  "interpretation": "Detailed interpretation of the results"
}

IMPORTANT: Return ONLY the JSON object, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse quiz analysis from AI response');
      }
      
      const analysis = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        results: analysis,
        analyzedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error analyzing quiz results:', error);
      return {
        success: false,
        message: 'Failed to analyze quiz results',
        error: error.message
      };
    }
  }

  /**
   * Generate personalized career development roadmap
   */
  async generateCareerRoadmap(studentProfile, targetCareerPath, timeframe = 6) {
    try {
      const { currentSkills = [], skillGaps = [] } = studentProfile || {};
      const { title = 'Target Career' } = targetCareerPath || {};

      const prompt = `
You are a career development coach. Create a ${timeframe}-month roadmap for achieving career goal: "${title}".

Current Skills:
${(currentSkills || []).map(s => `- ${s.name} (${s.level})`).join('\n') || 'None'}

Skills to Develop:
${(skillGaps || []).map(sg => `- ${sg.skill} (Priority: ${sg.importance})`).join('\n') || 'None'}

Create a month-by-month roadmap with:
1. Specific skills to learn each month
2. Milestones to achieve
3. Resources to use
4. Expected outcomes

Return JSON:
{
  "totalDuration": "${timeframe} months",
  "phases": [
    {
      "month": 1,
      "title": "Foundation Building",
      "goals": ["Goal 1", "Goal 2"],
      "skills": ["Skill 1", "Skill 2"],
      "activities": [
        {
          "activity": "Complete X course",
          "hours": 20,
          "outcome": "Expected outcome"
        }
      ],
      "milestone": "Milestone to achieve this month"
    }
  ],
  "finalOutcome": "Job-ready for ${targetCareerPath.title} position",
  "estimatedEffort": "15-20 hours per week"
}

IMPORTANT: Return ONLY the JSON object, no explanations.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse career roadmap from AI response');
      }
      
      const roadmap = JSON.parse(cleanJsonString(jsonMatch[0]));
      
      return {
        success: true,
        roadmap,
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('Error generating career roadmap:', error);
      return {
        success: false,
        message: 'Failed to generate roadmap',
        error: error.message
      };
    }
  }
}

const careerAdvisorAIService = new CareerAdvisorAIService();

// Export both default and named exports for convenience
export default careerAdvisorAIService;

export const analyzeCareerPaths = (studentData) => careerAdvisorAIService.analyzeCareerPaths(studentData);
export const analyzeSkillGaps = (currentProfile, targetCareerPath) => careerAdvisorAIService.analyzeSkillGaps(currentProfile, targetCareerPath);
export const generateResume = (studentProfile) => careerAdvisorAIService.generateResume(studentProfile);
export const calculateReadinessScore = (studentProfile, targetCareerPath) => careerAdvisorAIService.calculateReadinessScore(studentProfile, targetCareerPath);
export const analyzeQuizResults = (quizAnswers, quizType) => careerAdvisorAIService.analyzeQuizResults(quizAnswers, quizType);
export const generateCareerRoadmap = (studentProfile, targetCareerPath, timeframe) => careerAdvisorAIService.generateCareerRoadmap(studentProfile, targetCareerPath, timeframe);
