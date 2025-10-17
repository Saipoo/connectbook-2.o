# Quick Test Guide - CourseMaster Dashboard & Student Features

## 🚀 Quick Start Testing

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- At least one teacher account
- At least one student account
- At least one published course with content

---

## Test 1: Student - Continue Learning (2 min)

### Setup:
1. Login as student
2. Go to CourseMaster page

### Test Steps:
```
1. Find a course you're enrolled in
2. Click the "Continue Learning" button (green with play icon)
3. ✅ VERIFY: Course detail page loads
4. ✅ VERIFY: Progress bar shows your current progress percentage
5. ✅ VERIFY: Video list appears on the right sidebar
6. ✅ VERIFY: Watched videos have green checkmarks
7. ✅ VERIFY: Resources section shows downloadable files
8. Click on any video in the sidebar
9. ✅ VERIFY: Video player loads and starts playing
```

### Expected Results:
- ✅ Course loads within 1-2 seconds
- ✅ All course content visible
- ✅ Progress tracking works
- ✅ No console errors

### If It Fails:
- Check browser console for errors
- Verify `localStorage` contains `token` and `userId`
- Check network tab - should see successful calls to:
  - `GET /api/courses/:courseId`
  - `GET /api/courses/progress/:userId`

---

## Test 2: Student - Certificate Generation (3 min)

### Setup:
1. Login as student
2. Complete ALL videos in a course (100% progress)
3. Complete the course quiz with any score

### Test Steps:
```
1. Open the completed course (click "Review Course")
2. Scroll to top of course detail page
3. ✅ VERIFY: "Generate Certificate" button appears (green with award icon)
4. Click "Generate Certificate"
5. Wait 2-3 seconds
6. ✅ VERIFY: Certificate modal opens full-screen
7. ✅ VERIFY: Certificate shows:
   - Your name
   - Course title
   - Completion date
   - Teacher signature
8. Click "Download Certificate" button
9. ✅ VERIFY: PDF downloads to your computer
10. Open downloaded PDF
11. ✅ VERIFY: PDF is properly formatted and readable
```

### Expected Results:
- ✅ Certificate generates successfully
- ✅ Modal displays certificate preview
- ✅ Download works (PDF file saved)
- ✅ Button changes to "View Certificate" after first generation

### If It Fails:
- Check if course is 100% completed
- Verify quiz was submitted
- Check backend logs for PDF generation errors
- Verify `/uploads/courses/certificates/` folder exists

---

## Test 3: Teacher - Access Dashboard (1 min)

### Setup:
1. Login as teacher
2. Create at least one course (if none exists)

### Test Steps (Method 1 - Main Dashboard):
```
1. Go to Teacher Dashboard
2. Scroll down to feature cards
3. ✅ VERIFY: "Course Dashboard" card visible (purple/pink gradient)
4. Click "Course Dashboard"
5. ✅ VERIFY: Redirects to dashboard page
6. ✅ VERIFY: URL is /dashboard/teacher/course-dashboard
```

### Test Steps (Method 2 - Course Creator):
```
1. Go to Course Creator page
2. Look at header buttons (top right area)
3. ✅ VERIFY: "View Dashboard" button visible (purple/pink gradient)
4. Click "View Dashboard"
5. ✅ VERIFY: Redirects to dashboard page
```

### Expected Results:
- ✅ Both navigation paths work
- ✅ Dashboard loads within 1-2 seconds
- ✅ Course selector dropdown shows your courses

---

## Test 4: Teacher - View Stats (2 min)

### Setup:
1. In Course Dashboard
2. Have at least one course with enrollments

### Test Steps:
```
1. Select a course from dropdown
2. Wait for data to load
3. ✅ VERIFY: 4 stats cards appear:
   - Total Enrolled (blue icon)
   - Completed (green icon)
   - Completion Rate (purple icon)
   - Avg Progress (yellow icon)
4. ✅ VERIFY: Numbers match actual data
5. Calculate manually:
   - Completion Rate = (Completed / Total Enrolled) × 100
6. ✅ VERIFY: Percentage matches calculation
```

### Expected Results:
- ✅ Stats cards display correct numbers
- ✅ Completion rate calculated correctly
- ✅ Average progress makes sense (0-100%)

### Quick Sanity Check:
- If 5 students enrolled, 2 completed = 40% completion rate ✅
- If 5 students with progress [100, 80, 60, 40, 20] = 60% average ✅

---

## Test 5: Teacher - Enrolled Students Table (3 min)

