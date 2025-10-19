# 🚀 Interview Simulator - Quick Setup Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js installed (v16+)
- ✅ MongoDB running
- ✅ Gemini API key from Google AI Studio

---

## Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend
npm install @google/generative-ai
```

### 1.2 Add Gemini API Key

Create or update `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Get Gemini API Key**: https://makersuite.google.com/app/apikey

### 1.3 Start Backend Server

```bash
cd backend
node server.js
```

**Expected Output**:
```
✅ MongoDB Connected Successfully
🚀 ConnectBook Server running on port 5000
```

---

## Step 2: Frontend Setup

### 2.1 Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

**Access at**: `http://localhost:5173`

---

## Step 3: Test the Interview Simulator

### 3.1 As Student

1. Login as a student account
2. Click **"Interview Simulator"** in sidebar
3. Select a company (e.g., **Google**)
4. Fill in:
   - Domain: Frontend
   - Role: Software Engineer
   - Difficulty: Medium
5. Click **"I'm Ready — Start Interview"**
6. Allow camera/microphone permissions
7. Answer the 12 questions:
   - 5 Personal Questions
   - 5 Technical Questions
   - 2 Coding Questions
8. Click **"Complete Interview"**
9. View your AI-generated report!

### 3.2 As Teacher

1. Login as teacher
2. Click **"Interview Evaluations"** in sidebar
3. View all student interview reports
4. Click **"Add Remark"** on any report
5. Enter your feedback
6. Click **"Save Remarks"**

### 3.3 As Parent

1. Login as parent
2. Scroll to **"Interview Performance"** section on dashboard
3. View linked student's interview scores
4. Click **"View Report"** to see detailed feedback

---

## Step 4: Verify Everything Works

### Backend Endpoints Test

Open Postman or Thunder Client and test:

```http
GET http://localhost:5000/api/interview/categories
```

**Expected Response**:
```json
{
  "success": true,
  "categories": [
    {
      "id": "google",
      "name": "Google",
      "logo": "🔍",
      "domains": ["Frontend", "Backend", "Full Stack", "AI/ML", "Data Science"],
      "difficulty": "Hard",
      "duration": 45
    },
    // ... more categories
  ]
}
```

### Frontend Test

1. Navigate to: `http://localhost:5173/dashboard/student/interview`
2. Should see 7 company cards (Google, Microsoft, Amazon, Infosys, TCS, Wipro, Cognizant)
3. Click any card → Pre-interview modal should open

---

## Common Issues

### ❌ Issue: "Failed to generate interview questions"

**Solution**:
1. Check `.env` has valid `GEMINI_API_KEY`
2. Test API key at: https://makersuite.google.com/
3. Restart backend server
4. Fallback questions will be used if API fails

### ❌ Issue: "Failed to access camera/microphone"

**Solution**:
1. Use **Chrome** or **Edge** browser
2. Ensure you're on `localhost` or HTTPS
3. Check browser permissions: `chrome://settings/content/camera`
4. Allow permissions when prompted

### ❌ Issue: Backend crashes with "Cannot find module"

**Solution**:
```bash
cd backend
npm install
npm install @google/generative-ai
node server.js
```

### ❌ Issue: Frontend shows blank page

**Solution**:
```bash
cd frontend
npm install
npm run dev
```

---

## File Structure

```
backend/
├── models/
│   ├── InterviewSession.js       ✨ NEW
│   └── InterviewReport.js        ✨ NEW
├── services/
│   └── interviewService.js       ✨ NEW
├── routes/
│   └── interviewRoutes.js        ✨ NEW
└── server.js                     🔧 UPDATED

frontend/
├── src/
│   ├── pages/
│   │   ├── student/
│   │   │   ├── InterviewSimulator.jsx       ✨ NEW
│   │   │   ├── LiveInterviewSession.jsx     ✨ NEW
│   │   │   └── InterviewResults.jsx         ✨ NEW
│   │   ├── teacher/
│   │   │   └── TeacherInterviewEvaluations.jsx ✨ NEW
│   │   └── dashboards/
│   │       ├── StudentDashboard.jsx         🔧 UPDATED
│   │       ├── TeacherDashboard.jsx         🔧 UPDATED
│   │       └── ParentDashboard.jsx          🔧 UPDATED
│   └── App.jsx                              🔧 UPDATED
```

---

## 🎯 What's Working

### ✅ Backend
- MongoDB models for sessions and reports
- Gemini AI integration for question generation
- AI-powered evaluation system
- 8 REST API endpoints
- Teacher remarks system

### ✅ Frontend
- Student: Interview selection, live session, results
- Teacher: View all reports, add remarks
- Parent: View child's interview performance
- Updated sidebars with Interview Simulator links
- Complete routing setup

---

## 🎉 You're All Set!

The Interview Simulator is now fully integrated and ready to use!

**Next Steps**:
1. Test as student, teacher, and parent
2. Verify AI feedback quality
3. Try different companies and difficulty levels
4. Implement PDF export (optional)

**For detailed documentation, see**: `INTERVIEW_SIMULATOR_COMPLETE.md`

Happy coding! 🚀
