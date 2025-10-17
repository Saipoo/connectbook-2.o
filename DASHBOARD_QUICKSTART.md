# 🚀 Dashboard Quick Start Guide

## 📦 What's New?

✨ **Unified Dashboard System** with sidebar navigation for Student, Teacher, and Parent roles!

---

## 🏃 Quick Start

### **1. Restart Frontend** (if running)
```bash
cd frontend
npm run dev
```

### **2. Restart Backend** (if running)
```bash
cd backend
npm start
```

---

## 🔗 Access New Dashboards

### **Student Dashboard:**
```
http://localhost:5173/dashboard/student/v2
```
**Features:**
- Sidebar with 9 menu items
- Attendance %, Courses, Certificates stats
- Recent activity feed
- Quick actions (Mark Attendance, Browse Courses, etc.)

### **Teacher Dashboard:**
```
http://localhost:5173/dashboard/teacher/v2
```
**Features:**
- Course management
- Student progress tracking
- Pending submission alerts
- Quick course creation

### **Parent Dashboard:**
```
http://localhost:5173/dashboard/parent/v2
```
**Features:**
- Linked student's attendance
- Grade reports with AI feedback
- Course completion status
- Certificate viewer

### **Certificates Page:**
```
http://localhost:5173/dashboard/student/certificates
```
**Features:**
- Unified view of all certificates
- Filter by CourseMaster / GradeMaster
- Search functionality
- View & Download options

---

## 🎯 Key Features

### **Collapsible Sidebar**
- **Desktop:** Click arrow button to collapse (280px → 80px)
- **Mobile:** Hamburger menu with slide-in drawer
- **Active Route:** Blue gradient highlight
- **Icons:** All menu items have icons

### **Theme Toggle**
- Light/Dark mode switch in sidebar footer
- Persists across sessions

### **Stats Cards**
- Click any stat card to navigate to details
- Hover effect: Slight scale animation
- Color-coded by category

### **Quick Actions**
- One-click access to common tasks
- Gradient backgrounds
- Icon + label design

---

## 🧪 Testing Checklist

### **Student Dashboard:**
- [ ] Login as student
- [ ] Navigate to `/dashboard/student/v2`
- [ ] Check if sidebar shows all menu items
- [ ] Verify attendance % is correct
- [ ] Click "Browse Courses" quick action
- [ ] Check certificates page link works
- [ ] Toggle theme (light/dark)
- [ ] Collapse/expand sidebar

### **Teacher Dashboard:**
- [ ] Login as teacher
- [ ] Navigate to `/dashboard/teacher/v2`
- [ ] Verify course count matches
- [ ] Check pending submissions badge
- [ ] Click "Create Course" quick action
- [ ] Verify recent submissions list

### **Parent Dashboard:**
- [ ] Login as parent (must have studentUSN linked)
- [ ] Navigate to `/dashboard/parent/v2`
- [ ] Verify student name and USN display
- [ ] Check attendance % matches student's
- [ ] View grade reports
- [ ] Check certificates section

### **Certificates Page:**
- [ ] Navigate to `/dashboard/student/certificates`
- [ ] Verify all certificates load
- [ ] Test filter buttons (All/Course/Grade)
- [ ] Test search functionality
- [ ] Click "View" button
- [ ] Click "Download" button

---

## 🔧 Common Issues

### **"No linked student found" (Parent Dashboard)**
**Solution:** Parent must have `studentUSN` field set in database:
```javascript
// In MongoDB or via API
db.parents.updateOne(
  { email: "parent@example.com" },
  { $set: { studentUSN: "1MS21CS001" } }
)
```

### **Stats showing 0**
**Solution:** 
1. Check if user has data in database
2. Verify API endpoints are working (check Network tab)
3. Ensure authentication token is valid

### **Sidebar not responsive**
**Solution:**
1. Clear browser cache
2. Check console for errors
3. Verify Framer Motion is installed: `npm install framer-motion`

### **Certificates not loading**
**Solution:**
1. Complete at least one course (50%+ quiz score)
2. Check `/api/courses/my-certificates` endpoint
3. Verify certificate PDFs are generated

