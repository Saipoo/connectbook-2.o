import mongoose from 'mongoose';
import Course from './models/Course.js';
import Teacher from './models/Teacher.js';

mongoose.connect('mongodb://localhost:27017/connectbook')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // Check teachers
    const teachers = await Teacher.find();
    console.log(`📚 Teachers in database: ${teachers.length}`);
    if (teachers.length > 0) {
      teachers.forEach(t => console.log(`   - ${t.name} (${t.email})`));
    } else {
      console.log('   ⚠️  No teachers found!');
    }
    
    console.log();
    
    // Check courses
    const courses = await Course.find();
    console.log(`📘 Courses in database: ${courses.length}`);
    if (courses.length > 0) {
      const published = courses.filter(c => c.published).length;
      console.log(`   - Published: ${published}`);
      console.log(`   - Unpublished: ${courses.length - published}`);
      
      console.log('\nSample courses:');
      courses.slice(0, 5).forEach(c => {
        console.log(`   - ${c.title} (${c.category}) - ${c.published ? '✅ Published' : '❌ Draft'}`);
      });
    } else {
      console.log('   ⚠️  No courses found!');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
