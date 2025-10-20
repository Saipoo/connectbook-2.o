import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI-curated real-time updates for different categories
 */
class UpdateGeneratorService {
  
  /**
   * Generate education-related updates
   */
  static async generateEducationUpdates() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate 3-5 recent and trending educational updates for college students in India. Include:

Categories to cover:
- Government education policies (NEP, UGC notices)
- New courses, certifications, or learning platforms
- Educational reforms or initiatives
- Scholarship announcements
- Study abroad opportunities

For each update, provide in JSON format:
{
  "title": "Catchy headline (50-80 characters)",
  "summary": "Brief 2-3 sentence summary",
  "detailedContent": "Detailed 4-5 sentence description",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "whyItMatters": "Why this is important for students",
  "tags": ["relevant", "tags"],
  "priority": number (1-10, higher = more important),
  "targetCourses": ["relevant courses if any"],
  "sourceLink": "credible source URL if available (or empty string)"
}

Return only valid JSON array. Focus on REAL, RECENT updates from the last 7 days.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return this.parseAIResponse(responseText, 'education');
    } catch (error) {
      console.error('Error generating education updates:', error);
      return [];
    }
  }

  /**
   * Generate AI & Tech updates
   */
  static async generateAITechUpdates() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate 3-5 recent and trending AI & Technology updates relevant for students. Include:

Categories to cover:
- New AI models or tools (ChatGPT, Gemini, Claude updates)
- Tech product launches (Apple, Google, Microsoft)
- Programming languages, frameworks updates
- Open-source projects gaining popularity
- Emerging tech trends (AR/VR, Blockchain, Quantum Computing)
- Developer tools and platforms

For each update, provide in JSON format:
{
  "title": "Catchy headline (50-80 characters)",
  "summary": "Brief 2-3 sentence summary",
  "detailedContent": "Detailed 4-5 sentence description with technical insights",
  "keyPoints": ["Key technical detail 1", "Key detail 2", "Key detail 3"],
  "whyItMatters": "Why students should care about this",
  "tags": ["AI", "Tech", "specific technology"],
  "priority": number (1-10),
  "targetCourses": ["Computer Science", "AI/ML", "Data Science"],
  "relatedResources": [{"title": "resource name", "url": "URL", "type": "article|video|tool"}],
  "sourceLink": "credible tech news URL"
}

Return only valid JSON array. Focus on REAL updates from last 3-5 days.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return this.parseAIResponse(responseText, 'ai-tech');
    } catch (error) {
      console.error('Error generating AI/Tech updates:', error);
      return [];
    }
  }

  /**
   * Generate Jobs & Internships updates
   */
  static async generateJobsInternshipsUpdates() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate 3-5 recent job and internship opportunities for college students. Include:

Categories to cover:
- Top company hiring drives (Google, Microsoft, Amazon, Indian startups)
- Government job notifications (UPSC, SSC, Bank exams)
- Internship programs (Google Summer of Code, Microsoft Learn, etc.)
- Freelancing opportunities
- Remote work positions for students

For each update, provide in JSON format:
{
  "title": "Job/Internship title with company name",
  "summary": "Brief description with eligibility and key details",
  "detailedContent": "Full description with requirements, benefits, deadlines",
  "keyPoints": ["Eligibility criteria", "Skills required", "Application deadline"],
  "whyItMatters": "Career benefits and learning opportunities",
  "tags": ["Internship|Job", "Company name", "Domain"],
  "priority": number (1-10),
  "targetCourses": ["relevant courses"],
  "relatedResources": [{"title": "Application link", "url": "URL", "type": "application"}],
  "sourceLink": "official job posting URL"
}

Return only valid JSON array. Include REAL, ACTIVE opportunities.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return this.parseAIResponse(responseText, 'jobs-internships');
    } catch (error) {
      console.error('Error generating jobs/internships updates:', error);
      return [];
    }
  }

  /**
   * Generate Motivational & Success Stories
   */
  static async generateMotivationalUpdates() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate 2-3 recent motivational and inspirational updates for students. Include:

