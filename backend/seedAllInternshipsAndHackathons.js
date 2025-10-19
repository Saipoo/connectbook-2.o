import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Internship from './models/Internship.js';
import HackathonChallenge from './models/HackathonChallenge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// ========== DUMMY/SIMULATION INTERNSHIPS ==========
const dummyInternships = [
  {
    company: 'Google',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    domain: 'Web Development',
    role: 'Frontend Developer',
    duration: 8,
    skillLevel: 'Intermediate',
    description: '🎯 SIMULATION: Join Google as a Frontend Developer intern and work on cutting-edge web technologies. Build user interfaces for millions of users worldwide using React, TypeScript, and modern web standards.',
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
    description: '🎯 SIMULATION: Work with Microsoft\'s data team to analyze large datasets, create insights, and build predictive models. Use Python, SQL, and Azure tools to solve real business problems.',
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
    description: '🎯 SIMULATION: Build and maintain cloud infrastructure on AWS. Work with EC2, S3, Lambda, and other AWS services to create scalable and secure cloud solutions.',
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
    description: '🎯 SIMULATION: Join Meta\'s frontend team and build engaging user experiences using React. Work on products used by billions of people worldwide.',
    learningObjectives: [
      'Master React and React Native',
      'Build complex UI components',
      'Optimize performance and user experience',
      'Implement state management solutions',
      'Work with GraphQL and REST APIs'
    ],
    prerequisites: [
      'Strong knowledge of JavaScript and React',
      'Understanding of component lifecycle',
      'Experience with state management',
      'RESTful API integration experience'
    ],
    tasksCount: 5,
    isActive: true
  }
];

// ========== REAL-WORLD INTERNSHIPS WITH EXTERNAL LINKS ==========
const realInternships = [
  {
    company: 'Google STEP Program',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    domain: 'Software Engineering',
    role: 'Student Training in Engineering Program (STEP)',
    duration: 12,
    skillLevel: 'Beginner',
    description: '🌐 REAL OPPORTUNITY: Google STEP is a developmental summer internship program for first and second-year undergraduate students. Work on real projects with Googlers and build your technical skills.',
    websiteUrl: 'https://buildyourfuture.withgoogle.com/programs/step',
    applyUrl: 'https://careers.google.com/students/',
    stipend: '₹80,000 - ₹1,00,000 per month',
    location: 'Bangalore / Hyderabad / Remote',
    deadline: new Date('2025-12-31'),
    learningObjectives: [
      'Work on real Google products and services',
      'Learn industry-standard development practices',
      'Collaborate with experienced software engineers',
      'Build production-quality code',
      'Network with Google teams and interns'
    ],
    prerequisites: [
      'Currently enrolled in 1st or 2nd year undergraduate program',
      'Basic programming knowledge (any language)',
      'Problem-solving skills',
      'Strong academic record'
    ],
    tasksCount: 4,
    isActive: true
  },
  {
    company: 'Microsoft Learn Student Ambassadors',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    domain: 'Data Science',
    role: 'Data Science Intern',
    duration: 10,
    skillLevel: 'Intermediate',
    description: '🌐 REAL OPPORTUNITY: Join Microsoft as a Data Science intern and work on AI/ML projects. Gain hands-on experience with Azure Machine Learning and real-world datasets.',
    websiteUrl: 'https://careers.microsoft.com/students/us/en',
    applyUrl: 'https://careers.microsoft.com/students/us/en/job/1751713/Data-Science-Intern',
    stipend: '₹90,000 - ₹1,20,000 per month',
    location: 'Hyderabad / Bangalore / Noida',
    deadline: new Date('2025-11-30'),
    learningObjectives: [
      'Build ML models on Azure platform',
      'Work with large-scale data pipelines',
      'Collaborate with product teams',
      'Present insights to stakeholders',
      'Contribute to production systems'
    ],
    prerequisites: [
      'Python and R programming',
      'Statistics and ML fundamentals',
      'SQL and data analysis',
      'Currently pursuing Bachelor\'s or Master\'s'
    ],
    tasksCount: 5,
    isActive: true
  },
  {
    company: 'Amazon Web Services (AWS)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    domain: 'Cloud Computing',
    role: 'SDE Intern - Cloud Services',
    duration: 12,
    skillLevel: 'Intermediate',
    description: '🌐 REAL OPPORTUNITY: Amazon is seeking talented students to join our team as Software Development Engineer Interns. Work on AWS services that power millions of businesses worldwide.',
    websiteUrl: 'https://amazon.jobs/en/teams/internships-for-students',
    applyUrl: 'https://amazon.jobs/en/jobs/2408098/software-development-engineer-intern',
    stipend: '₹1,00,000 - ₹1,40,000 per month',
    location: 'Bangalore / Hyderabad / Chennai',
    deadline: new Date('2026-01-15'),
    learningObjectives: [
      'Design and develop scalable AWS services',
      'Write production-quality code',
      'Participate in code reviews',
      'Work with distributed systems',
      'Solve complex technical problems'
    ],
    prerequisites: [
      'Strong CS fundamentals (DSA, OS, Networks)',
      'Programming in Java, C++, or Python',
      'Currently pursuing Bachelor\'s or Master\'s in CS',
      'Problem-solving and analytical skills'
    ],
    tasksCount: 6,
    isActive: true
  },
  {
    company: 'Meta University',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    domain: 'Software Engineering',
    role: 'Meta University Intern',
    duration: 10,
    skillLevel: 'Beginner',
    description: '🌐 REAL OPPORTUNITY: Meta University is a hands-on, immersive internship program for students interested in computer science. Build real products that impact billions of users.',
    websiteUrl: 'https://www.metacareers.com/students',
    applyUrl: 'https://www.metacareers.com/jobs/1234567890/meta-university-engineer-intern/',
    stipend: '₹85,000 - ₹1,10,000 per month',
    location: 'Bangalore / Remote',
    deadline: new Date('2025-12-15'),
    learningObjectives: [
      'Build features for Facebook, Instagram, or WhatsApp',
      'Learn mobile and web development at scale',
      'Collaborate with mentors and peers',
      'Understand Meta\'s tech stack',
      'Work on open-source projects'
    ],
    prerequisites: [
      'Currently in 1st or 2nd year of undergraduate',
      'Basic programming skills',
      'Interest in building user-facing products',
      'Collaborative mindset'
    ],
    tasksCount: 5,
    isActive: true
  }
];