### Setup:
1. In Course Dashboard
2. Select course with enrollments

### Test Steps:
```
1. Scroll to "Enrolled Students" section
2. ✅ VERIFY: Table shows all enrolled students
3. ✅ VERIFY: Columns display correctly:
   - USN
   - Name
   - Enrolled Date (formatted like "Jan 15, 2024")
   - Progress (bar + percentage)
   - Status (badge)
   - Last Accessed
4. Check progress bars:
   ✅ VERIFY: Bar width matches percentage
   ✅ VERIFY: Color changes based on progress:
      - Green = 80%+
      - Yellow = 50-79%
      - Blue = 0-49%
5. Check status badges:
   ✅ VERIFY: "Completed" badge for 100% progress (green)
   ✅ VERIFY: "In Progress" badge for <100% (blue)
6. Hover over rows
   ✅ VERIFY: Row highlights on hover
```

### Expected Results:
- ✅ All students listed correctly
- ✅ Progress bars accurate
- ✅ Status badges correct
- ✅ Dates formatted properly
- ✅ Smooth hover animations

---

## Test 6: Teacher - Certificates Table (3 min)

### Setup:
1. In Course Dashboard
2. Select course where students completed and generated certificates

### Test Steps:
```
1. Scroll to "Course Completions & Certificates" section
2. ✅ VERIFY: Table shows all issued certificates
3. ✅ VERIFY: Columns display correctly:
   - Certificate ID (monospace font)
   - USN
   - Name
   - Completion Date
   - Quiz Score (with badge)
   - Grade badge
   - Action (View link)
4. Check quiz score badges:
   ✅ VERIFY: Color matches score:
      - Green = 90%+
      - Blue = 75-89%
      - Yellow = 60-74%
      - Red = <60%
5. Click "View" link on any certificate
   ✅ VERIFY: Opens in new tab
   ✅ VERIFY: PDF displays correctly
6. Close PDF tab
7. Try downloading PDF (right-click → Save As)
   ✅ VERIFY: PDF saves successfully
```

### Expected Results:
- ✅ All certificates listed
- ✅ Quiz scores calculated correctly
- ✅ Grade badges colored appropriately
- ✅ PDF links work
- ✅ PDFs downloadable

---

## Test 7: Course Switching (1 min)

### Setup:
1. In Course Dashboard
2. Have at least 2 courses created

### Test Steps:
```
1. Note current stats (Total Enrolled, Completed, etc.)
2. Change course in dropdown selector
3. Wait 1-2 seconds
4. ✅ VERIFY: Stats update to new course
5. ✅ VERIFY: Enrollments table refreshes
6. ✅ VERIFY: Certificates table refreshes
7. Switch back to first course
8. ✅ VERIFY: Original stats reappear
```

### Expected Results:
- ✅ Instant course switching
- ✅ Data updates correctly
- ✅ No data mixing between courses

---

## Test 8: Empty States (2 min)

### Setup:
1. Create a brand new course
2. Don't publish it or add enrollments

### Test Steps:
```
1. Go to Course Dashboard
2. Select the new course
3. ✅ VERIFY: Stats show zeros:
   - Total Enrolled: 0
   - Completed: 0
   - Completion Rate: 0%
   - Avg Progress: 0%
4. ✅ VERIFY: Enrollments table shows:
   "No students enrolled yet"
5. ✅ VERIFY: Certificates table shows:
   "No certificates issued yet"
6. ✅ VERIFY: No error messages in console
```

### Expected Results:
- ✅ Empty states display gracefully
- ✅ No crashes or errors
- ✅ User-friendly messages

---

## Test 9: Navigation Flow (2 min)

### Test the complete navigation loop:

```
1. Start at Teacher Dashboard
   ↓
2. Click "Course Dashboard" card
   ↓ (redirects to /dashboard/teacher/course-dashboard)
3. Click "Back to Course Creator" button
   ↓ (redirects to /dashboard/teacher/course-creator)
4. Click "View Dashboard" button
   ↓ (back to /dashboard/teacher/course-dashboard)
5. Use browser back button
   ↓ (back to /dashboard/teacher/course-creator)
6. Click browser forward button
   ↓ (back to /dashboard/teacher/course-dashboard)
```

### ✅ Verify:
- All navigation works smoothly
- No infinite loops
- Browser history works correctly
- No layout shifts or flashing

---

## Test 10: Responsive Design (2 min)

