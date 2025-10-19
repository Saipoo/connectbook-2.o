import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Internship from './models/Internship.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Real-world internships with actual website links
const internshipsData = [
  {
    company: 'Google STEP Program',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    domain: 'Web Development',
    role: 'Software Engineering Intern',
    duration: 12,
    skillLevel: 'Intermediate',
    description: 'Google\'s STEP (Student Training in Engineering Program) is a 12-week developmental internship for first and second-year undergraduate students with a passion for technology.',
    learningObjectives: [
      'Work on real Google products used by billions',
      'Get mentorship from Google engineers',
      'Learn software development at scale',
      'Participate in technical training sessions',
      'Build production-ready features'
    ],
    prerequisites: [
      'Currently pursuing CS or related degree',
      'Knowledge of data structures and algorithms',
      'Proficiency in one programming language',
      'Strong problem-solving skills'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://buildyourfuture.withgoogle.com/programs/step',
    applyUrl: 'https://careers.google.com/students/',
    stipend: '₹80,000 - ₹1,00,000 per month',
    location: 'Bangalore / Hyderabad / Remote'
  },
  {
    company: 'Microsoft Internship',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    domain: 'Data Science',
    role: 'Data Science Intern',
    duration: 10,
    skillLevel: 'Intermediate',
    description: 'Microsoft internship program offers hands-on experience with Azure ML, Power BI, and data analytics on real-world projects.',
    learningObjectives: [
      'Work with Azure Machine Learning',
      'Build predictive models',
      'Create data visualizations with Power BI',
      'Analyze large-scale datasets',
      'Present insights to stakeholders'
    ],
    prerequisites: [
      'Python and SQL proficiency',
      'Statistics and ML basics',
      'Data analysis experience',
      'Strong analytical mindset'
    ],
    tasksCount: 5,
    isActive: true,
    websiteUrl: 'https://careers.microsoft.com/students/us/en/internship-opportunities',
    applyUrl: 'https://careers.microsoft.com/students',
    stipend: '₹75,000 - ₹95,000 per month',
    location: 'Bangalore / Hyderabad / Remote'
  },
  {
    company: 'Amazon SDE Internship',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    domain: 'Cloud Computing',
    role: 'Software Development Engineer Intern',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Work with Amazon Web Services (AWS) team on cloud infrastructure, serverless applications, and distributed systems.',
    learningObjectives: [
      'Build cloud-native applications on AWS',
      'Design scalable architectures',
      'Work with Lambda, EC2, S3, DynamoDB',
      'Implement CI/CD pipelines',
      'Learn AWS best practices'
    ],
    prerequisites: [
      'Strong coding skills in Java/Python',
      'Understanding of cloud concepts',
      'Data structures and algorithms',
      'System design basics'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://www.amazon.jobs/en/business_categories/student-programs',
    applyUrl: 'https://www.amazon.jobs/en/teams/internships-for-students',
    stipend: '₹85,000 - ₹1,10,000 per month',
    location: 'Bangalore / Hyderabad'
  },
  {
    company: 'Meta University',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    domain: 'Frontend Development',
    role: 'Frontend Engineer Intern',
    duration: 10,
    skillLevel: 'Intermediate',
    description: 'Meta University is an immersive 8-10 week internship program designed for students interested in mobile and web development.',
    learningObjectives: [
      'Build features for Facebook, Instagram, WhatsApp',
      'Master React and React Native',
      'Learn Meta\'s development practices',
      'Work on products used by billions',
      'Collaborate with global teams'
    ],
    prerequisites: [
      'JavaScript and React knowledge',
      'Mobile or web development experience',
      'CS fundamentals',
      'Passion for user experience'
    ],
    tasksCount: 5,
    isActive: true,
    websiteUrl: 'https://www.metacareers.com/careerprograms/pathways',
    applyUrl: 'https://www.metacareers.com/students/',
    stipend: '₹90,000 - ₹1,15,000 per month',
    location: 'Gurgaon / Remote'
  },
  {
    company: 'Apple Internship',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    domain: 'Mobile Development',
    role: 'iOS Developer Intern',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Join Apple as an iOS developer intern and work on innovative apps for iPhone, iPad, and Apple Watch using Swift and SwiftUI.',
    learningObjectives: [
      'Develop apps with Swift and SwiftUI',
      'Learn iOS design patterns',
      'Work with Core Data and CloudKit',
      'Implement Apple\'s Human Interface Guidelines',
      'Build features for iOS ecosystem'
    ],
    prerequisites: [
      'Swift programming experience',
      'iOS development knowledge',
      'UI/UX design basics',
      'Xcode familiarity'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://www.apple.com/careers/in/students.html',
    applyUrl: 'https://jobs.apple.com/en-in/search?team=internships-STDNT-INTRN',
    stipend: '₹95,000 - ₹1,20,000 per month',
    location: 'Bangalore / Hyderabad'
  },
  {
    company: 'Netflix Tech Internship',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    domain: 'Backend Development',
    role: 'Backend Engineer Intern',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Work on Netflix\'s microservices architecture, streaming infrastructure, and recommendation systems at massive scale.',
    learningObjectives: [
      'Build microservices with Java/Spring Boot',
      'Work with distributed systems',
      'Design scalable APIs',
      'Learn Netflix OSS tools',
      'Handle high-traffic systems'
    ],
    prerequisites: [
      'Strong backend development skills',
      'Java or Python expertise',
      'Database knowledge (SQL/NoSQL)',
      'API design experience'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://jobs.netflix.com/students',
    applyUrl: 'https://jobs.netflix.com/search?q=intern',
    stipend: '₹1,00,000 - ₹1,30,000 per month',
    location: 'Remote / Bangalore'
  },
  {
    company: 'Spotify Internship',
    logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png',
    domain: 'Machine Learning',
    role: 'ML Engineer Intern',
    duration: 10,
    skillLevel: 'Advanced',
    description: 'Work on Spotify\'s recommendation algorithms, personalization systems, and audio analysis using cutting-edge ML techniques.',
    learningObjectives: [
      'Build recommendation systems',
      'Work with audio processing',
      'Implement ML pipelines',
      'Use TensorFlow and PyTorch',
      'Deploy models to production'
    ],
    prerequisites: [
      'Strong ML/AI fundamentals',
      'Python and ML frameworks',
      'Statistics and math background',
      'Experience with deep learning'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://www.lifeatspotify.com/students',
    applyUrl: 'https://www.spotifyjobs.com/students/',
    stipend: '₹85,000 - ₹1,10,000 per month',
    location: 'Stockholm / Remote'
  },
  {
    company: 'Adobe Research',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg',
    domain: 'Artificial Intelligence',
    role: 'AI Research Intern',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Adobe Research internship focuses on computer vision, natural language processing, and creative AI for products like Photoshop and Premiere Pro.',
    learningObjectives: [
      'Research cutting-edge AI/ML',
      'Work on computer vision projects',
      'Implement generative AI models',
      'Publish research papers',
      'Build AI features for Adobe products'
    ],
    prerequisites: [
      'Strong research background',
      'Deep learning expertise',
      'Python and ML frameworks',
      'Published papers (preferred)'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://research.adobe.com/careers/internships/',
    applyUrl: 'https://adobe.wd5.myworkdayjobs.com/en-US/external_university',
    stipend: '₹90,000 - ₹1,15,000 per month',
    location: 'Bangalore / Remote'
  },
  {
    company: 'Intel Internship',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg',
    domain: 'Cybersecurity',
    role: 'Security Engineer Intern',
    duration: 10,
    skillLevel: 'Advanced',
    description: 'Work on hardware and software security, vulnerability research, and security tool development at Intel.',
    learningObjectives: [
      'Learn hardware security',
      'Conduct vulnerability assessments',
      'Build security tools',
      'Understand cryptography',
      'Work with secure boot and TEE'
    ],
    prerequisites: [
      'Security fundamentals',
      'C/C++ programming',
      'Understanding of OS internals',
      'Network security basics'
    ],
    tasksCount: 5,
    isActive: true,
    websiteUrl: 'https://www.intel.com/content/www/us/en/jobs/students-and-grads.html',
    applyUrl: 'https://intel.wd1.myworkdayjobs.com/External/4+results?workerSubType=ab40a98049581037540416f389519b00',
    stipend: '₹70,000 - ₹90,000 per month',
    location: 'Bangalore'
  },
  {
    company: 'Airbnb Engineering',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    domain: 'Full Stack Development',
    role: 'Full Stack Developer Intern',
    duration: 12,
    skillLevel: 'Intermediate',
    description: 'Build end-to-end features for Airbnb\'s platform using React, Node.js, and modern web technologies.',
    learningObjectives: [
      'Full stack development with MERN',
      'Build scalable web applications',
      'Work with microservices',
      'Implement real-time features',
      'Learn Airbnb\'s engineering culture'
    ],
    prerequisites: [
      'JavaScript/TypeScript proficiency',
      'React and Node.js experience',
      'Database knowledge',
      'API design understanding'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://careers.airbnb.com/university/',
    applyUrl: 'https://careers.airbnb.com/positions/?team=Interns',
    stipend: '₹85,000 - ₹1,05,000 per month',
    location: 'Remote / Bangalore'
  },
  {
    company: 'IBM Developer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    domain: 'DevOps',
    role: 'DevOps Engineer Intern',
    duration: 10,
    skillLevel: 'Intermediate',
    description: 'Work with IBM Cloud, Kubernetes, and CI/CD pipelines to automate infrastructure and deployments.',
    learningObjectives: [
      'Master Docker and Kubernetes',
      'Build CI/CD pipelines',
      'Work with IBM Cloud',
      'Implement Infrastructure as Code',
      'Monitor and optimize systems'
    ],
    prerequisites: [
      'Linux command line proficiency',
      'Scripting (Python/Bash)',
      'Basic cloud knowledge',
      'Understanding of containers'
    ],
    tasksCount: 5,
    isActive: true,
    websiteUrl: 'https://www.ibm.com/employment/entrylevel/',
    applyUrl: 'https://www.ibm.com/employment/entrylevel/index.html',
    stipend: '₹60,000 - ₹80,000 per month',
    location: 'Bangalore / Pune'
  },
  {
    company: 'Tesla Software',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    domain: 'Artificial Intelligence',
    role: 'Autopilot AI Intern',
    duration: 12,
    skillLevel: 'Advanced',
    description: 'Work on Tesla\'s Full Self-Driving (FSD) technology, computer vision, and neural networks for autonomous vehicles.',
    learningObjectives: [
      'Develop AI for autonomous driving',
      'Work with computer vision',
      'Train neural networks',
      'Process sensor data',
      'Contribute to FSD development'
    ],
    prerequisites: [
      'Strong ML/AI background',
      'Computer vision experience',
      'Python and C++ skills',
      'Deep learning expertise'
    ],
    tasksCount: 6,
    isActive: true,
    websiteUrl: 'https://www.tesla.com/careers/search/?country=US&type=3',
    applyUrl: 'https://www.tesla.com/careers/search/job/internship-software-engineering-vehicle-software-fall-2025-228882',
    stipend: '₹1,10,000 - ₹1,40,000 per month',
    location: 'Palo Alto / Remote'
  }
];

const seedInternships = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing internships
    await Internship.deleteMany({});
    console.log('🗑️  Cleared existing internships');

    // Insert new internships
    const result = await Internship.insertMany(internshipsData);
    console.log(`✅ Seeded ${result.length} real-world internships with application links`);

    console.log('\n🎯 Internships seeded:');
    result.forEach((internship, index) => {
      console.log(`${index + 1}. ${internship.company} - ${internship.role}`);
      console.log(`   Apply: ${internship.applyUrl}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding internships:', error);
    process.exit(1);
  }
};

seedInternships();
