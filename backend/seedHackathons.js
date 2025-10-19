import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import HackathonChallenge from './models/HackathonChallenge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const hackathonsData = [
  {
    title: 'AI Innovation Challenge 2024',
    theme: 'Build AI-powered solutions for real-world problems',
    domain: 'Artificial Intelligence',
    difficulty: 'Advanced',
    description: 'Create innovative AI applications that solve pressing problems in healthcare, education, or sustainability. Use machine learning, NLP, computer vision, or any AI technology to build impactful solutions.',
    duration: 48,
    type: 'team',
    maxTeamSize: 4,
    startDate: new Date('2024-03-15T09:00:00Z'),
    endDate: new Date('2024-03-17T09:00:00Z'),
    status: 'upcoming',
    rules: [
      'Teams must consist of 2-4 members',
      'All code must be original work',
      'Open source libraries and APIs are allowed',
      'Final submission must include demo video',
      'Projects must be deployable and functional'
    ],
    evaluationCriteria: [
      { criteria: 'Innovation & Creativity', weight: 25 },
      { criteria: 'Technical Implementation', weight: 25 },
      { criteria: 'Real-world Impact', weight: 20 },
      { criteria: 'UI/UX Design', weight: 15 },
      { criteria: 'Presentation & Demo', weight: 15 }
    ],
    prizes: [
      { position: 1, amount: 50000, description: 'First Prize + Internship Opportunities' },
      { position: 2, amount: 30000, description: 'Second Prize + Mentorship Program' },
      { position: 3, amount: 20000, description: 'Third Prize + Tech Swag' }
    ],
    registrationDeadline: new Date('2024-03-10T23:59:59Z'),
    maxParticipants: 200,
    isActive: true
  },
  {
    title: 'Web3 DApp Marathon',
    theme: 'Build decentralized applications on blockchain',
    domain: 'Blockchain',
    difficulty: 'Advanced',
    description: 'Create decentralized applications using blockchain technology. Build on Ethereum, Polygon, or other EVM-compatible chains. Focus on DeFi, NFTs, DAOs, or Web3 social platforms.',
    duration: 36,
    type: 'team',
    maxTeamSize: 4,
    startDate: new Date('2024-02-20T10:00:00Z'),
    endDate: new Date('2024-02-21T22:00:00Z'),
    status: 'active',
    rules: [
      'Use any blockchain platform (Ethereum, Polygon, Solana, etc.)',
      'Smart contracts must be deployed on testnet',
      'Provide clear documentation',
      'Demo must show live interaction with blockchain',
      'Security best practices must be followed'
    ],
    evaluationCriteria: [
      { criteria: 'Smart Contract Quality', weight: 30 },
      { criteria: 'Innovation', weight: 25 },
      { criteria: 'User Experience', weight: 20 },
      { criteria: 'Security', weight: 15 },
      { criteria: 'Presentation', weight: 10 }
    ],
    prizes: [
      { position: 1, amount: 75000, description: 'First Prize + Crypto Bonus' },
      { position: 2, amount: 45000, description: 'Second Prize + NFT Collection' },
      { position: 3, amount: 25000, description: 'Third Prize + Web3 Course Access' }
    ],
    registrationDeadline: new Date('2024-02-15T23:59:59Z'),
    maxParticipants: 150,
    totalParticipants: 98,
    totalTeams: 26,
    isActive: true
  },
  {
    title: 'Cloud Solutions Hackathon',
    theme: 'Build scalable cloud-native applications',
    domain: 'Cloud Computing',
    difficulty: 'Intermediate',
    description: 'Design and deploy cloud-native applications using AWS, Azure, or Google Cloud. Focus on microservices, serverless architecture, and container orchestration.',
    duration: 24,
    type: 'team',
    maxTeamSize: 3,
    startDate: new Date('2024-04-01T08:00:00Z'),
    endDate: new Date('2024-04-02T08:00:00Z'),
    status: 'upcoming',
    rules: [
      'Deploy on any major cloud platform',
      'Use Infrastructure as Code (Terraform, CloudFormation)',
      'Implement CI/CD pipeline',
      'Monitor with cloud-native tools',
      'Document architecture and deployment'
    ],
    evaluationCriteria: [
      { criteria: 'Scalability', weight: 30 },
      { criteria: 'Code Quality', weight: 25 },
      { criteria: 'Cloud-native Features', weight: 20 },
      { criteria: 'Cost Optimization', weight: 15 },
      { criteria: 'Documentation', weight: 10 }
    ],
    prizes: [
      { position: 1, amount: 40000, description: 'First Prize + Cloud Credits' },
      { position: 2, amount: 25000, description: 'Second Prize + Certifications' },
      { position: 3, amount: 15000, description: 'Third Prize + Learning Resources' }
    ],
    registrationDeadline: new Date('2024-03-25T23:59:59Z'),
    maxParticipants: 120,
    isActive: true
  },
  {
    title: 'Mobile App Marathon',
    theme: 'Create innovative mobile applications',
    domain: 'Mobile Development',
    difficulty: 'Intermediate',
    description: 'Build cross-platform mobile apps using React Native, Flutter, or native technologies. Focus on user experience, performance, and innovative features.',
    duration: 48,
    type: 'team',
    maxTeamSize: 4,
    startDate: new Date('2024-05-10T09:00:00Z'),
    endDate: new Date('2024-05-12T09:00:00Z'),
    status: 'upcoming',
    rules: [
      'Apps must run on iOS and/or Android',
      'Use any mobile development framework',
      'Include offline functionality',
      'Submit to TestFlight or Google Play Beta',
      'Provide APK/IPA for testing'
    ],
    evaluationCriteria: [
      { criteria: 'User Experience', weight: 30 },
      { criteria: 'Innovation', weight: 25 },
      { criteria: 'Performance', weight: 20 },
      { criteria: 'Code Quality', weight: 15 },
      { criteria: 'Design', weight: 10 }
    ],
    prizes: [
      { position: 1, amount: 60000, description: 'First Prize + App Store Publishing' },
      { position: 2, amount: 35000, description: 'Second Prize + Device Package' },
      { position: 3, amount: 20000, description: 'Third Prize + Development Tools' }
    ],
    registrationDeadline: new Date('2024-05-05T23:59:59Z'),
    maxParticipants: 180,
    isActive: true
  },
  {
    title: 'Cybersecurity CTF Challenge',
    theme: 'Capture the Flag security competition',
    domain: 'Cybersecurity',
    difficulty: 'Advanced',
    description: 'Test your hacking skills in this Capture the Flag competition. Solve challenges in cryptography, web exploitation, reverse engineering, forensics, and more.',
    duration: 24,
    type: 'team',
    maxTeamSize: 3,
    startDate: new Date('2024-03-25T18:00:00Z'),
    endDate: new Date('2024-03-26T18:00:00Z'),
    status: 'upcoming',
    rules: [
      'No attacking the CTF infrastructure',
      'No sharing flags or solutions',
      'Automated tools allowed where specified',
      'Teams of 1-3 members',
      'First blood bonus points available'
    ],
    evaluationCriteria: [
      { criteria: 'Challenges Solved', weight: 60 },
      { criteria: 'Speed (First Blood)', weight: 20 },
      { criteria: 'Write-ups Quality', weight: 20 }
    ],
    prizes: [
      { position: 1, amount: 50000, description: 'First Prize + Security Toolkit' },
      { position: 2, amount: 30000, description: 'Second Prize + Training Vouchers' },
      { position: 3, amount: 15000, description: 'Third Prize + Bug Bounty Credits' }
    ],
    registrationDeadline: new Date('2024-03-20T23:59:59Z'),
    maxParticipants: 150,
    isActive: true
  },
  {
    title: 'Data Science Challenge',
    theme: 'Analyze data and build predictive models',
    domain: 'Data Science',
    difficulty: 'Intermediate',
    description: 'Work with real-world datasets to extract insights and build machine learning models. Compete on accuracy, creativity, and presentation of results.',
    duration: 72,
    type: 'team',
    maxTeamSize: 3,
    startDate: new Date('2024-01-15T00:00:00Z'),
    endDate: new Date('2024-01-18T00:00:00Z'),
    status: 'completed',
    rules: [
      'Use provided datasets only',
      'Any ML/DL framework allowed',
      'Submit Jupyter notebooks with explanations',
      'Model must be reproducible',
      'Evaluation on hold-out test set'
    ],
    evaluationCriteria: [
      { criteria: 'Model Accuracy', weight: 40 },
      { criteria: 'Feature Engineering', weight: 25 },
      { criteria: 'Code Quality', weight: 20 },
      { criteria: 'Documentation', weight: 15 }
    ],
    prizes: [
      { position: 1, amount: 45000, description: 'First Prize + Kaggle Credits' },
      { position: 2, amount: 28000, description: 'Second Prize + GPU Cloud Credits' },
      { position: 3, amount: 17000, description: 'Third Prize + Course Subscriptions' }
    ],
    registrationDeadline: new Date('2024-01-10T23:59:59Z'),
    maxParticipants: 200,
    totalParticipants: 187,
    totalTeams: 65,
    isActive: false
  },
  {
    title: 'Game Dev Jam',
    theme: 'Create an engaging video game in 48 hours',
    domain: 'Game Development',
    difficulty: 'Intermediate',
    description: 'Build a complete game from scratch. Use Unity, Unreal Engine, Godot, or any game engine. Theme will be revealed at the start.',
    duration: 48,
    type: 'team',
    maxTeamSize: 5,
    startDate: new Date('2024-06-01T09:00:00Z'),
    endDate: new Date('2024-06-03T09:00:00Z'),
    status: 'upcoming',
    rules: [
      'Theme revealed at start time',
      'All assets must be created during hackathon (or use free assets)',
      'Game must be playable',
      'Submit game build and source code',
      'Include gameplay video'
    ],
    evaluationCriteria: [
      { criteria: 'Gameplay & Fun', weight: 30 },
      { criteria: 'Theme Interpretation', weight: 25 },
      { criteria: 'Graphics & Audio', weight: 20 },
      { criteria: 'Innovation', weight: 15 },
      { criteria: 'Polish', weight: 10 }
    ],
    prizes: [
      { position: 1, amount: 55000, description: 'First Prize + Game Engine License' },
      { position: 2, amount: 32000, description: 'Second Prize + Asset Store Credits' },
      { position: 3, amount: 18000, description: 'Third Prize + Gaming Hardware' }
    ],
    registrationDeadline: new Date('2024-05-25T23:59:59Z'),
    maxParticipants: 150,
    isActive: true
  },
  {
    title: 'IoT Innovation Sprint',
    theme: 'Build smart IoT solutions',
    domain: 'IoT & Hardware',
    difficulty: 'Advanced',
    description: 'Create IoT devices and applications for smart homes, cities, or industries. Combine hardware, sensors, and software to build connected solutions.',
    duration: 60,
    type: 'team',
    maxTeamSize: 4,
    startDate: new Date('2024-07-15T08:00:00Z'),
    endDate: new Date('2024-07-17T20:00:00Z'),
    status: 'upcoming',
    rules: [
      'Use any IoT platform (Arduino, Raspberry Pi, ESP32, etc.)',
      'Must include physical hardware component',
      'Data visualization dashboard required',
      'Cloud integration encouraged',
      'Demonstrate working prototype'
    ],
    evaluationCriteria: [
      { criteria: 'Hardware Design', weight: 25 },
      { criteria: 'Software Integration', weight: 25 },
      { criteria: 'Innovation', weight: 25 },
      { criteria: 'Real-world Applicability', weight: 15 },
      { criteria: 'Presentation', weight: 10 }
    ],
    prizes: [
      { position: 1, amount: 65000, description: 'First Prize + IoT Starter Kits' },
      { position: 2, amount: 38000, description: 'Second Prize + Sensor Packages' },
      { position: 3, amount: 22000, description: 'Third Prize + Development Boards' }
    ],
    registrationDeadline: new Date('2024-07-08T23:59:59Z'),
    maxParticipants: 100,
    isActive: true
  }
];

const seedHackathons = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing hackathons (optional)
    await HackathonChallenge.deleteMany({});
    console.log('🗑️  Cleared existing hackathons');

    // Insert new hackathons
    const result = await HackathonChallenge.insertMany(hackathonsData);
    console.log(`✅ Successfully seeded ${result.length} hackathons!`);

    console.log('\n📊 Hackathons by status:');
    const statuses = {};
    result.forEach(hackathon => {
      statuses[hackathon.status] = (statuses[hackathon.status] || 0) + 1;
    });
    Object.entries(statuses).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    console.log('\n🏆 Total prize money: ₹' + 
      result.reduce((sum, h) => sum + h.prizes.reduce((s, p) => s + p.amount, 0), 0).toLocaleString()
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hackathons:', error);
    process.exit(1);
  }
};

seedHackathons();
