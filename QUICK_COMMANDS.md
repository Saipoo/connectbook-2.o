# Quick Commands - CourseMaster Setup

## 🚀 Run Seeder to Add 25 Courses

```bash
# Navigate to backend directory
cd backend

# Run the seeder script
node seedCourses.js
```

**Expected Output:**
```
Found teacher: [Teacher Name] ([email])
Starting to seed courses...

✅ Successfully seeded 25 courses!

Courses by category:
  - Programming: 3 courses
  - Web Development: 3 courses
  - Data Science: 1 course
  ...

📚 Course seeding completed successfully!
```

---

## ✅ Complete Test Flow

### 1. **Seed Courses** (Run Once)
```bash
cd backend
node seedCourses.js
```

### 2. **Test as Student:**
```
1. Login as student
2. Dashboard → CourseMaster
3. Enroll in a course
4. Click "Continue Learning"
5. Watch all videos (click each one)
6. Progress reaches 100%
7. Click "Generate Certificate"
8. Download PDF
```

### 3. **Check Student Dashboard:**
```
1. Dashboard → Learning Dashboard
2. View your stats
3. See enrolled courses
4. Check progress bars
5. See achievement banner (if completed)
```

### 4. **Verify as Teacher:**
```
1. Login as teacher
2. Dashboard → Course Dashboard
3. Select course
4. Check "Enrolled Students" table
5. Verify completion status
6. Check "Certificates" table
```

---

## 🐛 Troubleshooting

### Issue: "No teacher found"
**Solution:**
```bash
# Create a teacher account first
# Then run seeder
```

### Issue: "Course not loading"
**Solution:**
```bash
# Check userId in localStorage
# Logout and login again
```

### Issue: "Progress not updating"
**Solution:**
```bash
# Make sure backend is running
# Check browser console for errors
# Refresh the page
```

---

## 📦 What Was Added

### Backend:
- ✅ Auto-completion logic (100% = completed)
- ✅ Seeder script with 25 courses
- ✅ Completion date tracking

### Frontend:
- ✅ Student Course Dashboard
- ✅ getUserId() helper function
- ✅ Progress tracking
- ✅ Achievement system

---

## 🎯 Quick Test Checklist

- [ ] Seeder runs successfully
- [ ] 25 courses appear in CourseMaster
- [ ] Can enroll in courses
- [ ] Can watch videos
- [ ] Progress updates automatically
- [ ] Course marks complete at 100%
- [ ] Certificate generates
- [ ] Student dashboard shows stats
- [ ] Teacher dashboard shows completion
- [ ] All navigation works

---

**All features ready! Start testing! 🎉**
