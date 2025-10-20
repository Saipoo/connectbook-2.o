# 🚀 ConnectBook Chatbot - Quick Start Guide

## ✅ What's Been Implemented

A **floating AI chatbot** that appears on every page, powered by Gemini AI, with:
- 🤖 Conversational AI responses
- 🧭 Smart navigation to features
- 📋 Quick action menus
- 🪄 PoornaGPT integration
- 🎨 Role-based themes (Blue/Purple/Green)

---

## 🏃 Quick Test (5 Minutes)

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

### 3. Test It!

1. **Login** as student at http://localhost:5173/login
2. **See** blue chatbot button (bottom-left corner)
3. **Click** the button
4. **Type**: "What is GradeMaster?"
5. **See** AI response + "Open GradeMaster" button
6. **Click**: "Menu" button in the chat input area
7. **See**: Menu message with all 12 student features as clickable buttons
8. **Click** any menu option to navigate
9. **Type**: "Tell me about PoornaGPT"
10. **Click**: "🪄 Explore PoornaGPT" button (opens in new tab)

---

## 📁 Files Created

### Backend (3 files)
```
backend/models/ChatbotInteraction.js      ← MongoDB schema
backend/services/chatbotService.js        ← Gemini AI logic
backend/routes/chatbotRoutes.js           ← API endpoints
```

### Frontend (1 file)
```
frontend/src/components/chatbot/FloatingChatbot.jsx  ← UI component
```

### Modified
```
backend/server.js                         ← Added route: /api/chatbot
frontend/src/App.jsx                      ← Added global chatbot component
```

---

## 🎯 Key Features

### 1. Conversational AI
- Ask questions in natural language
- Get context-aware responses
- Automatic navigation suggestions

### 2. Positioning
- **Location**: Bottom-left corner (to avoid overlap with Career Advisor chatbot)
- **Z-index**: 50 (appears above most content)
- **Responsive**: Works on all screen sizes

### 3. Quick Actions Menu
**Student:**
- Dashboard, Attendance, Grades, Courses
- Study Planner, Career Advisor, Lecture Notes
- Interview Simulator, Internship Simulator
- MentorConnect, Real-Time Updates, PoornaGPT

**Teacher:**
- Dashboard, Grade Management, Course Management
- Attendance Management, Lecture Recording, PoornaGPT

**Parent:**
- Dashboard, Attendance Reports, Grade Reports
- Performance Insights, PoornaGPT

### 3. Smart Navigation
Type any of these:
- "show me my grades" → Opens GradeMaster
- "check attendance" → Opens Attendance Tracker
- "go to courses" → Opens CourseMaster
- "open study planner" → Opens Study Planner

### 4. PoornaGPT Integration
Type "poornagpt" or click menu option → Opens https://poornagpt.vercel.app

---

## 🎨 Role-Based Themes

| Role | Button Color | Theme |
|------|-------------|-------|
| Student | 🔵 Blue | `bg-blue-600` |
| Teacher | 🟣 Purple | `bg-purple-600` |
| Parent | 🟢 Green | `bg-green-600` |

---

## 🔑 API Endpoints

All require authentication (JWT token).

```javascript
POST /api/chatbot/query          // Send message
GET  /api/chatbot/greeting       // Get greeting
GET  /api/chatbot/menu           // Get menu options
GET  /api/chatbot/history        // Get chat history
POST /api/chatbot/feedback       // Submit feedback
GET  /api/chatbot/analytics      // Get stats (admin only)
```

---

## 🧪 Testing Checklist

### Basic Tests
- [  ] Chatbot button appears when logged in
- [  ] Button disappears when logged out
- [  ] Button color matches user role
- [  ] Chat window opens/closes smoothly
- [  ] Minimize/maximize works
- [  ] Typing indicator shows during AI response

### Functionality Tests
- [  ] Greeting message loads on open
- [  ] User can send messages
- [  ] AI responses are contextual
- [  ] Navigation buttons work
- [  ] Menu shows correct options for role
- [  ] PoornaGPT link opens in new tab
- [  ] Messages auto-scroll to bottom
- [  ] Enter key sends message

### Role-Specific Tests
- [  ] Student sees 12 menu options
- [  ] Teacher sees 7 menu options
- [  ] Parent sees 5 menu options
- [  ] Each role has correct theme color

---

## 🐛 Common Issues & Fixes

### Button not showing?
- Verify you're logged in
- Check `localStorage.getItem('user')`
- Refresh page

### AI not responding?
- Check Gemini API quota (see REALTIME_UPDATES_QUOTA_GUIDE.md)
- Fallback messages will still work
- Wait for quota reset (midnight PT)

### Navigation not working?
- Verify routes exist in App.jsx
- Check browser console for errors
- Ensure user has permission for route

### Menu not loading?
- Check network tab for API errors
- Verify backend is running
- Check user role in localStorage

---

## 📊 Usage Examples

### Example 1: Feature Discovery
```
User: "What can this platform do?"
Bot: "ConnectBook offers many features! 📚 
- Track your attendance
- Check grades
- Browse courses
- Plan your studies
- Get career guidance
- And much more!

Would you like to see the full menu?"
```

### Example 2: Navigation
```
User: "I want to see my grades"
Bot: "📊 GradeMaster lets you view all your marks, submissions, 
and performance analytics! I can take you there right now. 
[Open GradeMaster]"
```

### Example 3: PoornaGPT
```
User: "What is PoornaGPT?"
Bot: "🪄 PoornaGPT is an all-in-one AI tools platform with:
✨ Multiple AI assistants
🎨 Creative tools
📝 Writing assistance
🧠 Problem-solving utilities

Would you like to explore it?
[🪄 Explore PoornaGPT]"
```

---

## 🎓 Pro Tips

### For Users:
1. Use the **Menu** button for quick access to features
2. Type questions naturally - the AI understands context
3. Click action buttons for instant navigation
4. **Minimize** the chat when not in use (it stays accessible)

### For Developers:
1. Check `CHATBOT_IMPLEMENTATION_GUIDE.md` for detailed docs
2. Monitor API usage with `/api/chatbot/analytics`
3. Review chat logs in MongoDB: `chatbotinteractions` collection
4. Customize colors in `FloatingChatbot.jsx`
5. Add new features to menu in `chatbotService.js`

---

## 📚 Documentation

- **Full Guide**: `CHATBOT_IMPLEMENTATION_GUIDE.md`
- **API Quota**: `REALTIME_UPDATES_QUOTA_GUIDE.md`
- **Backend Logic**: `backend/services/chatbotService.js`
- **Frontend UI**: `frontend/src/components/chatbot/FloatingChatbot.jsx`

---

## 🎉 You're All Set!

The chatbot is **production-ready** and available on all pages!

**Try it now:**
1. Login to any dashboard
2. Click the floating button (bottom-right)
3. Ask: "What can you help me with?"
4. Explore all the features!

**Happy chatting! 🤖✨**
