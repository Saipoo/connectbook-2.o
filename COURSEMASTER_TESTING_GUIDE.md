# CourseMaster - Quick Testing Guide

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access Application
Open browser: `http://localhost:5173`

---

## 🧪 Test Workflows

### Teacher: Create a Course (5 minutes)

1. **Login as Teacher**
   - Go to login page
   - Email: `teacher@example.com`
   - Password: Your teacher password

2. **Navigate to Course Creator**
   - Click "Course Creator" card on dashboard
   - OR go to: `/dashboard/teacher/course-creator`

3. **Create New Course**
   - Click "Create New Course" button
   - Fill in details:
     - Title: "Introduction to Python Programming"
     - Description: "Learn Python from scratch with hands-on examples"
     - Category: "Programming"
     - Level: "Beginner"
     - Duration: 10 (hours)
   - Upload thumbnail (optional)
   - Click "Create Course"

4. **Add Videos**
   - Click "Add Video" button
   - Enter:
     - Title: "Python Basics - Variables and Data Types"
     - Upload video file (or provide URL)
     - Duration: 600 (10 minutes in seconds)
   - Click "Add"
   - Repeat for 2-3 more videos

5. **Add Resources**
   - Click "Add Resource" button
   - Enter:
     - Title: "Python Cheat Sheet"
     - Type: "PDF"
     - Upload PDF file
   - Click "Add"
   - Add 1-2 more resources

6. **Add Quiz Questions**
   - Click "Add Question" button
   - Enter:
     - Question: "What is a variable in Python?"
     - Type: "Multiple Choice"
     - Options:
       - "A container for storing data"
       - "A function"
       - "A loop"
       - "A class"
     - Correct Answer: "A container for storing data"
     - Marks: 10
   - Click "Add"
   - Add 4-5 more questions

7. **Publish Course**
   - Click "Publish" button
   - Course is now visible to students

---

### Student: Complete a Course (10 minutes)

1. **Login as Student**
   - Go to login page
   - Email: `student@example.com`
   - Password: Your student password

2. **Navigate to CourseMaster**
   - Click "CourseMaster" card on dashboard
   - OR go to: `/dashboard/student/course-master`

3. **Browse Courses**
   - See list of published courses
   - Try search: Type "Python"
   - Try filter: Select "Programming" category
   - Should see the course created by teacher

4. **View Course Details**
   - Click on course card
   - See course details:
     - Description
     - Videos list
     - Resources list
     - Quiz section

5. **Enroll in Course**
   - Click "Enroll Now" button
   - Alert: "Enrolled successfully!"
   - Button changes to "Continue Learning"

6. **Watch Videos**
   - Click on first video in sidebar
   - Video player loads
   - Watch video (at least 90% to mark as complete)
   - Green checkmark appears on completed videos
   - Progress bar updates automatically

7. **Download Resources**
   - Click download link on any resource
   - File downloads to your device

8. **Take Quiz**
   - Click "Start Quiz" button
   - Answer all questions
   - Click "Submit Quiz"
   - View results:
     - Score (need 60% to pass)
     - Percentage
     - Correct/incorrect answers
   - If passed: "Course Completed!" message

9. **Generate Certificate**
   - Click "Generate Certificate" button (only visible if course completed)
   - Certificate preview modal opens
   - See certificate details:
     - Student name
     - Course name
     - Completion date
     - Instructor name
     - Quiz score
     - Certificate ID
   - Click "Download PDF"
   - Certificate PDF downloads

---

### Teacher: Monitor Students (2 minutes)

1. **View Enrolled Students**
   - Go to Course Creator
   - Click on your course
   - Scroll down to see enrolled students
   - OR use "View Enrollments" button (if implemented)

2. **View Issued Certificates**
   - In course edit view
   - Check certificates section
   - See list of students who completed course
   - View certificate details

---

## 🔍 What to Check

### Course Creation
- [ ] All form fields save correctly
- [ ] Thumbnail upload works
- [ ] Thumbnail preview displays
- [ ] Course appears in "My Courses" list

