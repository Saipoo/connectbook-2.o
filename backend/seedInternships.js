import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Internship from './models/Internship.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const internshipsData = [
  {
    company: 'Google',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    domain: 'Web Development',
    role: 'Frontend Developer',
    duration: 8,
    skillLevel: 'Intermediate',
    description: 'Join Google as a Frontend Developer intern and work on cutting-edge web technologies. Build user interfaces for millions of users worldwide using React, TypeScript, and modern web standards.',
    learningObjectives: [
      'Master React and modern JavaScript frameworks',
      'Build scalable and performant web applications',
      'Implement responsive and accessible UI components',
      'Collaborate with cross-functional teams',
      'Learn Google\'s development practices and tools'
    ],
    prerequisites: [
      'Strong knowledge of HTML, CSS, and JavaScript',
      'Experience with React or similar frameworks',
      'Understanding of responsive design',
      'Basic Git knowledge'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    domain: 'Data Science',
    role: 'Data Analyst',
    duration: 10,
    skillLevel: 'Intermediate',
    description: 'Work with Microsoft\'s data team to analyze large datasets, create insights, and build predictive models. Use Python, SQL, and Azure tools to solve real business problems.',
    learningObjectives: [
      'Analyze and visualize large datasets',
      'Build predictive models using machine learning',
      'Create interactive dashboards and reports',
      'Work with Azure Data Services',
      'Present data-driven insights to stakeholders'
    ],
    prerequisites: [
      'Python programming experience',
      'SQL knowledge',
      'Statistics fundamentals',
      'Data visualization basics'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    domain: 'Cloud Computing',
    role: 'Cloud Engineer',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Build and maintain cloud infrastructure on AWS. Work with EC2, S3, Lambda, and other AWS services to create scalable and secure cloud solutions.',
    learningObjectives: [
      'Design and implement cloud architectures',
      'Manage AWS services and resources',
      'Implement security and compliance measures',
      'Automate deployment with Infrastructure as Code',
      'Monitor and optimize cloud performance'
    ],
    prerequisites: [
      'Linux/Unix command line experience',
      'Networking fundamentals',
      'Programming in Python or similar',
      'Basic AWS knowledge'
    ],
    tasksCount: 6,
    isActive: true
  },
  {
    company: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    domain: 'Frontend Development',
    role: 'React Developer',
    duration: 8,
    skillLevel: 'Intermediate',
    description: 'Join Meta\'s frontend team and build engaging user experiences using React. Work on products used by billions of people worldwide.',
    learningObjectives: [
      'Master React and React Native',
      'Build complex UI components',
      'Optimize performance and user experience',
      'Implement state management solutions',
      'Work with GraphQL and REST APIs'
    ],
    prerequisites: [
      'Strong JavaScript knowledge',
      'React experience',
      'Understanding of state management',
      'Responsive design skills'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    domain: 'Mobile Development',
    role: 'iOS Developer',
    duration: 10,
    skillLevel: 'Advanced',
    description: 'Develop iOS applications using Swift and SwiftUI. Create beautiful and performant apps for iPhone and iPad.',
    learningObjectives: [
      'Master Swift programming language',
      'Build iOS apps with SwiftUI',
      'Implement iOS design patterns',
      'Work with Apple frameworks and APIs',
      'Submit apps to the App Store'
    ],
    prerequisites: [
      'Swift or iOS development experience',
      'Understanding of mobile app architecture',
      'Xcode familiarity',
      'Object-oriented programming knowledge'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    domain: 'Backend Development',
    role: 'Backend Engineer',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Build scalable backend systems that power Netflix streaming services. Work with microservices, distributed systems, and high-performance APIs.',
    learningObjectives: [
      'Design microservices architecture',
      'Build RESTful and GraphQL APIs',
      'Implement caching and optimization strategies',
      'Work with databases at scale',
      'Monitor and debug production systems'
    ],
    prerequisites: [
      'Strong programming skills (Java, Python, or Node.js)',
      'Database knowledge (SQL and NoSQL)',
      'Understanding of system design',
      'API development experience'
    ],
    tasksCount: 6,
    isActive: true
  },
  {
    company: 'Spotify',
    logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png',
    domain: 'Machine Learning',
    role: 'ML Engineer',
    duration: 10,
    skillLevel: 'Advanced',
    description: 'Work on recommendation systems and music analysis using machine learning. Build models that help millions of users discover new music.',
    learningObjectives: [
      'Build recommendation systems',
      'Implement ML models in production',
      'Work with large-scale data pipelines',
      'Optimize model performance',
      'A/B test ML features'
    ],
    prerequisites: [
      'Python and ML libraries (TensorFlow, PyTorch)',
      'Machine learning fundamentals',
      'Statistics and linear algebra',
      'Data processing experience'
    ],
    tasksCount: 6,
    isActive: true
  },
  {
    company: 'Tesla',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg',
    domain: 'Artificial Intelligence',
    role: 'AI Research Intern',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Contribute to Tesla\'s autonomous driving AI systems. Work on computer vision, deep learning, and neural networks.',
    learningObjectives: [
      'Implement computer vision algorithms',
      'Train deep neural networks',
      'Work with sensor data and perception systems',
      'Optimize AI models for real-time performance',
      'Research cutting-edge AI techniques'
    ],
    prerequisites: [
      'Deep learning experience',
      'Python and PyTorch/TensorFlow',
      'Computer vision knowledge',
      'Strong math background'
    ],
    tasksCount: 6,
    isActive: true
  },
  {
    company: 'Airbnb',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    domain: 'Full Stack Development',
    role: 'Full Stack Developer',
    duration: 10,
    skillLevel: 'Intermediate',
    description: 'Build end-to-end features for Airbnb platform. Work with React, Node.js, and modern web technologies.',
    learningObjectives: [
      'Develop full-stack web applications',
      'Build RESTful APIs with Node.js',
      'Create responsive UIs with React',
      'Implement database solutions',
      'Deploy and monitor applications'
    ],
    prerequisites: [
      'JavaScript and Node.js experience',
      'React or similar framework knowledge',
      'Database fundamentals',
      'Git and version control'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'IBM',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    domain: 'Cloud Computing',
    role: 'DevOps Engineer',
    duration: 10,
    skillLevel: 'Intermediate',
    description: 'Automate deployment pipelines and manage cloud infrastructure. Work with CI/CD tools, containers, and orchestration platforms.',
    learningObjectives: [
      'Build CI/CD pipelines',
      'Work with Docker and Kubernetes',
      'Implement Infrastructure as Code',
      'Monitor and troubleshoot systems',
      'Automate deployment processes'
    ],
    prerequisites: [
      'Linux system administration',
      'Scripting (Bash, Python)',
      'Basic cloud knowledge',
      'Version control (Git)'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'Adobe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png',
    domain: 'UI/UX Design',
    role: 'UI/UX Designer',
    duration: 8,
    skillLevel: 'Intermediate',
    description: 'Design beautiful and intuitive user interfaces for Adobe products. Work with design tools, prototyping, and user research.',
    learningObjectives: [
      'Create user-centered designs',
      'Build interactive prototypes',
      'Conduct user research and testing',
      'Design responsive interfaces',
      'Collaborate with development teams'
    ],
    prerequisites: [
      'Figma or Adobe XD experience',
      'UI/UX design principles',
      'Understanding of user psychology',
      'Portfolio of design work'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'Intel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg',
    domain: 'Cybersecurity',
    role: 'Security Analyst',
    duration: 10,
    skillLevel: 'Advanced',
    description: 'Protect Intel\'s systems and data from cyber threats. Analyze security vulnerabilities, monitor threats, and implement security measures.',
    learningObjectives: [
      'Conduct security assessments',
      'Analyze and respond to threats',
      'Implement security controls',
      'Perform penetration testing',
      'Document security incidents'
    ],
    prerequisites: [
      'Networking and security fundamentals',
      'Linux and Windows security',
      'Programming/scripting skills',
      'Understanding of security frameworks'
    ],
    tasksCount: 5,
    isActive: true
  }
];

const seedInternships = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing internships (optional)
    await Internship.deleteMany({});
    console.log('🗑️  Cleared existing internships');

    // Insert new internships
    const result = await Internship.insertMany(internshipsData);
    console.log(`✅ Successfully seeded ${result.length} internships!`);

    console.log('\n📊 Internships by domain:');
    const domains = {};
    result.forEach(internship => {
      domains[internship.domain] = (domains[internship.domain] || 0) + 1;
    });
    Object.entries(domains).forEach(([domain, count]) => {
      console.log(`   ${domain}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding internships:', error);
    process.exit(1);
  }
};

seedInternships();
