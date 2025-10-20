# 🚀 Real-Time Updates - Quick Start Guide

## Installation (5 minutes)

### Step 1: Install Package
```bash
cd backend
npm install node-cron
```

### Step 2: Start Backend
```bash
npm start
```

Wait for this output:
```
✅ Generated 18 updates
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 4: Test It!
1. Login as **student**
2. See **"Today's Highlights"** widget on dashboard
3. Click **"Real-Time Updates"** in sidebar
4. Explore updates, click cards, search, filter!

---

## What You'll See

### Dashboard Widget
- Quote of the day
- Featured job/internship
- Top 5 trending updates
- "View All" button

### Real-Time Updates Page
- 6 category filters (All, Education, AI/Tech, Jobs, Motivation, Startups, GK)
- Search bar
- Beautiful update cards with images
- Click any card for detailed view
- Load more pagination

---

## API Testing (Optional)

### Get All Updates
```bash
GET http://localhost:5000/api/updates
Authorization: Bearer YOUR_STUDENT_TOKEN
```

### Get Dashboard Highlights
```bash
GET http://localhost:5000/api/updates/dashboard/highlights
Authorization: Bearer YOUR_STUDENT_TOKEN
```

### Trigger AI Generation (Teacher Only)
```bash
POST http://localhost:5000/api/updates/generate
Authorization: Bearer YOUR_TEACHER_TOKEN
```

---

## Automated Features

✅ **Auto-refresh every 6 hours** - New updates generated automatically  
✅ **Daily cleanup** - Old updates (>30 days) removed  
✅ **Startup check** - Generates initial updates if database is empty  
✅ **AI-powered** - Uses Gemini API to curate content  
✅ **Personalized** - Based on student's courses and profile  

---

## Troubleshooting

**No updates showing?**
- Check backend console for "✅ Generated X updates"
- Wait 10 seconds after server start
- Manually trigger: POST /api/updates/generate

**Widget not loading?**
- Check browser console for errors
- Verify you're logged in as student
- Refresh the page

**Categories not colored?**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

---

## File Locations

**Backend:**
- `backend/models/RealTimeUpdate.js` - Database model
- `backend/services/updateGeneratorService.js` - AI generation
- `backend/routes/updateRoutes.js` - API endpoints
- `backend/services/updateCronService.js` - Cron jobs

**Frontend:**
- `frontend/src/pages/student/RealTimeUpdates.jsx` - Main page
- `frontend/src/components/dashboard/TodaysHighlights.jsx` - Widget
- `frontend/src/App.jsx` - Route added
- `frontend/src/pages/dashboards/StudentDashboardNew.jsx` - Menu item

---

## That's It! 🎉

Your Real-Time Updates feature is ready to use. Students will love the personalized, AI-curated content!

**Questions?** Check `REALTIME_UPDATES_COMPLETE.md` for detailed documentation.