### Video Management
- [ ] Video upload completes (may take time for large files)
- [ ] Video appears in videos list
- [ ] Video title and duration display correctly
- [ ] Videos can be played in edit view

### Resource Management
- [ ] Resource upload completes
- [ ] Resource appears in resources list
- [ ] Resource type badge displays correctly
- [ ] Resources can be downloaded

### Quiz Management
- [ ] Quiz questions save correctly
- [ ] Multiple-choice options display properly
- [ ] Short-answer questions work
- [ ] Marks display correctly

### Publishing
- [ ] Unpublished courses don't appear to students
- [ ] Published courses appear in student browse view
- [ ] Publish toggle works correctly

### Student Enrollment
- [ ] Enrollment works on first click
- [ ] Can't enroll twice (shows "Already enrolled")
- [ ] Enrollment count increments
- [ ] Progress starts at 0%

### Video Watching
- [ ] Video player controls work (play, pause, mute, seek, fullscreen)
- [ ] Progress tracking updates automatically
- [ ] Checkmarks appear for completed videos (90% threshold)
- [ ] Overall progress percentage updates
- [ ] Can resume video from where left off

### Quiz Taking
- [ ] Can't submit without answering all questions
- [ ] Multiple-choice options selectable
- [ ] Short-answer text input works
- [ ] Results display correctly
- [ ] Pass/fail threshold works (60%)
- [ ] Score calculation accurate
- [ ] Can retake quiz
- [ ] Best score saved and displayed

### Certificate Generation
- [ ] Button only appears after course completion
- [ ] Certificate generates without errors
- [ ] PDF downloads successfully
- [ ] PDF opens correctly
- [ ] Certificate details accurate
- [ ] Certificate ID unique
- [ ] Can't generate duplicate certificates

### Search and Filter
- [ ] Search works (case-insensitive)
- [ ] Search checks title and description
- [ ] Category filter works
- [ ] "All Categories" shows everything
- [ ] Results count updates correctly

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768px width)
- [ ] Works on mobile (375px width)
- [ ] Cards stack properly on mobile
- [ ] Video player responsive
- [ ] Modals centered on all screens

---

## 🐛 Common Issues and Fixes

### Issue: "Network Error" when creating course
**Fix:** Check backend is running on port 5000

### Issue: File upload fails
**Fix:** 
- Check file size (max 100MB)
- Check uploads/courses/ directories exist
- Check file type is allowed

### Issue: Video doesn't play
**Fix:**
- Check video file format (MP4 works best)
- Check video URL is correct
- Check file uploaded successfully

### Issue: Certificate button doesn't appear
**Fix:**
- Check all videos watched (90% each)
- Check quiz passed (60%+)
- Check enrollment.completed = true in database

### Issue: Progress not updating
**Fix:**
- Check console for errors
- Verify enrollmentId passed correctly
- Check video timeupdate event firing

### Issue: Quiz evaluation incorrect
**Fix:**
- Check correctAnswer matches exactly (case-insensitive)
- Check marks values are numbers
- Verify all questions have correctAnswer

---

## 📊 Database Inspection

### Check Course in MongoDB
```javascript
db.courses.findOne({ title: "Introduction to Python Programming" })
```

### Check Enrollment
```javascript
db.courseenrollments.findOne({ studentId: ObjectId("your_student_id") })
```

### Check Certificate
```javascript
db.certificates.findOne({ certificateId: "CERT-..." })
```

### Verify Indexes
```javascript
db.courses.getIndexes()
db.courseenrollments.getIndexes()
db.certificates.getIndexes()
```

---

## 🎯 Expected Results

### After Course Creation:
- Course document in database with `published: false`
- Empty arrays for videos, resources, quizzes
- `enrollmentCount: 0`

### After Adding Content:
- Videos array populated with title, url, duration
- Resources array populated with title, type, url
- Quizzes array populated with questions and answers

### After Publishing:
- `published: true`
- Course visible in student browse view

### After Enrollment:
- New CourseEnrollment document
- Course `enrollmentCount` incremented
- Student sees "Enrolled" badge

### After Watching Videos:
- `videoProgress` array updated
- `watchedDuration` increases
- `completed: true` when 90% watched
- `overallProgress` increases