---

## 📱 Mobile Testing

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Pixel, etc.)
4. Test:
   - [ ] Hamburger menu opens sidebar
   - [ ] Sidebar slides in from left
   - [ ] Close button works
   - [ ] Menu items navigate correctly
   - [ ] Stats cards stack vertically
   - [ ] Quick actions grid responsive

---

## 🎨 Customization

### **Change Sidebar Width:**
```jsx
// In DashboardLayout.jsx, line 91:
animate={{ width: sidebarOpen ? 320 : 80 }}  // Default: 280
```

### **Add New Menu Item:**
```jsx
// In StudentDashboardNew.jsx (or any dashboard):
const menuItems = [
  // ... existing items
  { icon: Star, label: 'New Feature', path: '/dashboard/student/new-feature' }
];
```

### **Change Color Scheme:**
```jsx
// Update gradient classes:
// From: from-blue-500 to-purple-600
// To:   from-green-500 to-teal-600
```

---

## 🚀 Go Live

Once testing is complete, replace old dashboards:

### **Step 1: Update App.jsx**
```jsx
// Replace:
<Route path="/dashboard/student" element={<StudentDashboard />} />

// With:
<Route path="/dashboard/student" element={<StudentDashboardNew />} />

// Do the same for teacher and parent
```

### **Step 2: Remove "/v2" Routes**
```jsx
// Delete these routes:
<Route path="/dashboard/student/v2" element={<StudentDashboardNew />} />
<Route path="/dashboard/teacher/v2" element={<TeacherDashboardNew />} />
<Route path="/dashboard/parent/v2" element={<ParentDashboardNew />} />
```

### **Step 3: Update Login Redirect**
```jsx
// In Login.jsx, change redirect path:
navigate('/dashboard/student');  // Already correct
```

---

## 📊 Performance Tips

### **Lazy Load Dashboards:**
```jsx
// In App.jsx:
const StudentDashboardNew = lazy(() => import('./pages/dashboards/StudentDashboardNew'));

// Wrap routes with Suspense:
<Suspense fallback={<LoadingSpinner />}>
  <StudentDashboardNew />
</Suspense>
```

### **Cache API Responses:**
```jsx
// Add React Query or SWR:
npm install @tanstack/react-query

// In dashboard:
const { data, isLoading } = useQuery('attendance', fetchAttendance);
```

### **Optimize Images:**
- Use WebP format for profile pictures
- Lazy load certificate thumbnails
- Add loading skeletons

---

## 📝 Next Steps

1. ✅ Test all three dashboards
2. ✅ Test certificates page
3. ✅ Test parent-student linking
4. ✅ Verify API endpoints work
5. ✅ Test on mobile devices
6. 🔄 Replace old dashboards
7. 🔄 Deploy to production

---

## 🆘 Need Help?

Check the comprehensive guide:
- **Full Documentation:** `DASHBOARD_INTEGRATION_GUIDE.md`
- **API Reference:** Backend routes in `backend/routes/`
- **Component Code:** `frontend/src/components/DashboardLayout.jsx`

---

## ✅ Summary

**Files Created:**
- `DashboardLayout.jsx` - Reusable sidebar
- `StudentDashboardNew.jsx` - Student dashboard
- `TeacherDashboardNew.jsx` - Teacher dashboard
- `ParentDashboardNew.jsx` - Parent dashboard
- `CertificatesPage.jsx` - Certificates viewer
- `parentRoutes.js` - Parent API endpoints

**Files Modified:**
- `App.jsx` - Added new routes
- `server.js` - Added parent routes

**Routes Added:**
- `/dashboard/student/v2`
- `/dashboard/teacher/v2`
- `/dashboard/parent/v2`
- `/dashboard/student/certificates`
- `/dashboard/parent/certificates`
- `/api/parents/my-student`
- `/api/parents/student/:usn/attendance`

---

**Ready to test!** 🎉

Navigate to the new dashboards and explore the features!