### Test Steps:
```
1. Open Course Dashboard
2. Press F12 to open DevTools
3. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
4. Select "iPad" (768px width)
   ✅ VERIFY: Stats cards stack 2x2
   ✅ VERIFY: Tables remain scrollable horizontally
5. Select "iPhone 12" (390px width)
   ✅ VERIFY: Stats cards stack vertically (1 per row)
   ✅ VERIFY: Tables scroll horizontally
   ✅ VERIFY: Course selector full width
6. Select "Desktop" (1920px)
   ✅ VERIFY: Stats cards display 4 in a row
   ✅ VERIFY: Tables use full width
```

### Expected Results:
- ✅ Mobile: Cards stack vertically
- ✅ Tablet: Cards in 2 columns
- ✅ Desktop: Cards in 4 columns
- ✅ Tables always scrollable on small screens
- ✅ No horizontal overflow

---

## 🐛 Common Issues & Fixes

### Issue 1: "Continue Learning" doesn't load course
**Symptoms:** Blank page, no course content
**Fix:** 
- Check localStorage has `userId`: `localStorage.getItem('userId')`
- If missing, logout and login again
- Verify enrollment exists in database

### Issue 2: Dashboard shows wrong stats
**Symptoms:** Numbers don't match actual enrollments
**Fix:**
- Refresh page (Ctrl+R)
- Check course is selected correctly
- Verify backend route authorization (check if teacher owns course)

### Issue 3: Certificate won't generate
**Symptoms:** Button does nothing or shows error
**Fix:**
- Verify course is 100% completed
- Check quiz is submitted
- Verify backend certificate service is running
- Check `/uploads/courses/certificates/` folder permissions

### Issue 4: Dashboard blank or won't load
**Symptoms:** White screen, no content
**Fix:**
- Check console for errors
- Verify token in localStorage
- Check backend is running on port 5000
- Verify route exists in App.jsx

### Issue 5: Tables empty despite having data
**Symptoms:** "No students enrolled" but enrollments exist
**Fix:**
- Check browser network tab for failed API calls
- Verify courseId is correct in URL
- Check backend logs for authorization errors
- Ensure teacher owns the selected course

---

## ✅ Test Checklist

Use this checklist to verify all features:

### Student Side:
- [ ] Can access CourseMaster page
- [ ] Can see enrolled courses with "Continue Learning" button
- [ ] Can click "Continue Learning" and course loads
- [ ] Progress bar shows correct percentage
- [ ] Video list displays with watched status
- [ ] Can play videos
- [ ] Resources are downloadable
- [ ] Quiz is accessible (if available)
- [ ] "Generate Certificate" button appears when completed
- [ ] Certificate generates successfully
- [ ] Certificate modal opens
- [ ] Certificate can be downloaded
- [ ] Downloaded PDF is valid and readable

### Teacher Side:
- [ ] Can access dashboard from Teacher Dashboard
- [ ] Can access dashboard from Course Creator
- [ ] Course selector shows all teacher's courses
- [ ] Stats cards display correct numbers
- [ ] Completion rate calculates correctly
- [ ] Average progress makes sense
- [ ] Enrolled students table shows all students
- [ ] Progress bars match percentages
- [ ] Status badges correct (In Progress / Completed)
- [ ] Certificates table shows all certificates
- [ ] Quiz scores display correctly
- [ ] Grade badges colored appropriately
- [ ] Certificate download links work
- [ ] Course switching updates data
- [ ] Empty states display properly
- [ ] Navigation buttons work
- [ ] Responsive design works on mobile/tablet

---

## 🎯 Performance Benchmarks

### Expected Load Times:
- Dashboard initial load: < 2 seconds
- Course switching: < 1 second
- Table rendering: < 500ms
- API calls: < 300ms each

### If Slower:
- Check network speed
- Verify backend is not throttled
- Consider pagination for large datasets
- Check MongoDB indexes exist

---

## 📞 Support

### If Issues Persist:
1. Check all files are saved
2. Restart frontend dev server: `npm run dev`
3. Restart backend: `npm start`
4. Clear browser cache (Ctrl+Shift+Delete)
5. Check MongoDB connection
6. Review documentation: `COURSEMASTER_DASHBOARD_COMPLETE.md`

### Quick Debug Commands:
```bash
# Check frontend build
cd frontend && npm run build

# Check backend logs
cd backend && npm start

# Check MongoDB connection
mongosh "mongodb://localhost:27017/connectbook"
```

---

**Happy Testing! 🎉**