### After Quiz:
- New entry in `quizAttempts` array
- `score` and `percentage` calculated
- If passed + all videos watched:
  - `completed: true`
  - `overallProgress: 100`
  - `completionDate` set

### After Certificate Generation:
- New Certificate document
- PDF file in uploads/courses/certificates/
- `certificateGenerated: true` in enrollment
- `certificateId` stored

---

## ⚡ Quick Tests (30 seconds each)

### Test 1: Create Empty Course
1. Login as teacher
2. Go to Course Creator
3. Click "Create New Course"
4. Fill title and description only
5. Click "Create Course"
6. Should succeed, course created

### Test 2: Enroll in Course
1. Login as student
2. Go to CourseMaster
3. Click any published course
4. Click "Enroll Now"
5. Should succeed, button changes

### Test 3: Watch Video Progress
1. As enrolled student
2. Click a video
3. Watch for 10 seconds
4. Check console for progress update
5. Should see POST request to /progress/update

### Test 4: Quiz Validation
1. As enrolled student
2. Click "Start Quiz"
3. Leave some answers blank
4. Click "Submit Quiz"
5. Should show error "Please answer all questions"

### Test 5: Certificate Disabled
1. As newly enrolled student
2. View course details
3. Check for "Generate Certificate" button
4. Should NOT appear (course not complete)

---

## 📝 Test Data Templates

### Sample Course Data
```javascript
{
  title: "Full Stack Web Development",
  description: "Learn HTML, CSS, JavaScript, React, Node.js and MongoDB",
  category: "Web Development",
  level: "Intermediate",
  estimatedDuration: 40,
  thumbnailUrl: "uploads/courses/thumbnails/web-dev.jpg"
}
```

### Sample Video Data
```javascript
{
  title: "Introduction to React Hooks",
  url: "uploads/courses/videos/react-hooks.mp4",
  duration: 1800, // 30 minutes
  order: 1
}
```

### Sample Quiz Data
```javascript
{
  question: "What does HTML stand for?",
  type: "multiple-choice",
  options: [
    "Hyper Text Markup Language",
    "High Tech Modern Language",
    "Home Tool Markup Language",
    "Hyperlinks Text Mark Language"
  ],
  correctAnswer: "Hyper Text Markup Language",
  marks: 5
}
```

---

## 🎉 Success Criteria

### Course Creator Working:
✅ Can create courses  
✅ Can add videos, resources, quizzes  
✅ Can publish/unpublish  
✅ Can view enrollments  

### CourseMaster Working:
✅ Can browse courses  
✅ Can enroll  
✅ Can watch videos  
✅ Can download resources  
✅ Can take quizzes  
✅ Can generate certificates  

### Integration Working:
✅ Teacher dashboard has Course Creator link  
✅ Student dashboard has CourseMaster link  
✅ Routes configured correctly  
✅ Authentication working  

---

## 🔧 Troubleshooting Commands

### Restart Backend
```bash
cd backend
npm start
```

### Restart Frontend (Clear Cache)
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Check MongoDB Connection
```bash
mongosh
use connectbook
db.courses.countDocuments()
```

### Check Backend Logs
Look for these messages:
- "✅ MongoDB connected successfully"
- "✅ Server running on port 5000"
- "✅ Gemini API Key loaded"

### Check Frontend Console
Look for:
- Network requests (200 OK status)
- No JavaScript errors
- Successful API responses

---

## 📞 Need Help?

### Common Questions

**Q: Where are uploaded files stored?**  
A: `backend/uploads/courses/` with subdirectories for each file type

**Q: How to reset a course?**  
A: Delete from MongoDB: `db.courses.deleteOne({ _id: ObjectId("...") })`

**Q: How to unenroll a student?**  
A: Delete enrollment: `db.courseenrollments.deleteOne({ studentId: ..., courseId: ... })`

**Q: Certificate not generating?**  
A: Check `uploads/courses/certificates/` directory exists and has write permissions

**Q: Video upload taking too long?**  
A: Normal for large files. Check network tab for progress. Max 100MB.

---

**Happy Testing! 🚀**