Categories to cover:
- Student success stories (young achievers, startup founders)
- Inspirational leader quotes or interviews
- Entrepreneurship success stories
- Overcoming challenges stories
- Innovation and research breakthroughs by students

For each update, provide in JSON format:
{
  "title": "Inspiring headline",
  "summary": "Brief inspirational summary",
  "detailedContent": "Detailed story with key learnings",
  "keyPoints": ["Key lesson 1", "Key lesson 2", "Key lesson 3"],
  "whyItMatters": "How this inspires and motivates students",
  "tags": ["Motivation", "Success", "Inspiration"],
  "priority": number (5-8),
  "relatedResources": [{"title": "Interview/Article", "url": "URL", "type": "article|video"}],
  "sourceLink": "source URL"
}

Return only valid JSON array. Focus on RECENT, REAL stories.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return this.parseAIResponse(responseText, 'motivation');
    } catch (error) {
      console.error('Error generating motivational updates:', error);
      return [];
    }
  }

  /**
   * Generate Startups & CEOs updates
   */
  static async generateStartupsCEOsUpdates() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate 2-3 recent updates about startups and CEOs relevant for students. Include:

Categories to cover:
- New CEO appointments at major companies
- Startup funding rounds (Indian and global)
- Unicorn startups and their growth
- Entrepreneurship initiatives and incubators
- Business leader insights and advice

For each update, provide in JSON format:
{
  "title": "Headline about startup/CEO/business",
  "summary": "Brief business update",
  "detailedContent": "Detailed context and implications",
  "keyPoints": ["Business lesson 1", "Lesson 2", "Lesson 3"],
  "whyItMatters": "What students can learn from this",
  "tags": ["Startup", "CEO", "Business", "Entrepreneurship"],
  "priority": number (4-7),
  "targetInterests": ["Entrepreneurship", "Business", "Startups"],
  "relatedResources": [{"title": "Company profile", "url": "URL", "type": "article"}],
  "sourceLink": "source URL"
}

