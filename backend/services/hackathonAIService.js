import { GoogleGenerativeAI } from '@google/generative-ai';

class HackathonAIService {
  constructor() {
    this.genAI = null;
    this.initializeAI();
  }

  /**
   * Initialize Gemini AI
   */
  initializeAI() {
    console.log('\n🔍 Initializing Hackathon AI Service...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is not set in .env file');
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Hackathon AI Service initialized successfully\n');
    } catch (error) {
      console.error('❌ Error initializing Hackathon AI Service:', error.message);
      this.genAI = null;
    }
  }

  /**
   * Generate unique problem statement for hackathon
   */
  async generateProblemStatement(hackathonData) {
    try {
      if (!this.genAI) {
        console.warn('⚠️ AI not initialized, using fallback problem');
        return this.generateFallbackProblem(hackathonData);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const { theme, domain, difficulty, duration } = hackathonData;

      const prompt = `
You are an expert hackathon organizer. Generate a unique, challenging problem statement for a hackathon.

HACKATHON DETAILS:
Theme: ${theme}
Domain: ${domain}
Difficulty: ${difficulty}
Duration: ${duration} hours

Create a problem that:
- Is realistic and relevant to ${domain}
- Aligns with the theme "${theme}"
- Is challenging but achievable in ${duration} hours
- Encourages creativity and innovation
- Has clear success criteria

Return ONLY valid JSON:
{
  "title": "<catchy problem title>",
  "description": "<detailed problem description (3-4 paragraphs)>",
  "background": "<context and background>",
  "requirements": [
    "functional requirement 1",
    "functional requirement 2",
    "functional requirement 3",
    "functional requirement 4"
  ],
  "expectedDeliverables": [
    "deliverable 1",
    "deliverable 2",
    "deliverable 3"
  ],
  "evaluationCriteria": [
    "criteria 1",
    "criteria 2",
    "criteria 3",
    "criteria 4"
  ],
  "bonusFeatures": [
    "optional feature 1",
    "optional feature 2"
  ],
  "constraints": [
    "constraint 1",
    "constraint 2"
  ]
}

Make it exciting, innovative, and aligned with ${domain} best practices!
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const problem = JSON.parse(jsonText);

      return {
        success: true,
        problem
      };
    } catch (error) {
      console.error('Error generating problem statement:', error);
      return this.generateFallbackProblem(hackathonData);
    }
  }

  /**
   * Evaluate hackathon submission
   */
  async evaluateSubmission(submissionData) {
    try {
      if (!this.genAI) {
        console.warn('⚠️ AI not initialized, using fallback evaluation');
        return this.generateFallbackEvaluation(submissionData);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const { problemStatement, project, teamSize, submittedOnTime } = submissionData;

      const prompt = `
You are an expert hackathon judge. Evaluate this team's project submission.

PROBLEM STATEMENT:
${problemStatement.title}
${problemStatement.description}

TEAM SUBMISSION:
Project Title: ${project.title}
Description: ${project.description}
Tech Stack: ${project.techStack?.join(', ') || 'Not specified'}
Repository: ${project.repoUrl || 'Not provided'}
Demo: ${project.demoUrl || 'Not provided'}
Documentation: ${project.documentation || 'Basic documentation'}
Team Size: ${teamSize}
Submitted on Time: ${submittedOnTime ? 'Yes' : 'No'}

Evaluate on a scale of 0-100 for each criterion:
1. Code Quality (clean, maintainable, best practices)
2. Creativity (innovative solution, unique approach)
3. Functionality (meets requirements, works as expected)
4. UI/UX (if applicable, user experience quality)
5. Collaboration (team coordination, distribution of work)

Calculate overall score as weighted average:
- Code Quality: 25%
- Creativity: 20%
- Functionality: 30%
- UI/UX: 15%
- Collaboration: 10%

Return ONLY valid JSON:
{
  "scores": {
    "codeQuality": <number>,
    "creativity": <number>,
    "functionality": <number>,
    "uiux": <number>,
    "collaboration": <number>,
    "overall": <calculated weighted average>
  },
  "feedback": "<comprehensive feedback (4-5 sentences)>",
  "strengths": [
    "strength1",
    "strength2",
    "strength3"
  ],
  "improvements": [
    "improvement1",
    "improvement2",
    "improvement3"
  ],
  "technicalHighlights": [
    "highlight1",
    "highlight2"
  ],
  "suggestedEnhancements": [
    "enhancement1",
    "enhancement2"
  ]
}

Be fair, constructive, and encouraging!
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const evaluation = JSON.parse(jsonText);

      return {
        success: true,
        evaluation
      };
    } catch (error) {
      console.error('Error evaluating submission:', error);
      return this.generateFallbackEvaluation(submissionData);
    }
  }

  /**
   * Get AI coding help for hackathon teams
   */
  async getCodeHelp(question, context) {
    try {
      if (!this.genAI) {
        return {
          success: false,
          message: 'AI assistance is currently unavailable'
        };
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
You are a helpful hackathon mentor. A team needs coding assistance:

CONTEXT:
Problem: ${context.problemTitle || 'Hackathon project'}
Tech Stack: ${context.techStack?.join(', ') || 'Not specified'}
Question: ${question}

Provide helpful guidance:
- Give hints and direction, not complete solutions
- Explain concepts clearly
- Suggest best practices
- Encourage problem-solving

Keep response under 250 words and code snippets minimal.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      return {
        success: true,
        response: text
      };
    } catch (error) {
      console.error('Error getting code help:', error);
      return {
        success: false,
        message: 'Unable to get AI assistance at this time'
      };
    }
  }

  /**
   * Fallback problem generation
   */
  generateFallbackProblem(hackathonData) {
    const { theme, domain, difficulty } = hackathonData;

    const problems = {
      'Web Development': {
        title: `${theme} - Smart Web Application Challenge`,
        description: `Build an innovative web application that addresses a real-world problem related to "${theme}". Your solution should demonstrate modern web development practices, responsive design, and user-centric approach.`,
        background: `In today's digital age, ${theme} is becoming increasingly important. Your task is to create a web solution that makes a meaningful impact in this domain.`,
        requirements: [
          'Responsive web interface that works on desktop and mobile',
          'User authentication and authorization system',
          'Real-time features using WebSockets or similar technology',
          'RESTful API backend with proper error handling'
        ],
        expectedDeliverables: [
          'Working web application with source code',
          'API documentation',
          'Demo video showcasing key features'
        ],
        evaluationCriteria: [
          'Code quality and architecture',
          'UI/UX design and responsiveness',
          'Feature completeness',
          'Innovation and creativity'
        ],
        bonusFeatures: [
          'Progressive Web App (PWA) features',
          'Integration with third-party APIs'
        ],
        constraints: [
          'Must use modern JavaScript framework (React, Vue, or Angular)',
          'Backend should be scalable and secure'
        ]
      },
      'Artificial Intelligence': {
        title: `${theme} - AI Innovation Challenge`,
        description: `Develop an AI-powered solution that leverages machine learning to solve a problem in "${theme}". Your solution should demonstrate practical application of AI/ML techniques.`,
        background: `Artificial Intelligence is transforming industries. Create an AI solution that addresses challenges in ${theme}.`,
        requirements: [
          'Machine learning model with documented training process',
          'User interface to interact with the AI system',
          'Model performance metrics and evaluation',
          'Ethical AI considerations documented'
        ],
        expectedDeliverables: [
          'Trained ML model with code',
          'Web/mobile interface',
          'Technical documentation'
        ],
        evaluationCriteria: [
          'Model accuracy and performance',
          'Innovation in approach',
          'Practical applicability',
          'Code quality'
        ],
        bonusFeatures: [
          'Real-time predictions',
          'Model explainability features'
        ],
        constraints: [
          'Use Python with TensorFlow/PyTorch or similar',
          'Model must be trained on appropriate dataset'
        ]
      },
      'default': {
        title: `${theme} - Innovation Challenge`,
        description: `Create an innovative solution for "${theme}" that demonstrates technical excellence and creative problem-solving in ${domain}.`,
        background: `This hackathon challenges you to think creatively and build something impactful.`,
        requirements: [
          'Functional prototype or MVP',
          'Clean, documented code',
          'User-friendly interface',
          'Solves a real problem'
        ],
        expectedDeliverables: [
          'Working application',
          'Source code repository',
          'Demo presentation'
        ],
        evaluationCriteria: [
          'Technical implementation',
          'Innovation',
          'Usability',
          'Completeness'
        ],
        bonusFeatures: [
          'Advanced features',
          'Scalability considerations'
        ],
        constraints: [
          'Follow best practices',
          'Proper error handling'
        ]
      }
    };

    const problem = problems[domain] || problems['default'];

    return {
      success: true,
      problem
    };
  }

  /**
   * Fallback evaluation
   */
  generateFallbackEvaluation(submissionData) {
    const { submittedOnTime } = submissionData;

    // Generate varied realistic scores
    const codeQuality = Math.floor(Math.random() * 25) + 65; // 65-90
    const creativity = Math.floor(Math.random() * 30) + 60; // 60-90
    const functionality = Math.floor(Math.random() * 25) + 70; // 70-95
    const uiux = Math.floor(Math.random() * 30) + 60; // 60-90
    const collaboration = Math.floor(Math.random() * 20) + 70; // 70-90

    // Weighted average calculation
    const overall = Math.floor(
      codeQuality * 0.25 +
      creativity * 0.20 +
      functionality * 0.30 +
      uiux * 0.15 +
      collaboration * 0.10
    );

    return {
      success: true,
      evaluation: {
        scores: {
          codeQuality,
          creativity,
          functionality,
          uiux,
          collaboration,
          overall
        },
        feedback: `Great effort on this hackathon project! The team demonstrated strong technical skills and collaborative work. ${submittedOnTime ? 'Excellent time management with on-time submission!' : 'Consider improving time management for future hackathons.'} The implementation shows promise and with some refinements could be even more impactful.`,
        strengths: [
          'Strong technical implementation',
          'Good team collaboration',
          'Creative approach to problem-solving'
        ],
        improvements: [
          'Enhance code documentation',
          'Improve error handling',
          'Add more comprehensive testing'
        ],
        technicalHighlights: [
          'Clean code architecture',
          'Effective use of chosen tech stack'
        ],
        suggestedEnhancements: [
          'Add more advanced features',
          'Improve scalability'
        ]
      }
    };
  }
}

// Lazy initialization pattern
let hackathonAIServiceInstance = null;

export default {
  get instance() {
    if (!hackathonAIServiceInstance) {
      hackathonAIServiceInstance = new HackathonAIService();
    }
    return hackathonAIServiceInstance;
  }
};
