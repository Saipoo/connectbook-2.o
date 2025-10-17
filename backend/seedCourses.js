import mongoose from 'mongoose';
import Course from './models/Course.js';
import Teacher from './models/Teacher.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/connectbook')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const dummyCourses = [
  // Programming Courses
  {
    title: 'Complete Python Programming Bootcamp',
    description: 'Master Python from basics to advanced concepts. Learn data structures, OOP, web development with Django, data analysis, and machine learning fundamentals.',
    category: 'Programming',
    level: 'Beginner',
    estimatedDuration: 40,
    published: true,
    videos: [
      { title: 'Introduction to Python', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 600 },
      { title: 'Variables and Data Types', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 900 },
      { title: 'Control Flow - If/Else', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 720 },
      { title: 'Loops in Python', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 840 },
      { title: 'Functions and Modules', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 960 }
    ],
    resources: [
      { title: 'Python Cheat Sheet', type: 'pdf', url: 'uploads/courses/resources/python-cheatsheet.pdf' },
      { title: 'Practice Exercises', type: 'pdf', url: 'uploads/courses/resources/exercises.pdf' }
    ],
    quizzes: [
      {
        question: 'What is the output of print(type([]))?',
        type: 'multiple-choice',
        options: ['<class \'list\'>', '<class \'dict\'>', '<class \'tuple\'>', '<class \'set\'>'],
        correctAnswer: '<class \'list\'>'
      },
      {
        question: 'Which keyword is used to define a function in Python?',
        type: 'multiple-choice',
        options: ['function', 'def', 'define', 'func'],
        correctAnswer: 'def'
      }
    ]
  },
  {
    title: 'Java Programming Masterclass',
    description: 'Comprehensive Java course covering Core Java, Advanced Java, Spring Framework, Hibernate, and building real-world applications.',
    category: 'Programming',
    level: 'Intermediate',
    estimatedDuration: 50,
    published: true,
    videos: [
      { title: 'Java Basics and Setup', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34', duration: 720 },
      { title: 'Object-Oriented Programming', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34', duration: 960 },
      { title: 'Collections Framework', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34', duration: 840 },
      { title: 'Exception Handling', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34', duration: 600 }
    ],
    resources: [
      { title: 'Java Documentation', type: 'link', url: 'https://docs.oracle.com/javase/8/docs/' }
    ],
    quizzes: []
  },
  {
    title: 'C++ for Competitive Programming',
    description: 'Learn C++ with focus on algorithms, data structures, and problem-solving techniques for competitive programming and technical interviews.',
    category: 'Programming',
    level: 'Advanced',
    estimatedDuration: 35,
    published: true,
    videos: [
      { title: 'STL - Standard Template Library', url: 'https://www.youtube.com/watch?v=RRVYpIET_RU', duration: 900 },
      { title: 'Dynamic Programming Basics', url: 'https://www.youtube.com/watch?v=RRVYpIET_RU', duration: 1080 },
      { title: 'Graph Algorithms', url: 'https://www.youtube.com/watch?v=RRVYpIET_RU', duration: 1200 }
    ],
    resources: [],
    quizzes: []
  },

  // Web Development Courses
  {
    title: 'Full Stack Web Development with MERN',
    description: 'Build modern web applications using MongoDB, Express.js, React, and Node.js. Includes authentication, REST APIs, and deployment.',
    category: 'Web Development',
    level: 'Intermediate',
    estimatedDuration: 60,
    published: true,
    videos: [
      { title: 'Introduction to MERN Stack', url: 'https://www.youtube.com/watch?v=fnpmR6Q5lEc', duration: 600 },
      { title: 'Node.js and Express Setup', url: 'https://www.youtube.com/watch?v=fnpmR6Q5lEc', duration: 840 },
      { title: 'MongoDB and Mongoose', url: 'https://www.youtube.com/watch?v=fnpmR6Q5lEc', duration: 960 },
      { title: 'React Components and State', url: 'https://www.youtube.com/watch?v=fnpmR6Q5lEc', duration: 1080 },
      { title: 'REST API Development', url: 'https://www.youtube.com/watch?v=fnpmR6Q5lEc', duration: 900 }
    ],
    resources: [
      { title: 'MERN Project Template', type: 'link', url: 'https://github.com/mern-template' }
    ],
    quizzes: []
  },
  {
    title: 'HTML5 & CSS3 Complete Guide',
    description: 'Master modern web design with HTML5, CSS3, Flexbox, Grid, animations, and responsive design techniques.',
    category: 'Web Development',
    level: 'Beginner',
    estimatedDuration: 20,
    published: true,
    videos: [
      { title: 'HTML5 Semantic Elements', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU', duration: 480 },
      { title: 'CSS3 Selectors and Properties', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU', duration: 540 },
      { title: 'Flexbox Layout', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU', duration: 600 },
      { title: 'CSS Grid', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU', duration: 720 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'React.js - The Complete Guide',
    description: 'Deep dive into React including Hooks, Context API, Redux, React Router, and building production-ready applications.',
    category: 'Web Development',
    level: 'Intermediate',
    estimatedDuration: 45,
    published: true,
    videos: [
      { title: 'React Fundamentals', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: 900 },
      { title: 'React Hooks Deep Dive', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: 1080 },
      { title: 'State Management with Redux', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: 960 }
    ],
    resources: [],
    quizzes: []
  },

  // Data Science Courses
  {
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, statistics, and machine learning using Python, NumPy, Pandas, Matplotlib, and Scikit-learn.',
    category: 'Data Science',
    level: 'Intermediate',
    estimatedDuration: 55,
    published: true,
    videos: [
      { title: 'NumPy for Data Analysis', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', duration: 840 },
      { title: 'Pandas DataFrames', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', duration: 960 },
      { title: 'Data Visualization with Matplotlib', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', duration: 720 },
      { title: 'Statistical Analysis', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', duration: 900 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'Machine Learning A-Z',
    description: 'Complete machine learning course covering supervised and unsupervised learning, neural networks, and deep learning fundamentals.',
    category: 'Machine Learning',
    level: 'Advanced',
    estimatedDuration: 70,
    published: true,
    videos: [
      { title: 'Introduction to Machine Learning', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', duration: 600 },
      { title: 'Linear Regression', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', duration: 1080 },
      { title: 'Classification Algorithms', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', duration: 1200 },
      { title: 'Neural Networks Basics', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', duration: 1440 }
    ],
    resources: [],
    quizzes: []
  },

  // Mobile Development
  {
    title: 'Android App Development with Kotlin',
    description: 'Build native Android apps using Kotlin, Android Studio, Material Design, and modern Android architecture components.',
    category: 'Mobile Development',
    level: 'Intermediate',
    estimatedDuration: 50,
    published: true,
    videos: [
      { title: 'Kotlin Basics for Android', url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU', duration: 840 },
      { title: 'Android UI Development', url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU', duration: 960 },
      { title: 'Activities and Fragments', url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU', duration: 720 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'iOS Development with Swift',
    description: 'Create beautiful iOS apps using Swift, UIKit, SwiftUI, and iOS frameworks. Covers app architecture and App Store deployment.',
    category: 'Mobile Development',
    level: 'Intermediate',
    estimatedDuration: 55,
    published: true,
    videos: [
      { title: 'Swift Programming Basics', url: 'https://www.youtube.com/watch?v=comQ1-x2a1Q', duration: 900 },
      { title: 'SwiftUI Fundamentals', url: 'https://www.youtube.com/watch?v=comQ1-x2a1Q', duration: 1080 },
      { title: 'Building iOS Interfaces', url: 'https://www.youtube.com/watch?v=comQ1-x2a1Q', duration: 840 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'React Native - Cross Platform Apps',
    description: 'Build iOS and Android apps simultaneously using React Native. Includes navigation, state management, and native modules.',
    category: 'Mobile Development',
    level: 'Intermediate',
    estimatedDuration: 40,
    published: true,
    videos: [
      { title: 'React Native Setup', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', duration: 600 },
      { title: 'Components and Styling', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', duration: 840 },
      { title: 'Navigation in React Native', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', duration: 720 }
    ],
    resources: [],
    quizzes: []
  },

  // Artificial Intelligence
  {
    title: 'Deep Learning Specialization',
    description: 'Master deep learning with TensorFlow and Keras. Covers CNNs, RNNs, GANs, and state-of-the-art architectures.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    estimatedDuration: 80,
    published: true,
    videos: [
      { title: 'Neural Networks Fundamentals', url: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: 1200 },
      { title: 'Convolutional Neural Networks', url: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: 1440 },
      { title: 'Recurrent Neural Networks', url: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: 1320 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'Natural Language Processing with Python',
    description: 'Learn NLP techniques including text preprocessing, sentiment analysis, named entity recognition, and transformer models.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    estimatedDuration: 45,
    published: true,
    videos: [
      { title: 'Text Preprocessing', url: 'https://www.youtube.com/watch?v=fNxaJsNG3-s', duration: 720 },
      { title: 'Word Embeddings', url: 'https://www.youtube.com/watch?v=fNxaJsNG3-s', duration: 960 },
      { title: 'Sentiment Analysis', url: 'https://www.youtube.com/watch?v=fNxaJsNG3-s', duration: 840 }
    ],
    resources: [],
    quizzes: []
  },

  // Database
  {
    title: 'MongoDB Complete Developer Course',
    description: 'Master MongoDB from basics to advanced. Covers CRUD operations, aggregation, indexing, replication, and sharding.',
    category: 'Database',
    level: 'Intermediate',
    estimatedDuration: 30,
    published: true,
    videos: [
      { title: 'MongoDB Basics', url: 'https://www.youtube.com/watch?v=-56x56UppqQ', duration: 600 },
      { title: 'CRUD Operations', url: 'https://www.youtube.com/watch?v=-56x56UppqQ', duration: 840 },
      { title: 'Aggregation Framework', url: 'https://www.youtube.com/watch?v=-56x56UppqQ', duration: 960 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'SQL for Data Analysis',
    description: 'Learn SQL for data analysis including joins, subqueries, window functions, and query optimization.',
    category: 'Database',
    level: 'Beginner',
    estimatedDuration: 25,
    published: true,
    videos: [
      { title: 'SQL Basics', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: 540 },
      { title: 'Joins and Relationships', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: 720 },
      { title: 'Advanced Queries', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: 840 }
    ],
    resources: [],
    quizzes: []
  },

  // Cloud Computing
  {
    title: 'AWS Cloud Practitioner Essentials',
    description: 'Introduction to AWS cloud services including EC2, S3, RDS, Lambda, and cloud architecture best practices.',
    category: 'Cloud Computing',
    level: 'Beginner',
    estimatedDuration: 35,
    published: true,
    videos: [
      { title: 'Introduction to AWS', url: 'https://www.youtube.com/watch?v=ubCNZRNjhyo', duration: 600 },
      { title: 'EC2 and Compute Services', url: 'https://www.youtube.com/watch?v=ubCNZRNjhyo', duration: 840 },
      { title: 'S3 and Storage', url: 'https://www.youtube.com/watch?v=ubCNZRNjhyo', duration: 720 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'Microsoft Azure Fundamentals',
    description: 'Learn Azure cloud platform including virtual machines, app services, databases, and Azure DevOps.',
    category: 'Cloud Computing',
    level: 'Beginner',
    estimatedDuration: 30,
    published: true,
    videos: [
      { title: 'Azure Overview', url: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA', duration: 540 },
      { title: 'Azure Compute Services', url: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA', duration: 720 },
      { title: 'Azure Storage', url: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA', duration: 600 }
    ],
    resources: [],
    quizzes: []
  },

  // DevOps
  {
    title: 'Docker and Kubernetes Masterclass',
    description: 'Learn containerization with Docker and orchestration with Kubernetes. Includes CI/CD pipelines and microservices.',
    category: 'DevOps',
    level: 'Advanced',
    estimatedDuration: 50,
    published: true,
    videos: [
      { title: 'Docker Fundamentals', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', duration: 900 },
      { title: 'Docker Compose', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', duration: 720 },
      { title: 'Kubernetes Basics', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', duration: 1080 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'CI/CD with Jenkins and GitLab',
    description: 'Master continuous integration and deployment using Jenkins, GitLab CI, and automated testing.',
    category: 'DevOps',
    level: 'Intermediate',
    estimatedDuration: 35,
    published: true,
    videos: [
      { title: 'Introduction to CI/CD', url: 'https://www.youtube.com/watch?v=scEDHsr3APg', duration: 600 },
      { title: 'Jenkins Pipeline', url: 'https://www.youtube.com/watch?v=scEDHsr3APg', duration: 960 },
      { title: 'GitLab CI/CD', url: 'https://www.youtube.com/watch?v=scEDHsr3APg', duration: 840 }
    ],
    resources: [],
    quizzes: []
  },

  // Cybersecurity
  {
    title: 'Ethical Hacking and Penetration Testing',
    description: 'Learn ethical hacking techniques, penetration testing methodologies, and cybersecurity best practices.',
    category: 'Cybersecurity',
    level: 'Advanced',
    estimatedDuration: 60,
    published: true,
    videos: [
      { title: 'Introduction to Ethical Hacking', url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', duration: 720 },
      { title: 'Network Scanning', url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', duration: 960 },
      { title: 'Web Application Security', url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', duration: 1080 }
    ],
    resources: [],
    quizzes: []
  },
  {
    title: 'Network Security Fundamentals',
    description: 'Understand network security concepts, firewalls, VPNs, intrusion detection, and security protocols.',
    category: 'Cybersecurity',
    level: 'Intermediate',
    estimatedDuration: 40,
    published: true,
    videos: [
      { title: 'Network Security Basics', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', duration: 600 },
      { title: 'Firewalls and VPNs', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', duration: 840 },
      { title: 'Security Protocols', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', duration: 720 }
    ],
    resources: [],
    quizzes: []
  },

  // Networking
  {
    title: 'Computer Networking Complete Course',
    description: 'Comprehensive networking course covering OSI model, TCP/IP, routing, switching, and network troubleshooting.',
    category: 'Networking',
    level: 'Intermediate',
    estimatedDuration: 45,
    published: true,
    videos: [
      { title: 'OSI Model Explained', url: 'https://www.youtube.com/watch?v=vv4y_uOneC0', duration: 840 },
      { title: 'TCP/IP Protocol Suite', url: 'https://www.youtube.com/watch?v=vv4y_uOneC0', duration: 960 },
      { title: 'Routing and Switching', url: 'https://www.youtube.com/watch?v=vv4y_uOneC0', duration: 1080 }
    ],
    resources: [],
    quizzes: []
  }
];

async function seedCourses() {
  try {
    // Find a teacher to assign courses to
    const teacher = await Teacher.findOne();
    
    if (!teacher) {
      console.log('No teacher found. Please create a teacher account first.');
      process.exit(1);
    }

    console.log(`Found teacher: ${teacher.name} (${teacher.email})`);
    console.log('Starting to seed courses...\n');

    // Delete existing courses (optional - comment out if you want to keep existing)
    // await Course.deleteMany({});
    // console.log('Cleared existing courses\n');

    // Add teacher info to each course
    const coursesWithTeacher = dummyCourses.map(course => ({
      ...course,
      teacherId: teacher._id,
      teacherName: teacher.name
    }));

    // Insert courses
    const insertedCourses = await Course.insertMany(coursesWithTeacher);
    
    console.log(`✅ Successfully seeded ${insertedCourses.length} courses!\n`);
    console.log('Courses by category:');
    
    const categoryCounts = insertedCourses.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} courses`);
    });

    console.log('\n📚 Course seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();