Return only valid JSON array. Focus on RECENT news (last 7 days).`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return this.parseAIResponse(responseText, 'startups-ceos');
    } catch (error) {
      console.error('Error generating startups/CEOs updates:', error);
      return [];
    }
  }

  /**
   * Generate General Knowledge updates
   */
  static async generateGeneralKnowledgeUpdates() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate 2-3 recent general knowledge updates for students. Include:

Categories to cover:
- Government minister appointments or changes
- National and international awards (Nobel, Padma awards, etc.)
- Important days and events
- Scientific discoveries
- Space missions and achievements
- Sports achievements

For each update, provide in JSON format:
{
  "title": "Factual headline",
  "summary": "Brief factual summary",
  "detailedContent": "Detailed information",
  "keyPoints": ["Fact 1", "Fact 2", "Fact 3"],
  "whyItMatters": "Why this is important to know",
  "tags": ["GK", "Current Affairs", "specific category"],
  "priority": number (3-6),
  "sourceLink": "credible news source URL"
}

Return only valid JSON array. Focus on RECENT events (last 7 days).`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return this.parseAIResponse(responseText, 'general-knowledge');
    } catch (error) {
      console.error('Error generating GK updates:', error);
      return [];
    }
  }

  /**
   * Parse AI response and extract JSON
   */
  static parseAIResponse(responseText, category) {
    try {
      // Remove markdown code blocks if present
      let jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to find JSON array in the response
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      const updates = JSON.parse(jsonText);
      
      // Add category to each update and ensure proper data types
      return updates.map(update => {
        // Helper function to safely parse nested JSON strings
        const safeParseArray = (value, defaultValue = []) => {
          if (!value) return defaultValue;
          if (Array.isArray(value)) return value;
          if (typeof value === 'string') {
            // Try multiple parsing approaches
            try {
              // First try: direct JSON parse
              const parsed = JSON.parse(value);
              if (Array.isArray(parsed)) return parsed;
            } catch (e1) {
              try {
                // Second try: clean up and parse
                const cleaned = value
                  .replace(/^['"]|['"]$/g, '') // Remove outer quotes
                  .replace(/\\n/g, '') // Remove escaped newlines
                  .replace(/\n/g, '') // Remove actual newlines
                  .replace(/'/g, '"'); // Replace single quotes with double quotes
                const parsed = JSON.parse(cleaned);
                if (Array.isArray(parsed)) return parsed;
              } catch (e2) {
                // If all else fails, return default
                return defaultValue;
              }
            }
          }
          return defaultValue;
        };

        // Ensure relatedResources is an array of objects
        let relatedResources = safeParseArray(update.relatedResources, []);
        
        // Validate that each resource has required fields
        relatedResources = relatedResources.filter(res => 
          res && typeof res === 'object' && res.title && res.url
        );

        // Ensure keyPoints is an array
        let keyPoints = safeParseArray(update.keyPoints, []);
        if (!Array.isArray(keyPoints) || keyPoints.length === 0) {
          if (typeof update.keyPoints === 'string') {
            keyPoints = update.keyPoints.split('\n').map(p => p.trim()).filter(p => p);
          }
        }

        // Ensure tags is an array
        let tags = safeParseArray(update.tags, []);
        if (!Array.isArray(tags) || tags.length === 0) {
          if (typeof update.tags === 'string') {
            tags = update.tags.split(',').map(t => t.trim()).filter(t => t);
          }
        }

        // Ensure targetCourses is an array
        let targetCourses = safeParseArray(update.targetCourses, []);
        
        // Ensure targetInterests is an array
        let targetInterests = safeParseArray(update.targetInterests, []);

        return {
          title: update.title || 'Update',
          summary: update.summary || '',
          detailedContent: update.detailedContent || update.summary || '',
          keyPoints,
          whyItMatters: update.whyItMatters || '',
          tags,
          priority: update.priority || 5,
          targetCourses,
          targetInterests,
          relatedResources,
          sourceLink: update.sourceLink || '',
          category,
          aiGenerated: true,
          postedAt: new Date(),
          sourceName: update.sourceName || 'AI Generated',
          imageUrl: update.imageUrl || this.getDefaultImage(category)
        };
      });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Response text:', responseText);
      return [];
    }
  }

  /**
   * Normalize update data to ensure proper types for MongoDB
   */
  static normalizeUpdateData(update) {
    return {
      ...update,
      keyPoints: Array.isArray(update.keyPoints) ? update.keyPoints : [],
      tags: Array.isArray(update.tags) ? update.tags : [],
      targetCourses: Array.isArray(update.targetCourses) ? update.targetCourses : [],
      targetInterests: Array.isArray(update.targetInterests) ? update.targetInterests : [],
      relatedResources: Array.isArray(update.relatedResources) 
        ? update.relatedResources.filter(r => r && typeof r === 'object' && r.title && r.url)
        : [],
      postedAt: update.postedAt instanceof Date ? update.postedAt : new Date(),
      priority: typeof update.priority === 'number' ? update.priority : 5,
      viewCount: typeof update.viewCount === 'number' ? update.viewCount : 0,
      isActive: typeof update.isActive === 'boolean' ? update.isActive : true,
      aiGenerated: typeof update.aiGenerated === 'boolean' ? update.aiGenerated : false
    };
  }

  /**
   * Get dummy/fallback data when AI generation fails
   */
  static getDummyUpdates() {
    const dummyData = [
      {
        title: 'Welcome to Real-Time Updates',
        summary: 'Stay informed with the latest in education, technology, careers, and more. Updates are automatically curated every 6 hours.',
        detailedContent: 'The Real-Time Updates feature brings you curated information across multiple categories including Education, AI & Technology, Jobs & Internships, Motivation, Startups & CEOs, and General Knowledge. Our AI-powered system scans for relevant updates and presents them in an easy-to-read format.',
        keyPoints: [
          'Updates refresh automatically every 6 hours',
          'Content is personalized based on your courses and interests',
          'Click any update to see detailed information',
          'Use filters to browse specific categories'
        ],
        whyItMatters: 'Staying informed about the latest developments helps you make better decisions about your education and career path.',
        tags: ['Getting Started', 'Information', 'Platform'],
        priority: 10,
        targetCourses: [],
        targetInterests: [],
        relatedResources: [],
        sourceLink: '',
        category: 'general-knowledge',
        aiGenerated: false,
        postedAt: new Date(),
        sourceName: 'ConnectBook',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
        isActive: true,
        viewCount: 0
      },
      {
        title: 'Education System Continues to Evolve',
        summary: 'Educational institutions are adapting to new teaching methodologies and technologies to enhance student learning experiences.',
        detailedContent: 'The education sector is experiencing significant transformation with the adoption of digital learning tools, personalized learning approaches, and skill-based curricula. Universities and colleges are focusing on practical skills alongside theoretical knowledge.',
        keyPoints: [
          'Increased focus on practical skills and industry readiness',
          'Integration of technology in classrooms',
          'Emphasis on continuous learning and upskilling',
          'Collaboration between academia and industry'
        ],
        whyItMatters: 'Understanding these changes helps you adapt your learning strategy and prepare for future career opportunities.',
        tags: ['Education', 'Learning', 'Skills'],
        priority: 7,
        targetCourses: [],
        targetInterests: ['Education', 'Learning'],
        relatedResources: [
          {
            title: 'Modern Education Trends',
            url: 'https://www.education.com/trends',
            type: 'article'
          }
        ],
        sourceLink: '',
        category: 'education',
        aiGenerated: false,
        postedAt: new Date(),
        sourceName: 'ConnectBook',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
        isActive: true,
        viewCount: 0
      },
      {
        title: 'AI Technology Transforming Industries',
        summary: 'Artificial Intelligence continues to revolutionize how businesses operate and how we interact with technology.',
        detailedContent: 'AI technologies including machine learning, natural language processing, and computer vision are being integrated across industries. From healthcare to finance, AI is improving efficiency and creating new opportunities.',
        keyPoints: [
          'AI is creating new job opportunities',
          'Learning AI skills is increasingly valuable',
          'Ethical considerations in AI development',
          'AI tools are becoming more accessible'
        ],
        whyItMatters: 'Understanding AI trends helps you identify emerging career paths and skills worth developing.',
        tags: ['AI', 'Technology', 'Innovation', 'Career'],
        priority: 8,
        targetCourses: ['Computer Science', 'IT', 'Engineering'],
        targetInterests: ['Technology', 'AI', 'Innovation'],
        relatedResources: [
          {
            title: 'Introduction to AI',
            url: 'https://www.ai.com/intro',
            type: 'article'
          }
        ],
        sourceLink: '',
        category: 'ai-tech',
        aiGenerated: false,
        postedAt: new Date(),
        sourceName: 'ConnectBook',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        isActive: true,
        viewCount: 0
      },
      {
        title: 'Career Opportunities in Growing Industries',
        summary: 'Multiple sectors are actively hiring fresh talent, offering internships and entry-level positions.',
        detailedContent: 'The job market remains dynamic with opportunities in technology, healthcare, finance, and emerging sectors. Companies are looking for candidates with both technical and soft skills.',
        keyPoints: [
          'Tech sector continues strong hiring',
          'Internships are valuable for gaining experience',
          'Soft skills are as important as technical skills',
          'Remote work options are increasingly common'
        ],
        whyItMatters: 'Being aware of job market trends helps you prepare better and seize opportunities.',
        tags: ['Jobs', 'Career', 'Opportunities', 'Internships'],
        priority: 9,
        targetCourses: [],
        targetInterests: ['Career', 'Jobs'],
        relatedResources: [],
        sourceLink: '',
        category: 'jobs-internships',
        aiGenerated: false,
        postedAt: new Date(),
        sourceName: 'ConnectBook',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
        isActive: true,
        viewCount: 0
      },
      {
        title: 'Success Through Persistence and Learning',
        summary: 'Many successful professionals attribute their achievements to continuous learning and resilience in face of challenges.',
        detailedContent: 'Success stories from various fields show common traits: dedication to learning, willingness to adapt, and persistence through failures. These qualities are more important than initial talent or resources.',
        keyPoints: [
          'Continuous learning is key to growth',
          'Failures are learning opportunities',
          'Consistency beats intensity',
          'Build strong fundamentals'
        ],
        whyItMatters: 'Understanding the path to success helps you stay motivated during challenging times.',
        tags: ['Motivation', 'Success', 'Inspiration', 'Growth'],
        priority: 6,
        targetCourses: [],
        targetInterests: ['Personal Development', 'Success'],
        relatedResources: [],
        sourceLink: '',
        category: 'motivation',
        aiGenerated: false,
        postedAt: new Date(),
        sourceName: 'ConnectBook',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
        isActive: true,
        viewCount: 0
      }
    ];
    
    // Normalize all dummy data to ensure proper types
    return dummyData.map(update => this.normalizeUpdateData(update));
  }

  /**
   * Get default image for category
   */
  static getDefaultImage(category) {
    const images = {
      'education': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
      'ai-tech': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      'jobs-internships': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      'motivation': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      'startups-ceos': 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400',
      'general-knowledge': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400'
    };
    return images[category] || images['education'];
  }

  /**
   * Generate quote of the day
   */
  static async generateQuoteOfTheDay() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Generate an inspiring and motivational quote for students. Include:

Requirements:
- Should be relevant to education, learning, growth, or success
- Can be from famous personalities or original
- Should be encouraging and positive

Return in JSON format:
{
  "quote": "The quote text",
  "author": "Author name or 'Anonymous'",
  "context": "Brief context about why this quote matters"
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        quote: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        context: "Believe in yourself and your aspirations."
      };
    } catch (error) {
      console.error('Error generating quote:', error);
      return {
        quote: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela",
        context: "Empower yourself through learning."
      };
    }
  }

  /**
   * Helper to add delay between API calls to avoid rate limiting
   */
  static async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate all updates with rate limiting to avoid quota issues
   */
  static async generateAllUpdates() {
    console.log('🤖 Starting AI update generation with rate limiting...');
    
    try {
      const allUpdates = [];
      
      // Generate updates sequentially with delays to avoid quota issues
      // Free tier: 15 RPM (Requests Per Minute) = 1 request every 4 seconds
      const generators = [
        { name: 'Education', fn: () => this.generateEducationUpdates() },
        { name: 'AI/Tech', fn: () => this.generateAITechUpdates() },
        { name: 'Jobs', fn: () => this.generateJobsInternshipsUpdates() },
        { name: 'Motivation', fn: () => this.generateMotivationalUpdates() },
        { name: 'Startups', fn: () => this.generateStartupsCEOsUpdates() },
        { name: 'General Knowledge', fn: () => this.generateGeneralKnowledgeUpdates() }
      ];

      for (let i = 0; i < generators.length; i++) {
        const generator = generators[i];
        try {
          console.log(`  📝 Generating ${generator.name} updates...`);
          const updates = await generator.fn();
          allUpdates.push(...updates);
          console.log(`  ✅ ${generator.name}: ${updates.length} updates`);
          
          // Add delay between requests (except after the last one)
          if (i < generators.length - 1) {
            console.log(`  ⏳ Waiting 5 seconds to avoid rate limit...`);
            await this.delay(5000); // 5 second delay between requests
          }
        } catch (error) {
          console.error(`  ❌ ${generator.name} failed:`, error.message);
          // Continue with other categories even if one fails
        }
      }

      // If AI generation failed or produced too few updates, use dummy data
      if (allUpdates.length < 3) {
        console.log('⚠️ AI generation produced insufficient updates, using fallback data');
        const dummyData = this.getDummyUpdates();
        console.log(`✅ Generated ${dummyData.length} fallback updates`);
        return dummyData;
      }

      console.log(`✅ Total: Generated ${allUpdates.length} AI updates`);
      return allUpdates;
    } catch (error) {
      console.error('❌ Critical error in update generation:', error);
      console.log('⚠️ Using fallback dummy data');
      const dummyData = this.getDummyUpdates();
      console.log(`✅ Generated ${dummyData.length} fallback updates`);
      return dummyData;
    }
  }
}

export default UpdateGeneratorService;
