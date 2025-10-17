import mongoose from 'mongoose';
import Course from './models/Course.js';
import Teacher from './models/Teacher.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/connectbook');
    console.log('✅ Connected to MongoDB\n');
    
    // Step 1: Check for teachers
    const teachers = await Teacher.find();
    console.log(`📚 Found ${teachers.length} teacher(s) in database`);
    
    if (teachers.length === 0) {
      console.log('\n❌ ERROR: No teachers found in database!');
      console.log('Please create a teacher account first by:');
      console.log('1. Go to http://localhost:5173/register');
      console.log('2. Register as a Teacher');
      console.log('3. Then run this script again\n');
      process.exit(1);
    }
    
    const teacher = teachers[0];
    console.log(`   Using teacher: ${teacher.name} (${teacher.email})\n`);
    
    // Step 2: Check existing courses
    const existingCourses = await Course.find();
    console.log(`📘 Found ${existingCourses.length} existing course(s) in database`);
    
    if (existingCourses.length > 0) {
      console.log('\nExisting courses:');
      existingCourses.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.title} - ${c.published ? '✅ Published' : '❌ Draft'}`);
      });
      
      const answer = await question('\n⚠️  Delete existing courses? (yes/no): ');
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        await Course.deleteMany({});
        console.log('✅ Deleted all existing courses\n');
      }
    }
    
    // Step 3: Create courses
    console.log('📝 Creating 25 dummy courses...\n');
    
    const dummyCourses = [
      {
        title: 'Complete Python Programming',
        description: 'Master Python from basics to advanced. Learn data structures, OOP, Django, and ML.',
        category: 'Programming',
        level: 'Beginner',
        estimatedDuration: 40,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Intro to Python', url: 'https://youtu.be/rfscVS0vtbw', duration: 600 },
          { title: 'Variables & Types', url: 'https://youtu.be/rfscVS0vtbw', duration: 900 },
          { title: 'Control Flow', url: 'https://youtu.be/rfscVS0vtbw', duration: 720 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Java Programming Masterclass',
        description: 'Complete Java course: Core Java, Spring Framework, Hibernate, real-world projects.',
        category: 'Programming',
        level: 'Intermediate',
        estimatedDuration: 50,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Java Basics', url: 'https://youtu.be/eIrMbAQSU34', duration: 720 },
          { title: 'OOP in Java', url: 'https://youtu.be/eIrMbAQSU34', duration: 960 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Full Stack MERN Development',
        description: 'Build web apps with MongoDB, Express, React, Node.js. REST APIs, auth, deployment.',
        category: 'Web Development',
        level: 'Intermediate',
        estimatedDuration: 60,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'MERN Stack Intro', url: 'https://youtu.be/fnpmR6Q5lEc', duration: 600 },
          { title: 'Node & Express', url: 'https://youtu.be/fnpmR6Q5lEc', duration: 840 },
          { title: 'MongoDB Basics', url: 'https://youtu.be/fnpmR6Q5lEc', duration: 960 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'React.js Complete Guide',
        description: 'Master React with Hooks, Context API, Redux, Router. Build production apps.',
        category: 'Web Development',
        level: 'Intermediate',
        estimatedDuration: 45,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'React Fundamentals', url: 'https://youtu.be/bMknfKXIFA8', duration: 900 },
          { title: 'React Hooks', url: 'https://youtu.be/bMknfKXIFA8', duration: 1080 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Data Science with Python',
        description: 'Learn data analysis with NumPy, Pandas, Matplotlib, Scikit-learn.',
        category: 'Data Science',
        level: 'Intermediate',
        estimatedDuration: 55,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'NumPy Basics', url: 'https://youtu.be/QUT1VHiLmmI', duration: 840 },
          { title: 'Pandas DataFrames', url: 'https://youtu.be/QUT1VHiLmmI', duration: 960 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Machine Learning A-Z',
        description: 'Complete ML course: supervised, unsupervised learning, neural networks, deep learning.',
        category: 'Machine Learning',
        level: 'Advanced',
        estimatedDuration: 70,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'ML Introduction', url: 'https://youtu.be/GwIo3gDZCVQ', duration: 600 },
          { title: 'Linear Regression', url: 'https://youtu.be/GwIo3gDZCVQ', duration: 1080 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Android Development with Kotlin',
        description: 'Build Android apps with Kotlin, Material Design, architecture components.',
        category: 'Mobile Development',
        level: 'Intermediate',
        estimatedDuration: 50,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Kotlin for Android', url: 'https://youtu.be/F9UC9DY-vIU', duration: 840 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'iOS Development with Swift',
        description: 'Create iOS apps with Swift, UIKit, SwiftUI. App Store deployment.',
        category: 'Mobile Development',
        level: 'Intermediate',
        estimatedDuration: 55,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Swift Basics', url: 'https://youtu.be/comQ1-x2a1Q', duration: 900 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Deep Learning with TensorFlow',
        description: 'Master deep learning: CNNs, RNNs, GANs, state-of-the-art architectures.',
        category: 'Artificial Intelligence',
        level: 'Advanced',
        estimatedDuration: 80,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Neural Networks', url: 'https://youtu.be/aircAruvnKk', duration: 1200 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'MongoDB Complete Guide',
        description: 'Master MongoDB: CRUD, aggregation, indexing, replication, sharding.',
        category: 'Database',
        level: 'Intermediate',
        estimatedDuration: 30,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'MongoDB Basics', url: 'https://youtu.be/-56x56UppqQ', duration: 600 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'SQL for Data Analysis',
        description: 'Learn SQL: joins, subqueries, window functions, query optimization.',
        category: 'Database',
        level: 'Beginner',
        estimatedDuration: 25,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'SQL Basics', url: 'https://youtu.be/HXV3zeQKqGY', duration: 540 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'AWS Cloud Essentials',
        description: 'AWS services: EC2, S3, RDS, Lambda, cloud architecture best practices.',
        category: 'Cloud Computing',
        level: 'Beginner',
        estimatedDuration: 35,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'AWS Introduction', url: 'https://youtu.be/ubCNZRNjhyo', duration: 600 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Docker & Kubernetes',
        description: 'Containerization with Docker, orchestration with Kubernetes, CI/CD pipelines.',
        category: 'DevOps',
        level: 'Advanced',
        estimatedDuration: 50,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Docker Basics', url: 'https://youtu.be/fqMOX6JJhGo', duration: 900 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Ethical Hacking Basics',
        description: 'Learn ethical hacking, penetration testing, cybersecurity best practices.',
        category: 'Cybersecurity',
        level: 'Advanced',
        estimatedDuration: 60,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Intro to Hacking', url: 'https://youtu.be/3Kq1MIfTWCE', duration: 720 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Computer Networking',
        description: 'OSI model, TCP/IP, routing, switching, network troubleshooting.',
        category: 'Networking',
        level: 'Intermediate',
        estimatedDuration: 45,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'OSI Model', url: 'https://youtu.be/vv4y_uOneC0', duration: 840 }
        ],
        resources: [],
        quizzes: []
      },
      // Add 10 more courses to reach 25
      {
        title: 'HTML5 & CSS3 Mastery',
        description: 'Modern web design: HTML5, CSS3, Flexbox, Grid, responsive design.',
        category: 'Web Development',
        level: 'Beginner',
        estimatedDuration: 20,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'HTML5 Basics', url: 'https://youtu.be/qz0aGYrrlhU', duration: 480 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'C++ Competitive Programming',
        description: 'C++ for algorithms, data structures, problem-solving, interviews.',
        category: 'Programming',
        level: 'Advanced',
        estimatedDuration: 35,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'STL Library', url: 'https://youtu.be/RRVYpIET_RU', duration: 900 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'React Native Apps',
        description: 'Build iOS and Android apps with React Native, navigation, state management.',
        category: 'Mobile Development',
        level: 'Intermediate',
        estimatedDuration: 40,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'React Native Setup', url: 'https://youtu.be/0-S5a0eXPoc', duration: 600 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Natural Language Processing',
        description: 'NLP with Python: text preprocessing, sentiment analysis, transformers.',
        category: 'Artificial Intelligence',
        level: 'Advanced',
        estimatedDuration: 45,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Text Preprocessing', url: 'https://youtu.be/fNxaJsNG3-s', duration: 720 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Microsoft Azure Fundamentals',
        description: 'Azure cloud: virtual machines, app services, databases, Azure DevOps.',
        category: 'Cloud Computing',
        level: 'Beginner',
        estimatedDuration: 30,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Azure Overview', url: 'https://youtu.be/NKEFWyqJ5XA', duration: 540 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'CI/CD with Jenkins',
        description: 'Continuous integration/deployment: Jenkins, GitLab CI, automated testing.',
        category: 'DevOps',
        level: 'Intermediate',
        estimatedDuration: 35,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'CI/CD Basics', url: 'https://youtu.be/scEDHsr3APg', duration: 600 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Network Security',
        description: 'Network security concepts, firewalls, VPNs, intrusion detection.',
        category: 'Cybersecurity',
        level: 'Intermediate',
        estimatedDuration: 40,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Security Basics', url: 'https://youtu.be/qiQR5rTSshw', duration: 600 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'JavaScript ES6+ Complete',
        description: 'Modern JavaScript: ES6+, async/await, promises, modules, best practices.',
        category: 'Web Development',
        level: 'Intermediate',
        estimatedDuration: 30,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'ES6 Features', url: 'https://youtu.be/NCwa_xi0Uuc', duration: 800 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Git & GitHub Mastery',
        description: 'Version control with Git, GitHub workflows, collaboration, branching.',
        category: 'DevOps',
        level: 'Beginner',
        estimatedDuration: 15,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Git Basics', url: 'https://youtu.be/RGOj5yH7evk', duration: 600 }
        ],
        resources: [],
        quizzes: []
      },
      {
        title: 'Blockchain Development',
        description: 'Learn blockchain, Ethereum, Solidity, smart contracts, DApps.',
        category: 'Other',
        level: 'Advanced',
        estimatedDuration: 50,
        published: true,
        teacherId: teacher._id,
        teacherName: teacher.name,
        videos: [
          { title: 'Blockchain Intro', url: 'https://youtu.be/qOVAbKKSH10', duration: 900 }
        ],
        resources: [],
        quizzes: []
      }
    ];
    
    const insertedCourses = await Course.insertMany(dummyCourses);
    console.log(`✅ Successfully created ${insertedCourses.length} courses!\n`);
    
    // Step 4: Verify
    const allCourses = await Course.find();
    const published = allCourses.filter(c => c.published).length;
    
    console.log('📊 Summary:');
    console.log(`   Total courses: ${allCourses.length}`);
    console.log(`   Published: ${published}`);
    console.log(`   Unpublished: ${allCourses.length - published}`);
    
    console.log('\n📚 Courses by category:');
    const categories = {};
    allCourses.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
    
    console.log('\n✅ All done! Courses are ready to use.');
    console.log('🎓 Students can now browse and enroll in courses!\n');
    
    rl.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    rl.close();
    process.exit(1);
  }
}

main();
