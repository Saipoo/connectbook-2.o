import mongoose from 'mongoose';
import Course from './models/Course.js';
import Teacher from './models/Teacher.js';

export const seedDummyCourses = async () => {
  try {
    // Delete all existing dummy courses first (to reseed with correct data types)
    const deletedCount = await Course.deleteMany({ isDummyCourse: true });
    if (deletedCount.deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount.deletedCount} old dummy courses (reseeding with fixes)`);
    }

    const existingCoursesCount = await Course.countDocuments();
    console.log(`📚 Database has ${existingCoursesCount} existing course(s). Adding 25 dummy courses...`);

    // Get first teacher from database
    const teacher = await Teacher.findOne();
    
    if (!teacher) {
      console.log('⚠️  No teacher found in database. Skipping course seeding.');
      console.log('💡 Register a teacher account first, then restart the server.');
      return;
    }

    const teacherId = teacher._id;
    const teacherName = teacher.name;

    console.log(`👨‍🏫 Using teacher: ${teacherName} (${teacher.email})`);

    // 25 Dummy Courses with Quizzes
    const dummyCourses = [
      {
        title: 'Complete Python Programming',
        description: 'Master Python from basics to advanced concepts including OOP, data structures, and real-world projects.',
        category: 'Programming',
        level: 'Beginner',
        estimatedDuration: 40,
        teacherId,
        teacherName,
        published: true,
        isDummyCourse: true,
        videos: [
          { title: 'Introduction to Python', url: 'https://www.w3schools.com/python/python_intro.asp', duration: 15 },
          { title: 'Python Basics', url: 'https://www.w3schools.com/python/python_syntax.asp', duration: 20 },
          { title: 'Data Structures in Python', url: 'https://www.w3schools.com/python/python_lists.asp', duration: 25 }
        ],
        quizzes: [
          {
            question: 'What is Python?',
            options: ['A snake', 'A programming language', 'A database', 'An operating system'],
            correctAnswer: 1,
            marks: 2
          },
          {
            question: 'Which keyword is used to define a function in Python?',
            options: ['function', 'def', 'func', 'define'],
            correctAnswer: 1,
            marks: 2
          },
          {
            question: 'What is the correct file extension for Python files?',
            options: ['.pt', '.pyt', '.py', '.python'],
            correctAnswer: 2,
            marks: 2
          },
          {
            question: 'Which of these is a mutable data type in Python?',
            options: ['tuple', 'string', 'list', 'int'],
            correctAnswer: 2,
            marks: 2
          },
          {
            question: 'What does OOP stand for?',
            options: ['Object Oriented Programming', 'Out Of Place', 'Only One Program', 'Open Object Protocol'],
            correctAnswer: 0,
            marks: 2
          }
        ]
      },
      {
        title: 'Full Stack MERN Development',
        description: 'Build modern web applications using MongoDB, Express.js, React, and Node.js.',
        category: 'Web Development',
        level: 'Intermediate',
        estimatedDuration: 60,
        teacherId,
        teacherName,
        published: true,
        isDummyCourse: true,
        videos: [
          { title: 'MERN Stack Overview', url: 'https://www.mongodb.com/mern-stack', duration: 10 },
          { title: 'Setting up MongoDB', url: 'https://www.mongodb.com/docs/manual/installation/', duration: 15 },
          { title: 'Building REST APIs', url: 'https://expressjs.com/en/starter/basic-routing.html', duration: 30 }
        ],
        quizzes: [
          { question: 'What does MERN stand for?', options: ['MySQL Express React Node', 'MongoDB Express React Node', 'MongoDB Express Rails Node', 'MySQL Express Ruby Node'], correctAnswer: 1, marks: 2 },
          { question: 'Which is the frontend library in MERN?', options: ['MongoDB', 'Express', 'React', 'Node'], correctAnswer: 2, marks: 2 },
          { question: 'What is MongoDB?', options: ['A relational database', 'A NoSQL database', 'A frontend framework', 'A programming language'], correctAnswer: 1, marks: 2 },
          { question: 'What is Express.js used for?', options: ['Database', 'Frontend', 'Backend framework', 'Testing'], correctAnswer: 2, marks: 2 },
          { question: 'Node.js is built on which JavaScript engine?', options: ['SpiderMonkey', 'V8', 'Chakra', 'Rhino'], correctAnswer: 1, marks: 2 }
        ]
      },
      {
        title: 'React.js Complete Guide',
        description: 'Learn React from scratch - components, hooks, state management, and advanced patterns.',
        category: 'Web Development',
        level: 'Intermediate',
        estimatedDuration: 45,
        teacherId,
        teacherName,
        published: true,
        isDummyCourse: true,
        videos: [
          { title: 'React Basics', url: 'https://react.dev/learn', duration: 20 },
          { title: 'React Hooks', url: 'https://react.dev/reference/react', duration: 25 }
        ],
        quizzes: [
          { question: 'What is React?', options: ['A database', 'A JavaScript library', 'A programming language', 'A server'], correctAnswer: 1, marks: 2 },
          { question: 'Which hook is used for state management?', options: ['useEffect', 'useState', 'useContext', 'useRef'], correctAnswer: 1, marks: 2 },
          { question: 'What is JSX?', options: ['A database query language', 'JavaScript XML', 'Java Syntax Extension', 'JSON XML'], correctAnswer: 1, marks: 2 },
          { question: 'What is a component in React?', options: ['A function or class that returns UI', 'A database table', 'A CSS file', 'A server endpoint'], correctAnswer: 0, marks: 2 },
          { question: 'Which method is used to update state?', options: ['updateState()', 'changeState()', 'setState()', 'modifyState()'], correctAnswer: 2, marks: 2 }
        ]
      },
      {
        title: 'Data Science with Python',
        description: 'Learn data analysis, visualization, and machine learning with Python libraries.',
        category: 'Data Science',
        level: 'Intermediate',
        estimatedDuration: 55,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Data Science Fundamentals', url: 'https://www.python.org/about/apps/', duration: 30 }
        ]
      },
      {
        title: 'Machine Learning A-Z',
        description: 'Comprehensive machine learning course covering supervised, unsupervised learning and neural networks.',
        category: 'Machine Learning',
        level: 'Advanced',
        estimatedDuration: 70,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'ML Introduction', url: 'https://scikit-learn.org/stable/tutorial/index.html', duration: 35 }
        ]
      },
      {
        title: 'Android Development with Kotlin',
        description: 'Build native Android apps using Kotlin and modern Android development practices.',
        category: 'Mobile Development',
        level: 'Intermediate',
        estimatedDuration: 50,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Kotlin Basics', url: 'https://developer.android.com/kotlin', duration: 25 }
        ]
      },
      {
        title: 'iOS Development with Swift',
        description: 'Create beautiful iOS apps using Swift and SwiftUI.',
        category: 'Mobile Development',
        level: 'Intermediate',
        estimatedDuration: 55,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Swift Fundamentals', url: 'https://developer.apple.com/swift/', duration: 30 }
        ]
      },
      {
        title: 'Deep Learning with TensorFlow',
        description: 'Master deep learning and neural networks using TensorFlow 2.0.',
        category: 'Artificial Intelligence',
        level: 'Advanced',
        estimatedDuration: 80,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Deep Learning Basics', url: 'https://www.tensorflow.org/tutorials', duration: 40 }
        ]
      },
      {
        title: 'MongoDB Complete Guide',
        description: 'Learn NoSQL database design, queries, aggregation, and performance optimization.',
        category: 'Database',
        level: 'Intermediate',
        estimatedDuration: 30,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'MongoDB Basics', url: 'https://www.mongodb.com/docs/manual/tutorial/getting-started/', duration: 20 }
        ]
      },
      {
        title: 'SQL for Data Analysis',
        description: 'Master SQL queries, joins, subqueries, and database design.',
        category: 'Database',
        level: 'Beginner',
        estimatedDuration: 25,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'SQL Fundamentals', url: 'https://www.w3schools.com/sql/', duration: 15 }
        ]
      },
      {
        title: 'AWS Cloud Essentials',
        description: 'Learn cloud computing with AWS - EC2, S3, Lambda, and more.',
        category: 'Cloud Computing',
        level: 'Beginner',
        estimatedDuration: 35,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'AWS Overview', url: 'https://aws.amazon.com/getting-started/', duration: 20 }
        ]
      },
      {
        title: 'Docker & Kubernetes',
        description: 'Master containerization and orchestration for modern applications.',
        category: 'DevOps',
        level: 'Advanced',
        estimatedDuration: 50,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Docker Basics', url: 'https://docs.docker.com/get-started/', duration: 25 }
        ]
      },
      {
        title: 'Ethical Hacking Basics',
        description: 'Learn penetration testing, vulnerability assessment, and security best practices.',
        category: 'Cybersecurity',
        level: 'Advanced',
        estimatedDuration: 60,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Ethical Hacking Intro', url: 'https://www.kali.org/docs/', duration: 30 }
        ]
      },
      {
        title: 'Computer Networking',
        description: 'Understand networking fundamentals, protocols, and network security.',
        category: 'Networking',
        level: 'Intermediate',
        estimatedDuration: 45,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Networking Basics', url: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks/what-is-computer-networking.html', duration: 25 }
        ]
      },
      {
        title: 'HTML5 & CSS3 Mastery',
        description: 'Create beautiful, responsive websites with modern HTML5 and CSS3.',
        category: 'Web Development',
        level: 'Beginner',
        estimatedDuration: 20,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'HTML Basics', url: 'https://www.w3schools.com/html/', duration: 10 },
          { title: 'CSS Fundamentals', url: 'https://www.w3schools.com/css/', duration: 10 }
        ]
      },
      {
        title: 'Java Programming Masterclass',
        description: 'Complete Java programming from basics to advanced OOP concepts.',
        category: 'Programming',
        level: 'Intermediate',
        estimatedDuration: 50,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Java Introduction', url: 'https://docs.oracle.com/javase/tutorial/', duration: 25 }
        ]
      },
      {
        title: 'C++ Competitive Programming',
        description: 'Master algorithms, data structures, and competitive programming with C++.',
        category: 'Programming',
        level: 'Advanced',
        estimatedDuration: 35,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'C++ Basics', url: 'https://www.learncpp.com/', duration: 20 }
        ]
      },
      {
        title: 'React Native Mobile Apps',
        description: 'Build cross-platform mobile apps using React Native.',
        category: 'Mobile Development',
        level: 'Intermediate',
        estimatedDuration: 40,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'React Native Setup', url: 'https://reactnative.dev/docs/getting-started', duration: 20 }
        ]
      },
      {
        title: 'Natural Language Processing',
        description: 'Learn NLP techniques, sentiment analysis, and text processing with Python.',
        category: 'Artificial Intelligence',
        level: 'Advanced',
        estimatedDuration: 45,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'NLP Fundamentals', url: 'https://www.nltk.org/', duration: 25 }
        ]
      },
      {
        title: 'Microsoft Azure Fundamentals',
        description: 'Learn cloud services, Azure compute, storage, and networking.',
        category: 'Cloud Computing',
        level: 'Beginner',
        estimatedDuration: 30,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Azure Overview', url: 'https://azure.microsoft.com/en-us/get-started/', duration: 15 }
        ]
      },
      {
        title: 'CI/CD with Jenkins',
        description: 'Automate your software delivery pipeline with Jenkins.',
        category: 'DevOps',
        level: 'Intermediate',
        estimatedDuration: 35,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Jenkins Basics', url: 'https://www.jenkins.io/doc/tutorials/', duration: 20 }
        ]
      },
      {
        title: 'Network Security',
        description: 'Learn network security, firewalls, VPNs, and threat detection.',
        category: 'Cybersecurity',
        level: 'Intermediate',
        estimatedDuration: 40,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Network Security Basics', url: 'https://www.cisco.com/c/en/us/products/security/what-is-network-security.html', duration: 25 }
        ]
      },
      {
        title: 'JavaScript ES6+ Complete',
        description: 'Modern JavaScript - ES6+, async/await, promises, and more.',
        category: 'Web Development',
        level: 'Intermediate',
        estimatedDuration: 30,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'ES6 Features', url: 'https://www.w3schools.com/js/js_es6.asp', duration: 15 }
        ]
      },
      {
        title: 'Git & GitHub Mastery',
        description: 'Version control with Git, GitHub workflows, and collaboration.',
        category: 'DevOps',
        level: 'Beginner',
        estimatedDuration: 15,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Git Basics', url: 'https://git-scm.com/docs/gittutorial', duration: 10 }
        ]
      },
      {
        title: 'Blockchain Development',
        description: 'Build decentralized applications with Ethereum and Solidity.',
        category: 'Other',
        level: 'Advanced',
        estimatedDuration: 50,
        teacherId,
        teacherName,
        published: true,
        videos: [
          { title: 'Blockchain Basics', url: 'https://ethereum.org/en/developers/docs/', duration: 30 }
        ]
      }
    ];

    // Add generic quiz to courses that don't have quizzes
    const genericQuizzes = [
      { question: 'This course covers fundamental concepts?', options: ['True', 'False', 'Maybe', 'Not sure'], correctAnswer: 0, marks: 2 },
      { question: 'Practical examples are important for learning?', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'], correctAnswer: 0, marks: 2 },
      { question: 'Which is the best way to master this topic?', options: ['Reading only', 'Practice and projects', 'Watching videos only', 'Memorization'], correctAnswer: 1, marks: 2 },
      { question: 'Continuous learning is essential in tech?', options: ['Yes', 'No', 'Sometimes', 'Rarely'], correctAnswer: 0, marks: 2 },
      { question: 'This course will help you build real-world skills?', options: ['Absolutely', 'Partially', 'Not really', 'No'], correctAnswer: 0, marks: 2 }
    ];

    // Add quizzes to courses that don't have them
    dummyCourses.forEach(course => {
      if (!course.quizzes || course.quizzes.length === 0) {
        course.quizzes = genericQuizzes;
      }
    });

    // Insert courses
    const createdCourses = await Course.insertMany(dummyCourses);
    
    // Mark all as dummy courses
    await Course.updateMany(
      { _id: { $in: createdCourses.map(c => c._id) } },
      { $set: { isDummyCourse: true } }
    );
    
    console.log(`✅ Successfully seeded ${createdCourses.length} dummy courses!`);
    
    // Show breakdown by category
    const categories = {};
    createdCourses.forEach(course => {
      categories[course.category] = (categories[course.category] || 0) + 1;
    });
    
    console.log('\n📊 Courses by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding dummy courses:', error.message);
  }
};
