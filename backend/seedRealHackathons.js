import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import HackathonChallenge from './models/HackathonChallenge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Real-world hackathons with actual website links
const hackathonsData = [
  {
    title: 'Smart India Hackathon 2025',
    theme: 'Building Digital India',
    domain: 'Artificial Intelligence',
    description: 'Smart India Hackathon is the world\'s biggest open innovation model for solving challenges faced by various Government departments and industries. SIH 2025 brings together students from across India to solve real-world problems.',
    problemStatement: 'Develop AI-powered solutions for one of 50+ problem statements from Government ministries including Education, Healthcare, Agriculture, Defense, and Smart Cities.',
    difficulty: 'Intermediate',
    duration: 36, // hours
    startDate: new Date('2025-08-15'),
    endDate: new Date('2025-08-30'),
    registrationDeadline: new Date('2025-07-31'),
    status: 'upcoming',
    maxTeamSize: 6,
    minTeamSize: 3,
    prizes: {
      first: '₹1,00,000',
      second: '₹75,000',
      third: '₹50,000'
    },
    totalPrize: '₹2,25,000',
    requirements: [
      'Team of 3-6 students',
      'All team members must be college students',
      'Working prototype required',
      'Presentation to jury panel'
    ],
    judgingCriteria: [
      'Innovation and Creativity (25%)',
      'Technical Implementation (25%)',
      'Impact and Scalability (25%)',
      'Presentation Quality (25%)'
    ],
    isActive: true,
    websiteUrl: 'https://www.sih.gov.in/',
    registerUrl: 'https://www.sih.gov.in/sih2024PS',
    rulesUrl: 'https://www.sih.gov.in/sih2024guidelines',
    organizer: 'Ministry of Education, Govt. of India',
    venue: 'Various Nodal Centers Across India',
    type: 'hybrid'
  },
  {
    title: 'HackWithInfy 2025',
    theme: 'Code Your Future',
    domain: 'Full Stack Development',
    description: 'Infosys\' flagship hackathon for engineering students across India. Top performers get pre-placement offers (PPO) and internship opportunities at Infosys.',
    problemStatement: 'Build innovative solutions across various themes including Cloud Computing, AI/ML, Blockchain, IoT, and Web Development. Compete through 3 rounds: Online Coding, Hackathon Finale, and Interview.',
    difficulty: 'Intermediate',
    duration: 48,
    startDate: new Date('2025-09-01'),
    endDate: new Date('2025-10-31'),
    registrationDeadline: new Date('2025-08-15'),
    status: 'upcoming',
    maxTeamSize: 3,
    minTeamSize: 1,
    prizes: {
      first: '₹2,00,000',
      second: '₹1,50,000',
      third: '₹1,00,000'
    },
    totalPrize: '₹4,50,000',
    requirements: [
      'Solo or team of up to 3',
      'BE/B.Tech students (2024/2025/2026 graduates)',
      'Strong coding and problem-solving skills',
      'No backlogs at time of registration'
    ],
    judgingCriteria: [
      'Code Quality and Efficiency (30%)',
      'Innovation (25%)',
      'Functionality (25%)',
      'Scalability (20%)'
    ],
    isActive: true,
    websiteUrl: 'https://www.hackerearth.com/challenges/competitive/infosys-hackwithinfy/',
    registerUrl: 'https://www.hackerearth.com/challenges/competitive/infosys-hackwithinfy/',
    rulesUrl: 'https://www.infosys.com/careers/hackwithinfy.html',
    organizer: 'Infosys Limited',
    venue: 'Online + Onsite Finale in Bangalore/Mysore',
    type: 'hybrid'
  },
  {
    title: 'Google Solution Challenge 2025',
    theme: 'Solve for UN SDGs',
    domain: 'Social Impact Tech',
    description: 'A global hackathon by Google Developer Student Clubs (GDSC) where students build solutions addressing one or more of the 17 United Nations Sustainable Development Goals.',
    problemStatement: 'Create a web or mobile application that addresses real-world problems aligned with UN SDGs using Google technologies like Firebase, Google Cloud, Flutter, TensorFlow, or Android.',
    difficulty: 'Intermediate',
    duration: 120, // 5-day sprint
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-03-31'),
    registrationDeadline: new Date('2025-03-15'),
    status: 'active',
    maxTeamSize: 4,
    minTeamSize: 1,
    prizes: {
      first: '$3,000 + Mentorship',
      second: '$2,000 + Mentorship',
      third: '$1,000 + Mentorship'
    },
    totalPrize: '₹5,00,000 equivalent',
    requirements: [
      'Current university student',
      'GDSC member (preferred)',
      'Must use at least one Google technology',
      'Open source project on GitHub'
    ],
    judgingCriteria: [
      'Impact (30%)',
      'Technology (25%)',
      'Design (20%)',
      'Sustainability (25%)'
    ],
    isActive: true,
    websiteUrl: 'https://developers.google.com/community/gdsc-solution-challenge',
    registerUrl: 'https://developers.google.com/community/gdsc-solution-challenge/get-started',
    rulesUrl: 'https://developers.google.com/community/gdsc-solution-challenge/rules',
    organizer: 'Google for Developers',
    venue: 'Global (Online)',
    type: 'online'
  },
  {
    title: 'Microsoft Imagine Cup 2025',
    theme: 'Innovate for Good',
    domain: 'Cloud Computing',
    description: 'Microsoft\'s premier global competition for student developers. Build projects using Azure, AI, and Microsoft technologies to solve world challenges.',
    problemStatement: 'Develop innovative solutions that make a positive impact on the world using Microsoft Azure, AI services, Power Platform, or Microsoft 365.',
    difficulty: 'Advanced',
    duration: 72,
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-11-30'),
    registrationDeadline: new Date('2025-09-15'),
    status: 'upcoming',
    maxTeamSize: 4,
    minTeamSize: 1,
    prizes: {
      first: '$100,000',
      second: '$50,000',
      third: '$25,000'
    },
    totalPrize: '₹1,40,00,000 equivalent',
    requirements: [
      'Age 16+ and enrolled student',
      'Use Microsoft technologies',
      'Working prototype required',
      'Business plan and pitch deck'
    ],
    judgingCriteria: [
      'Innovation (25%)',
      'Impact (25%)',
      'Technical Execution (25%)',
      'Business Potential (25%)'
    ],
    isActive: true,
    websiteUrl: 'https://imaginecup.microsoft.com/',
    registerUrl: 'https://imaginecup.microsoft.com/en-us/Events',
    rulesUrl: 'https://imaginecup.microsoft.com/en-us/rules',
    organizer: 'Microsoft Corporation',
    venue: 'Global Finals in Seattle, USA',
    type: 'hybrid'
  },
  {
    title: 'Meta Hacker Cup 2025',
    theme: 'Competitive Programming',
    domain: 'Algorithms',
    description: 'Meta\'s annual global programming competition. Test your coding skills against the best programmers worldwide in algorithmic challenges.',
    problemStatement: 'Solve complex algorithmic problems across multiple rounds: Qualification, Round 1, Round 2, Round 3, and Finals. Problems cover data structures, algorithms, math, and optimization.',
    difficulty: 'Advanced',
    duration: 24, // per round
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-10-15'),
    registrationDeadline: new Date('2025-07-25'),
    status: 'upcoming',
    maxTeamSize: 1,
    minTeamSize: 1,
    prizes: {
      first: '$20,000',
      second: '$10,000',
      third: '$5,000'
    },
    totalPrize: '₹29,00,000 equivalent',
    requirements: [
      'Individual participation only',
      'Strong algorithmic skills required',
      'Previous competitive programming experience',
      'C++, Java, or Python proficiency'
    ],
    judgingCriteria: [
      'Correctness of solution (50%)',
      'Time complexity (30%)',
      'Space complexity (20%)'
    ],
    isActive: true,
    websiteUrl: 'https://www.facebook.com/codingcompetitions/hacker-cup',
    registerUrl: 'https://www.facebook.com/codingcompetitions/hacker-cup',
    rulesUrl: 'https://www.facebook.com/codingcompetitions/hacker-cup/rules',
    organizer: 'Meta Platforms Inc',
    venue: 'Online + Finals at Meta HQ',
    type: 'hybrid'
  },
  {
    title: 'GitHub Global Campus Hackathon',
    theme: 'Open Source Innovation',
    domain: 'Open Source',
    description: 'A month-long virtual hackathon celebrating open-source development. Build or contribute to open-source projects on GitHub.',
    problemStatement: 'Create a new open-source project or contribute significantly to existing ones. Categories include Developer Tools, Education, Social Good, and Gaming.',
    difficulty: 'Beginner',
    duration: 720, // 30 days
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-10-31'),
    registrationDeadline: new Date('2025-09-25'),
    status: 'upcoming',
    maxTeamSize: 5,
    minTeamSize: 1,
    prizes: {
      first: '$5,000',
      second: '$3,000',
      third: '$2,000'
    },
    totalPrize: '₹8,30,000 equivalent',
    requirements: [
      'GitHub Global Campus student',
      'Project must be open-source',
      'Meaningful contributions required',
      'Good documentation'
    ],
    judgingCriteria: [
      'Quality of Code (30%)',
      'Documentation (20%)',
      'Community Impact (30%)',
      'Originality (20%)'
    ],
    isActive: true,
    websiteUrl: 'https://education.github.com/students',
    registerUrl: 'https://education.github.com/pack',
    rulesUrl: 'https://education.github.com/globalcampus',
    organizer: 'GitHub Education',
    venue: 'Virtual (Global)',
    type: 'online'
  },
  {
    title: 'AWS DeepRacer Championship',
    theme: 'Autonomous Racing with ML',
    domain: 'Machine Learning',
    description: 'Build and train autonomous racing models using reinforcement learning. Compete virtually and potentially qualify for AWS re:Invent in Las Vegas.',
    problemStatement: 'Train a 1/18th scale race car using reinforcement learning to autonomously navigate racing tracks. Optimize for speed while avoiding penalties.',
    difficulty: 'Intermediate',
    duration: 168, // 7 days per league
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-11-30'),
    registrationDeadline: new Date('2025-02-15'),
    status: 'upcoming',
    maxTeamSize: 1,
    minTeamSize: 1,
    prizes: {
      first: 'Trip to AWS re:Invent + $3,000',
      second: '$2,000',
      third: '$1,000'
    },
    totalPrize: '₹5,00,000 equivalent',
    requirements: [
      'AWS account required',
      'Basic ML/RL knowledge',
      'Python programming',
      'Patience for training iterations'
    ],
    judgingCriteria: [
      'Lap Time (60%)',
      'Consistency (20%)',
      'Off-track Penalties (20%)'
    ],
    isActive: true,
    websiteUrl: 'https://aws.amazon.com/deepracer/league/',
    registerUrl: 'https://console.aws.amazon.com/deepracer',
    rulesUrl: 'https://aws.amazon.com/deepracer/league-rules/',
    organizer: 'Amazon Web Services',
    venue: 'Virtual + AWS re:Invent Finals',
    type: 'hybrid'
  },
  {
    title: 'HackerEarth Deep Learning Challenge',
    theme: 'AI for Healthcare',
    domain: 'Data Science',
    description: 'Monthly AI/ML competitions focusing on real-world problems. Compete with data scientists globally and win prizes + job opportunities.',
    problemStatement: 'Varies monthly - Recent challenges include Medical Image Classification, Drug Discovery, Fraud Detection, and Customer Churn Prediction.',
    difficulty: 'Advanced',
    duration: 480, // 20 days
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-20'),
    registrationDeadline: new Date('2025-10-28'),
    status: 'upcoming',
    maxTeamSize: 3,
    minTeamSize: 1,
    prizes: {
      first: '₹1,00,000',
      second: '₹60,000',
      third: '₹40,000'
    },
    totalPrize: '₹2,00,000',
    requirements: [
      'Machine learning expertise',
      'Python and ML frameworks',
      'Data analysis skills',
      'Model deployment knowledge'
    ],
    judgingCriteria: [
      'Model Accuracy (40%)',
      'Code Quality (20%)',
      'Documentation (20%)',
      'Innovation (20%)'
    ],
    isActive: true,
    websiteUrl: 'https://www.hackerearth.com/challenges/competitive/machine-learning/',
    registerUrl: 'https://www.hackerearth.com/challenges/',
    rulesUrl: 'https://www.hackerearth.com/challenge-rules/',
    organizer: 'HackerEarth',
    venue: 'Online',
    type: 'online'
  },
  {
    title: 'TCS CodeVita 2025',
    theme: 'Global Coding Competition',
    domain: 'Competitive Programming',
    description: 'TCS\' flagship coding competition attracting 300,000+ participants globally. Win cash prizes and fast-track interviews with TCS.',
    problemStatement: 'Solve algorithmic programming challenges across multiple rounds: Pre-Qualifier, Qualifier, and Grand Finale. Problems test logic, mathematics, and programming skills.',
    difficulty: 'Intermediate',
    duration: 6, // hours per round
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-10-31'),
    registrationDeadline: new Date('2025-07-20'),
    status: 'upcoming',
    maxTeamSize: 2,
    minTeamSize: 1,
    prizes: {
      first: '₹3,00,000',
      second: '₹2,00,000',
      third: '₹1,00,000'
    },
    totalPrize: '₹6,00,000',
    requirements: [
      'Engineering students (2025/2026 graduates)',
      'Solo or team of 2',
      'Any programming language',
      'No backlogs'
    ],
    judgingCriteria: [
      'Correctness (50%)',
      'Efficiency (30%)',
      'Code Elegance (20%)'
    ],
    isActive: true,
    websiteUrl: 'https://www.tcscodevita.com/',
    registerUrl: 'https://www.tcscodevita.com/register',
    rulesUrl: 'https://www.tcscodevita.com/rules',
    organizer: 'Tata Consultancy Services',
    venue: 'Online + Grand Finale in Mumbai',
    type: 'hybrid'
  },
  {
    title: 'Flipkart GRiD 5.0',
    theme: 'E-commerce Innovation',
    domain: 'Software Engineering',
    description: 'India\'s biggest engineering campus challenge by Flipkart. Solve real e-commerce problems and get pre-placement offers.',
    problemStatement: 'Build innovative solutions for challenges in categories like Software Development, Robotics & Automation, ML/AI, and Supply Chain. Top teams get PPOs.',
    difficulty: 'Intermediate',
    duration: 48,
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-09-30'),
    registrationDeadline: new Date('2025-06-15'),
    status: 'upcoming',
    maxTeamSize: 3,
    minTeamSize: 2,
    prizes: {
      first: '₹5,00,000 + PPO',
      second: '₹3,00,000 + PPO',
      third: '₹2,00,000 + Interview'
    },
    totalPrize: '₹10,00,000',
    requirements: [
      'Team of 2-3 engineering students',
      '2025/2026 graduates',
      'Strong technical and problem-solving skills',
      'Working prototype required'
    ],
    judgingCriteria: [
      'Innovation (25%)',
      'Technical Complexity (25%)',
      'Business Impact (25%)',
      'Scalability (25%)'
    ],
    isActive: true,
    websiteUrl: 'https://dare2compete.com/o/flipkart-grid-50',
    registerUrl: 'https://unstop.com/hackathons/flipkart-grid',
    rulesUrl: 'https://flipkartgrid.com/rules',
    organizer: 'Flipkart',
    venue: 'Bangalore (Grand Finale)',
    type: 'hybrid'
  }
];

const seedHackathons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing hackathons
    await HackathonChallenge.deleteMany({});
    console.log('🗑️  Cleared existing hackathons');

    // Insert new hackathons
    const result = await HackathonChallenge.insertMany(hackathonsData);
    console.log(`✅ Seeded ${result.length} real-world hackathons with registration links`);

    console.log('\n🏆 Hackathons seeded:');
    result.forEach((hackathon, index) => {
      console.log(`${index + 1}. ${hackathon.title}`);
      console.log(`   Prize: ${hackathon.totalPrize}`);
      console.log(`   Register: ${hackathon.registerUrl}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hackathons:', error);
    process.exit(1);
  }
};

seedHackathons();