// ========== DUMMY/SIMULATION HACKATHONS ==========
const dummyHackathons = [
  {
    title: 'AI Innovation Challenge 2025',
    description: '🎯 SIMULATION: Build the next generation of AI-powered applications using cutting-edge machine learning models.',
    theme: 'Artificial Intelligence & Machine Learning',
    difficulty: 'Advanced',
    duration: 48,
    maxTeamSize: 4,
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-03'),
    registrationDeadline: new Date('2025-10-25'),
    status: 'upcoming',
    rules: [
      'Teams must have 2-4 members',
      'All code must be original',
      'Use of pre-trained models is allowed',
      'Submit working demo and presentation',
      'Follow ethical AI guidelines'
    ],
    judgingCriteria: [
      { criterion: 'Innovation', weight: 30 },
      { criterion: 'Technical Implementation', weight: 25 },
      { criterion: 'User Experience', weight: 20 },
      { criterion: 'Presentation', weight: 15 },
      { criterion: 'Social Impact', weight: 10 }
    ],
    prizes: [
      { position: 1, title: 'First Prize', amount: 100000, benefits: ['Trophy', 'Certificate', 'Internship Opportunity'] },
      { position: 2, title: 'Second Prize', amount: 50000, benefits: ['Trophy', 'Certificate'] },
      { position: 3, title: 'Third Prize', amount: 25000, benefits: ['Certificate'] }
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face'],
    tracks: ['Healthcare AI', 'Educational AI', 'Sustainability AI', 'Creative AI'],
    mentorsAvailable: true,
    requiresSubmission: true
  },
  {
    title: 'Web3 & Blockchain Hackathon',
    description: '🎯 SIMULATION: Create decentralized applications that revolutionize how we interact with the internet.',
    theme: 'Blockchain & Decentralization',
    difficulty: 'Advanced',
    duration: 72,
    maxTeamSize: 5,
    startDate: new Date('2025-11-15'),
    endDate: new Date('2025-11-18'),
    registrationDeadline: new Date('2025-11-08'),
    status: 'upcoming',
    rules: [
      'Teams must have 2-5 members',
      'Must use blockchain technology',
      'Deploy smart contracts on testnet',
      'Open-source your code',
      'Working prototype required'
    ],
    judgingCriteria: [
      { criterion: 'Innovation', weight: 30 },
      { criterion: 'Technical Complexity', weight: 25 },
      { criterion: 'Security', weight: 20 },
      { criterion: 'Usability', weight: 15 },
      { criterion: 'Business Model', weight: 10 }
    ],
    prizes: [
      { position: 1, title: 'First Prize', amount: 150000, benefits: ['Trophy', 'Crypto Rewards', 'Mentorship'] },
      { position: 2, title: 'Second Prize', amount: 75000, benefits: ['Trophy', 'Crypto Rewards'] },
      { position: 3, title: 'Third Prize', amount: 35000, benefits: ['Certificate'] }
    ],
    technologies: ['Solidity', 'Ethereum', 'Web3.js', 'IPFS', 'React'],
    tracks: ['DeFi', 'NFT Marketplace', 'DAO Tools', 'Social dApps'],
    mentorsAvailable: true,
    requiresSubmission: true
  }
];

// ========== REAL-WORLD HACKATHONS WITH EXTERNAL LINKS ==========
const realHackathons = [
  {
    title: 'Smart India Hackathon 2025',
    description: '🌐 REAL HACKATHON: Asia\'s biggest open innovation model & National level hackathon organized by the Ministry of Education, Govt. of India.',
    theme: 'Innovation for Nation Building',
    difficulty: 'Intermediate',
    duration: 36,
    maxTeamSize: 6,
    startDate: new Date('2025-12-10'),
    endDate: new Date('2025-12-12'),
    registrationDeadline: new Date('2025-11-15'),
    status: 'upcoming',
    websiteUrl: 'https://www.sih.gov.in/',
    registerUrl: 'https://www.sih.gov.in/sih2024PS',
    rulesUrl: 'https://www.sih.gov.in/sih2024Rules',
    organizer: 'Ministry of Education, Govt. of India',
    venue: 'Multiple Nodal Centers across India',
    type: 'offline',
    totalPrize: '₹2,25,000',
    rules: [
      'Team of 6 members (1 leader + 5 members)',
      'Must be students of recognized institutions',
      'Choose from 250+ problem statements',
      'Build working prototype in 36 hours',
      'Present to expert jury panel'
    ],
    judgingCriteria: [
      { criterion: 'Innovation & Creativity', weight: 30 },
      { criterion: 'Technical Feasibility', weight: 25 },
      { criterion: 'Impact & Scalability', weight: 20 },
      { criterion: 'Presentation', weight: 15 },
      { criterion: 'Working Prototype', weight: 10 }
    ],
    prizes: [
      { position: 1, title: 'Winner', amount: 100000, benefits: ['Certificate', 'Internship Opportunities'] },
      { position: 2, title: 'Runner Up', amount: 75000, benefits: ['Certificate'] },
      { position: 3, title: '2nd Runner Up', amount: 50000, benefits: ['Certificate'] }
    ],
    technologies: ['Open to all tech stacks', 'AI/ML', 'IoT', 'Blockchain', 'Web/Mobile'],
    tracks: ['Smart Automation', 'Healthcare', 'Agriculture', 'Education', 'Smart Vehicles', 'Travel & Tourism'],
    mentorsAvailable: true,
    requiresSubmission: true
  },
  {
    title: 'HackWithInfy 2025',
    description: '🌐 REAL HACKATHON: Infosys flagship hackathon for engineering students. Winners get pre-placement interview calls and cash prizes!',
    theme: 'Code. Compete. Conquer.',
    difficulty: 'Advanced',
    duration: 48,
    maxTeamSize: 3,
    startDate: new Date('2025-11-20'),
    endDate: new Date('2025-11-22'),
    registrationDeadline: new Date('2025-10-31'),
    status: 'upcoming',
    websiteUrl: 'https://www.hackerearth.com/challenges/hackathon/hackwithinfy-2025/',
    registerUrl: 'https://www.hackerearth.com/challenges/hackathon/hackwithinfy-2025/register/',
    rulesUrl: 'https://www.hackerearth.com/challenges/hackathon/hackwithinfy-2025/rules/',
    organizer: 'Infosys Limited',
    venue: 'Online (Grand Finale at Infosys Campus)',
    type: 'hybrid',
    totalPrize: '₹4,50,000',
    rules: [
      'Open to 2023, 2024, 2025 batch students',
      'Individual or team of up to 3 members',
      'Solve coding challenges in Round 1',
      'Build innovative solution in Grand Finale',
      'Winners get PPO (Pre-Placement Offer)'
    ],
    judgingCriteria: [
      { criterion: 'Code Quality', weight: 30 },
      { criterion: 'Problem Solving', weight: 25 },
      { criterion: 'Innovation', weight: 20 },
      { criterion: 'Scalability', weight: 15 },
      { criterion: 'Presentation', weight: 10 }
    ],
    prizes: [
      { position: 1, title: 'Winner', amount: 200000, benefits: ['PPO from Infosys', 'Certificate', 'Trophy'] },
      { position: 2, title: 'Runner Up', amount: 150000, benefits: ['Fast-track Interview', 'Certificate'] },
      { position: 3, title: '2nd Runner Up', amount: 100000, benefits: ['Fast-track Interview', 'Certificate'] }
    ],
    technologies: ['Java', 'Python', 'Full Stack', 'Cloud', 'AI/ML'],
    tracks: ['Open Innovation', 'Enterprise Solutions', 'Social Impact'],
    mentorsAvailable: true,
    requiresSubmission: true
  },
  {
    title: 'Google Solution Challenge 2025',
    description: '🌐 REAL HACKATHON: Build solutions for local communities using Google technologies. Global competition with $3000+ in prizes per team!',
    theme: 'Solve for Social Good',
    difficulty: 'Intermediate',
    duration: 2160,
    maxTeamSize: 4,
    startDate: new Date('2025-10-01'),
    endDate: new Date('2026-01-01'),
    registrationDeadline: new Date('2025-12-31'),
    status: 'active',
    websiteUrl: 'https://developers.google.com/community/gdsc-solution-challenge',
    registerUrl: 'https://developers.google.com/community/gdsc-solution-challenge/get-started',
    rulesUrl: 'https://developers.google.com/community/gdsc-solution-challenge/rules',
    organizer: 'Google Developers',
    venue: 'Online (Global)',
    type: 'online',
    totalPrize: '₹5,00,000 equivalent',
    rules: [
      'Team of 1-4 members from same university',
      'Must use at least one Google technology',
      'Solve one or more UN SDG goals',
      'Submit video demo and GitHub repo',
      'Open to GDSC members worldwide'
    ],
    judgingCriteria: [
      { criterion: 'Impact on Society', weight: 30 },
      { criterion: 'Use of Google Tech', weight: 25 },
      { criterion: 'Innovation', weight: 20 },
      { criterion: 'Execution', weight: 15 },
      { criterion: 'Presentation', weight: 10 }
    ],
    prizes: [
      { position: 1, title: 'Top 10 Global Finalists', amount: 250000, benefits: ['Google Swag', 'Mentorship', 'Global Recognition'] },
      { position: 2, title: 'Top 100 Teams', amount: 125000, benefits: ['Google Cloud Credits', 'Certificate'] },
      { position: 3, title: 'Regional Winners', amount: 75000, benefits: ['Certificate', 'Swag'] }
    ],
    technologies: ['Google Cloud', 'Firebase', 'TensorFlow', 'Flutter', 'Android'],
    tracks: ['Climate Action', 'Quality Education', 'Good Health', 'Sustainable Cities', 'No Poverty'],
    mentorsAvailable: true,
    requiresSubmission: true
  },
  {
    title: 'Microsoft Imagine Cup 2025',
    description: '🌐 REAL HACKATHON: The world\'s premier student technology competition! Win $100,000 and meet Satya Nadella!',
    theme: 'Technology for Good',
    difficulty: 'Advanced',
    duration: 4320,
    maxTeamSize: 4,
    startDate: new Date('2025-09-01'),
    endDate: new Date('2026-03-01'),
    registrationDeadline: new Date('2026-01-31'),
    status: 'active',
    websiteUrl: 'https://imaginecup.microsoft.com/',
    registerUrl: 'https://imaginecup.microsoft.com/en-us/register',
    rulesUrl: 'https://imaginecup.microsoft.com/en-us/Rules',
    organizer: 'Microsoft Corporation',
    venue: 'Online (World Finals at Microsoft HQ, Seattle)',
    type: 'hybrid',
    totalPrize: '₹1,40,00,000 equivalent ($100k + Azure credits)',
    rules: [
      'Team of 1-4 students (16+ years old)',
      'Must be actively enrolled in academic institution',
      'Use Microsoft Azure in your solution',
      'Compete in regional rounds first',
      'Build technology that solves real-world problems'
    ],
    judgingCriteria: [
      { criterion: 'Innovation', weight: 30 },
      { criterion: 'Impact', weight: 25 },
      { criterion: 'Technology', weight: 20 },
      { criterion: 'Execution', weight: 15 },
      { criterion: 'Presentation', weight: 10 }
    ],
    prizes: [
      { position: 1, title: 'World Champion', amount: 7000000, benefits: ['$100k Cash', '$50k Azure Credits', 'Mentorship with Microsoft Executives', 'World Recognition'] },
      { position: 2, title: 'Runner Up', amount: 1750000, benefits: ['$25k Cash', 'Azure Credits', 'Certificate'] },
      { position: 3, title: 'Finalist', amount: 700000, benefits: ['$10k Cash', 'Azure Credits', 'Trip to Seattle'] }
    ],
    technologies: ['Microsoft Azure', 'AI/ML', 'Power Platform', '.NET', 'GitHub'],
    tracks: ['Earth', 'Education', 'Health', 'Lifestyle'],
    mentorsAvailable: true,
    requiresSubmission: true
  }
];

const seedAll = async () => {
  try {
    console.log('🚀 Starting comprehensive seed process...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // === SEED INTERNSHIPS (Both Dummy + Real) ===
    console.log('📝 Seeding internships...');
    await Internship.deleteMany({});
    
    const allInternships = [...dummyInternships, ...realInternships];
    const internships = await Internship.insertMany(allInternships);
    
    console.log(`✅ Seeded ${internships.length} internships`);
    console.log(`   - ${dummyInternships.length} simulation internships`);
    console.log(`   - ${realInternships.length} real-world internships with external links`);

    const internshipDomains = {};
    internships.forEach(i => {
      internshipDomains[i.domain] = (internshipDomains[i.domain] || 0) + 1;
    });
    console.log('   By domain:', internshipDomains);

    // === SEED HACKATHONS (Both Dummy + Real) ===
    console.log('\n🏆 Seeding hackathons...');
    await HackathonChallenge.deleteMany({});
    
    const allHackathons = [...dummyHackathons, ...realHackathons];
    const hackathons = await HackathonChallenge.insertMany(allHackathons);
    
    console.log(`✅ Seeded ${hackathons.length} hackathons`);
    console.log(`   - ${dummyHackathons.length} simulation hackathons`);
    console.log(`   - ${realHackathons.length} real-world hackathons with registration links`);

    const hackathonStatuses = {};
    hackathons.forEach(h => {
      hackathonStatuses[h.status] = (hackathonStatuses[h.status] || 0) + 1;
    });
    console.log('   By status:', hackathonStatuses);

    const totalPrize = hackathons.reduce((sum, h) => 
      sum + h.prizes.reduce((s, p) => s + p.amount, 0), 0
    );
    console.log('   Total prize money: ₹' + totalPrize.toLocaleString());

    console.log('\n🎉 All seed data has been successfully created!');
    console.log('\n📊 Summary:');
    console.log(`   - ${internships.length} total internships (${dummyInternships.length} simulation + ${realInternships.length} real)`);
    console.log(`   - ${hackathons.length} total hackathons (${dummyHackathons.length} simulation + ${realHackathons.length} real)`);
    console.log(`   - ${internships.filter(i => i.applyUrl).length} internships have external application links`);
    console.log(`   - ${hackathons.filter(h => h.registerUrl).length} hackathons have registration links`);
    console.log(`   - ${hackathons.filter(h => h.status === 'active').length} active hackathons right now`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();
