# Quick Setup Guide for Lecture Short Notes

## Step-by-Step Integration

### 1. Backend Integration

#### A. Register Routes in server.js

Open `backend/server.js` and add:

```javascript
const lectureRoutes = require('./routes/lectureRoutes');
app.use('/api/lectures', lectureRoutes);
```

Place this with your other route registrations (after authRoutes, studentRoutes, etc.)

#### B. Create Upload Directory

Run in terminal:
```bash
cd backend
mkdir -p uploads/lectures
```

Or on Windows:
```cmd
cd backend
mkdir uploads\lectures
```

---

### 2. Frontend Integration

#### A. Update App.jsx Routes

Open `frontend/src/App.jsx` and add these imports:

```javascript
import TeacherLectures from './pages/teacher/TeacherLectures';
import StudentLectures from './pages/student/StudentLectures';
```

Then add routes inside your `<Routes>` component:

```javascript
{/* Teacher Lecture Notes */}
<Route 
  path="/teacher/lectures" 
  element={
    <ProtectedRoute requiredRole="teacher">
      <TeacherLectures />
    </ProtectedRoute>
  } 
/>

{/* Student Lecture Notes */}
<Route 
  path="/student/lectures" 
  element={
    <ProtectedRoute requiredRole="student">
      <StudentLectures />
    </ProtectedRoute>
  } 
/>
```

#### B. Add to Teacher Sidebar

Find your teacher sidebar navigation (usually in `frontend/src/components/TeacherSidebar.jsx` or similar):

```javascript
import { Video } from 'lucide-react';

// Add to navigation items array:
{
  name: 'Lecture Notes',
  icon: Video,
  path: '/teacher/lectures',
  description: 'Record & Publish Lectures'
}
```

#### C. Add to Student Sidebar

Find your student sidebar navigation:

```javascript
import { BookOpen } from 'lucide-react';

// Add to navigation items array:
{
  name: 'Lecture Notes',
  icon: BookOpen,
  path: '/student/lectures',
  description: 'Access Lecture Materials'
}
```

---

### 3. Install Dependencies (if needed)

```bash
cd backend
npm install multer

cd ../frontend  
npm install lucide-react
```

---

### 4. Environment Variables

Make sure your `.env` file has:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### 5. Test the Integration

#### Start Backend:
```bash
cd backend
npm run dev
```

#### Start Frontend:
```bash
cd frontend
npm run dev
```

#### Test Flow:

**As Teacher:**
1. Login as teacher
2. Navigate to "Lecture Notes" in sidebar
3. Click "New Lecture"
4. Fill form: 
   - Title: "Introduction to React Hooks"
   - Subject: "Web Development"
   - Course: "CS301"
   - Topic: "React Fundamentals"
   - Difficulty: Intermediate
5. Click "Create & Upload Recording"
6. Select any video file
7. Click "Upload & Process"
8. Wait for AI processing (status changes: Recording → Processing → Completed)
9. Click "Publish"

**As Student:**
1. Login as student
2. Navigate to "Lecture Notes" in sidebar
3. View published lectures
4. Click "View Notes" on any lecture
5. Review AI-generated content
6. Click "Download" to save notes
7. Switch to "Revision Mode" tab
8. View flashcards and key points

---

### 6. Verify Everything Works

✅ Teacher dashboard shows lecture statistics
✅ File upload works without errors
✅ AI processing completes successfully
✅ Publish button appears after processing
✅ Student can see published lectures
✅ Notes modal displays all content
✅ Download creates text file
✅ Revision mode shows consolidated data

---

## Common Issues & Fixes

### Issue 1: "Cannot POST /api/lectures/create"
**Fix:** Make sure you registered the route in server.js:
```javascript
app.use('/api/lectures', lectureRoutes);
```

### Issue 2: File upload fails
**Fix:** Create the uploads directory:
```bash
mkdir -p backend/uploads/lectures
```

### Issue 3: AI processing stuck
**Fix:** Check Gemini API key in .env file

### Issue 4: Routes not found in frontend
**Fix:** Verify you imported components and added routes to App.jsx

### Issue 5: Icons not showing
**Fix:** Install lucide-react:
```bash
npm install lucide-react
```

---

## Quick Commands

```bash
# Backend
cd backend
npm install multer
mkdir uploads\lectures
npm run dev

# Frontend  
cd frontend
npm install lucide-react
npm run dev
```

---

## File Locations Summary

**Backend:**
- ✅ `backend/models/Lecture.js` (created)
- ✅ `backend/routes/lectureRoutes.js` (created)
- ⚙️ `backend/server.js` (need to add route registration)
- 📁 `backend/uploads/lectures/` (need to create directory)

**Frontend:**
- ✅ `frontend/src/pages/teacher/TeacherLectures.jsx` (created)
- ✅ `frontend/src/pages/student/StudentLectures.jsx` (created)
- ⚙️ `frontend/src/App.jsx` (need to add routes)
- ⚙️ `frontend/src/components/TeacherSidebar.jsx` (need to add nav item)
- ⚙️ `frontend/src/components/StudentSidebar.jsx` (need to add nav item)

---

## Next Steps

After basic integration:

1. **Customize Styling** - Match your theme colors
2. **Add Attendance Integration** - Link with attendance module
3. **Parent Dashboard** - Show lecture activity
4. **Study Planner Integration** - Auto-add lectures to student plans
5. **Enhanced Analytics** - More detailed engagement metrics

---

That's it! Your Lecture Short Notes module is ready to use! 🎉
