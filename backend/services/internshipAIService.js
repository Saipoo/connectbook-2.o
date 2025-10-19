import { GoogleGenerativeAI } from '@google/generative-ai';

class InternshipAIService {
  constructor() {
    this.genAI = null;
    this.initializeAI();
  }

  /**
   * Initialize Gemini AI
   */
  initializeAI() {
    console.log('\n🔍 Initializing Internship AI Service...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is not set in .env file');
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Internship AI Service initialized successfully\n');
    } catch (error) {
      console.error('❌ Error initializing Internship AI Service:', error.message);
      this.genAI = null;
    }
  }

  /**
   * Generate internship tasks for a given company, role, and domain
   */
  async generateTasks(company, role, domain, tasksCount = 5) {
    try {
      if (!this.genAI) {
        console.warn('⚠️ AI not initialized, using fallback tasks');
        return this.generateFallbackTasks(company, role, domain, tasksCount);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
You are an expert internship coordinator. Generate ${tasksCount} realistic internship tasks for a ${role} intern in ${domain} at ${company}.

Each task should progressively increase in complexity and simulate real-world work.

Task Types to include:
1. Research/Analysis task
2. Design/Planning task
3. Implementation/Coding task
4. Debugging/Optimization task
5. Presentation/Documentation task

For EACH task, provide:
- Title (concise, professional)
- Description (detailed, clear expectations)
- Type (research/design/implementation/debugging/presentation)
- Requirements (3-5 specific deliverables)
- Estimated hours to complete

Return ONLY valid JSON with this structure:
{
  "tasks": [
    {
      "title": "Task Title",
      "description": "Detailed description of what needs to be done",
      "taskType": "research|design|implementation|debugging|presentation",
      "requirements": ["requirement1", "requirement2", "requirement3"],
      "estimatedHours": <number>
    }
  ]
}

Make tasks realistic, relevant to ${role} at ${company}, and appropriate for ${domain} interns.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const data = JSON.parse(jsonText);

      return {
        success: true,
        tasks: data.tasks
      };
    } catch (error) {
      console.error('Error generating tasks:', error);
      return this.generateFallbackTasks(company, role, domain, tasksCount);
    }
  }

  /**
   * Evaluate internship task submission
   */
  async evaluateTask(taskData) {
    try {
      if (!this.genAI) {
        console.warn('⚠️ AI not initialized, using fallback evaluation');
        return this.generateFallbackEvaluation(taskData);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const { task, submission, deadline } = taskData;
      const submittedOnTime = new Date(submission.submittedAt) <= new Date(deadline);

      const prompt = `
You are an expert internship evaluator. Evaluate this intern's task submission.

TASK DETAILS:
Title: ${task.title}
Type: ${task.taskType}
Requirements: ${task.requirements.join(', ')}

SUBMISSION:
Description: ${submission.description || 'No description provided'}
Code URL: ${submission.codeUrl || 'Not provided'}
Notes: ${submission.notes || 'No notes'}
Submitted on time: ${submittedOnTime ? 'Yes' : 'No'}

Evaluate on:
1. Accuracy & Correctness (0-100)
2. Creativity & Innovation (0-100)
3. Communication & Documentation (0-100)
4. Timeliness (0-100)

Return ONLY valid JSON:
{
  "scores": {
    "accuracy": <number>,
    "creativity": <number>,
    "communication": <number>,
    "deadline": <number>,
    "overall": <number (average)>
  },
  "feedback": "<overall performance feedback (3-4 sentences)>",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "suggestions": ["suggestion1", "suggestion2"],
  "suggestedCourses": [
    {"title": "course title", "reason": "why it helps"}
  ]
}
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
      console.error('Error evaluating task:', error);
      return this.generateFallbackEvaluation(taskData);
    }
  }

  /**
   * Get AI help for a task question
   */
  async getAIHelp(question, taskContext) {
    try {
      if (!this.genAI) {
        return {
          success: false,
          message: 'AI assistance is currently unavailable'
        };
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
You are a helpful internship mentor. A student working on this task needs help:

TASK: ${taskContext.title}
TYPE: ${taskContext.taskType}
DESCRIPTION: ${taskContext.description}

STUDENT'S QUESTION: ${question}

Provide helpful guidance without giving away the complete solution. Encourage learning and problem-solving.

Response should be:
- Encouraging and supportive
- Educational (explain concepts)
- Provide hints, not complete answers
- Suggest resources or approaches

Keep response under 200 words.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      return {
        success: true,
        response: text
      };
    } catch (error) {
      console.error('Error getting AI help:', error);
      return {
        success: false,
        message: 'Unable to get AI assistance at this time'
      };
    }
  }

  /**
   * Fallback task generation (when AI is unavailable)
   */
  generateFallbackTasks(company, role, domain, count) {
    const taskTemplates = {
      research: {
        title: `Research ${domain} Industry Trends`,
        description: `Conduct comprehensive research on current trends and best practices in ${domain}. Analyze how ${company} positions itself in the market and identify opportunities for innovation.`,
        taskType: 'research',
        requirements: [
          'Industry analysis report (2-3 pages)',
          'Competitor analysis',
          'Trend forecast and recommendations',
          'References and citations'
        ],
        estimatedHours: 8
      },
      design: {
        title: `Design ${domain} Solution Architecture`,
        description: `Create a detailed design document for a ${domain} project. Include system architecture, data flow diagrams, and technical specifications relevant to ${role} responsibilities.`,
        taskType: 'design',
        requirements: [
          'System architecture diagram',
          'Component specifications',
          'Technology stack justification',
          'Scalability considerations'
        ],
        estimatedHours: 12
      },
      implementation: {
        title: `Implement ${domain} Feature`,
        description: `Develop a functional feature or module related to ${domain}. Follow ${company}'s coding standards and best practices. Document your code and implementation decisions.`,
        taskType: 'implementation',
        requirements: [
          'Working code implementation',
          'Unit tests',
          'Code documentation',
          'Git repository link'
        ],
        estimatedHours: 16
      },
      debugging: {
        title: `Debug and Optimize ${domain} Application`,
        description: `Identify and fix bugs in a sample application. Optimize performance and improve code quality. Document the issues found and solutions implemented.`,
        taskType: 'debugging',
        requirements: [
          'Bug report and analysis',
          'Fixed code with explanations',
          'Performance improvement metrics',
          'Testing documentation'
        ],
        estimatedHours: 10
      },
      presentation: {
        title: `Final Internship Project Presentation`,
        description: `Prepare a comprehensive presentation showcasing your work during the internship at ${company}. Highlight key learnings, challenges overcome, and contributions made.`,
        taskType: 'presentation',
        requirements: [
          'Presentation slides (10-15 slides)',
          'Project demo video',
          'Technical report',
          'Reflection and learning summary'
        ],
        estimatedHours: 8
      }
    };

    const taskTypes = ['research', 'design', 'implementation', 'debugging', 'presentation'];
    const tasks = [];

    for (let i = 0; i < count; i++) {
      const type = taskTypes[i % taskTypes.length];
      tasks.push({ ...taskTemplates[type] });
    }

    return {
      success: true,
      tasks
    };
  }

  /**
   * Fallback evaluation (when AI is unavailable)
   */
  generateFallbackEvaluation(taskData) {
    const { submission, deadline } = taskData;
    const submittedOnTime = new Date(submission.submittedAt) <= new Date(deadline);

    // Generate varied scores
    const accuracy = Math.floor(Math.random() * 20) + 70; // 70-90
    const creativity = Math.floor(Math.random() * 25) + 65; // 65-90
    const communication = Math.floor(Math.random() * 20) + 70; // 70-90
    const deadlineScore = submittedOnTime ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 30) + 50;
    const overall = Math.floor((accuracy + creativity + communication + deadlineScore) / 4);

    return {
      success: true,
      evaluation: {
        scores: {
          accuracy,
          creativity,
          communication,
          deadline: deadlineScore,
          overall
        },
        feedback: `Good work on this task! Your submission demonstrates understanding of the requirements. ${submittedOnTime ? 'Great job submitting on time!' : 'Consider improving time management.'}`,
        strengths: [
          'Demonstrated good understanding of requirements',
          'Clear documentation and communication',
          'Attempted all deliverables'
        ],
        improvements: [
          'Consider exploring more advanced techniques',
          'Enhance code/design quality',
          'Provide more detailed explanations'
        ],
        suggestions: [
          'Review best practices in this domain',
          'Practice similar tasks to improve skills'
        ],
        suggestedCourses: [
          { title: 'Advanced Project Development', reason: 'Enhance technical skills' },
          { title: 'Professional Communication', reason: 'Improve documentation quality' }
        ]
      }
    };
  }
}

// Lazy initialization pattern
let internshipAIServiceInstance = null;

export default {
  get instance() {
    if (!internshipAIServiceInstance) {
      internshipAIServiceInstance = new InternshipAIService();
    }
    return internshipAIServiceInstance;
  }
};
