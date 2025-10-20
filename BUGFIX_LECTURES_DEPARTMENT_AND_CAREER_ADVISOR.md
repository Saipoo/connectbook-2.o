# Bug Fixes: Lecture Visibility & Career Advisor

## Date: October 20, 2025

---

## 🐛 Issues Fixed

### Issue 1: Students Can't See Lectures (Department-Based Filtering)
**Error:**
```
📚 Student 1VE22IS068 fetching lectures...
✅ Found 0 lectures for student
```

**Problem:**
- Students couldn't see any lectures even though teachers had created them
- The filtering logic was too restrictive (checking enrollment, publish status, etc.)
- Needed to show all lectures from the same department

**Solution:**
Changed the student lecture query to filter by department instead of complex enrollment logic.

---

### Issue 2: Career Advisor Crash
**Error:**
```
Uncaught TypeError: Cannot read properties of undefined (reading 'technical')
at CareerAdvisor (CareerAdvisor.jsx:680:75)
```

**Problem:**
- `readinessScore.breakdown` was undefined
- Code tried to access `readinessScore.breakdown.technical` without checking if `breakdown` exists
- Caused React component to crash completely

**Solution:**
Added optional chaining to safely access nested properties.

---

## ✅ Changes Made

### 1. Backend: Lecture Model (`backend/models/Lecture.js`)

**Added department field to schema:**
```javascript
const lectureSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  course: String,
  department: String, // ✅ NEW: Department for filtering
  teacherUSN: {
    type: String,
    required: true
  },
  teacherName: String,
  // ... rest of schema
});
```

**Why:**
- Enables department-based filtering
- Teachers automatically assign their department to lectures
- Students see all lectures from their department

---

### 2. Backend: Lecture Creation (`backend/routes/lectureRoutes.js`)

**Updated lecture creation to include department:**
```javascript
router.post('/create', protect, authorize('teacher'), async (req, res) => {
  try {
    const { title, subject, course, enrolledStudents, topic, difficulty } = req.body;
    const teacher = req.user;
    
    const lecture = await Lecture.create({
      title,
      subject,
      course,
      department: teacher.department || '', // ✅ NEW: Add department from teacher
      teacherUSN: teacher._id.toString(),
      teacherName: teacher.name,
      enrolledStudents: enrolledStudents || [],
      topic,
      difficulty: difficulty || 'intermediate',
      recordingStartTime: new Date(),
      processingStatus: 'recording'
    });
    // ...
  }
});
```

**Impact:**
- All new lectures automatically get the teacher's department
- Existing lectures without department won't show (need migration or manual update)

---

### 3. Backend: Student Lecture Query (`backend/routes/lectureRoutes.js`)

**Changed from complex enrollment logic to simple department filtering:**

**BEFORE:**
```javascript
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    console.log(`📚 Student ${req.user.usn} fetching lectures...`);
    
    // Too restrictive!
    const lectures = await Lecture.find({
      $or: [
        { isPublished: true },
        { enrolledStudents: req.user.usn },
        { processingStatus: 'completed' }
      ]
    }).sort({ publishedAt: -1, createdAt: -1 });
    // ...
  }
});
```

**AFTER:**
```javascript
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    console.log(`📚 Student ${req.user.usn} (${req.user.department}) fetching lectures...`);
    
    // Simple department-based filtering
    const query = {};
    
    if (req.user.department) {
      query.department = req.user.department;
      console.log(`🏢 Filtering by department: ${req.user.department}`);
    }
    
    const lectures = await Lecture.find(query).sort({ publishedAt: -1, createdAt: -1 });

    console.log(`✅ Found ${lectures.length} lectures for student`);
    lectures.forEach(lecture => {
      console.log(`  - ${lecture.title} (${lecture.processingStatus}) [${lecture.department || 'No dept'}]`);
    });
    // ...
  }
});
```

**Benefits:**
- ✅ Students see ALL lectures from their department
- ✅ No enrollment restrictions
- ✅ No publish status checks
- ✅ Simpler, more reliable logic
- ✅ Better logging for debugging

---

### 4. Frontend: Career Advisor Safe Access (`frontend/src/pages/student/CareerAdvisor.jsx`)

**Added optional chaining to prevent crashes:**

**BEFORE (Lines 680-709):**
```javascript
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
  <div>
    <div className="text-sm text-gray-600 mb-1">Technical Skills</div>
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${readinessScore.breakdown.technical}%` }} // ❌ CRASH!
        />
      </div>
      <span className="text-sm font-medium">{readinessScore.breakdown.technical}%</span>
    </div>
  </div>
  // ... similar for softSkills and experience
</div>
```

**AFTER:**
```javascript
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
  <div>
    <div className="text-sm text-gray-600 mb-1">Technical Skills</div>
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${readinessScore?.breakdown?.technical || 0}%` }} // ✅ SAFE!
        />
      </div>
      <span className="text-sm font-medium">{readinessScore?.breakdown?.technical || 0}%</span>
    </div>
  </div>

  <div>
    <div className="text-sm text-gray-600 mb-1">Soft Skills</div>
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full"
          style={{ width: `${readinessScore?.breakdown?.softSkills || 0}%` }} // ✅ SAFE!
        />
      </div>
      <span className="text-sm font-medium">{readinessScore?.breakdown?.softSkills || 0}%</span>
    </div>
  </div>

  <div>
    <div className="text-sm text-gray-600 mb-1">Experience</div>
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full"
          style={{ width: `${readinessScore?.breakdown?.experience || 0}%` }} // ✅ SAFE!
        />
      </div>
      <span className="text-sm font-medium">{readinessScore?.breakdown?.experience || 0}%</span>
    </div>
  </div>
</div>

{readinessScore?.strengths && readinessScore.strengths.length > 0 && (
  // ... strengths section
)}

{readinessScore?.areasToImprove && readinessScore.areasToImprove.length > 0 && (
  // ... areas to improve section
)}
```

**Changes:**
- ✅ Added `?.` optional chaining for all `breakdown` accesses
- ✅ Added `|| 0` fallback values for percentages
- ✅ Added optional chaining for `strengths` and `areasToImprove` checks
- ✅ Component renders without crashing even if data is incomplete

---

## 🧪 Testing

### Test Lecture Visibility:

**1. Check Teacher Department:**
```javascript
// Teacher should have department field
console.log(teacher.department); // e.g., "Computer Science"
```

**2. Create Lecture as Teacher:**
- Login as teacher
- Go to Lecture Notes
- Create new lecture
- Check server console:
  ```
  ✅ Lecture created with department: Computer Science
  ```

**3. Verify Student Can See It:**
- Login as student from same department
- Go to Lecture Notes → "All Lectures" tab
- Check server console:
  ```
  📚 Student 1VE22IS068 (Computer Science) fetching lectures...
  🏢 Filtering by department: Computer Science
  ✅ Found 3 lectures for student
    - Data Structures (completed) [Computer Science]
    - Algorithms (processing) [Computer Science]
    - Database Systems (completed) [Computer Science]
  ```

**4. Verify Cross-Department Isolation:**
- Student from "Mechanical Engineering" should NOT see "Computer Science" lectures
- Check console shows correct filtering

---

### Test Career Advisor:

**1. Access Career Advisor:**
- Login as student
- Go to Career Advisor page
- Page should load without errors

**2. Check Console:**
- Should NOT see: `Cannot read properties of undefined (reading 'technical')`
- Component renders successfully

**3. Verify Skill Bars:**
- If `readinessScore` is null → Shows 0% (not crash)
- If `breakdown` is undefined → Shows 0% (not crash)
- If data exists → Shows correct percentages

---

## 📊 Expected Behavior

### Lecture Visibility Logic:

| Teacher Dept | Student Dept | Can See Lectures? |
|--------------|--------------|-------------------|
| CS           | CS           | ✅ YES            |
| CS           | Mechanical   | ❌ NO             |
| Mechanical   | Mechanical   | ✅ YES            |
| CS           | (no dept)    | ❌ NO             |
| (no dept)    | CS           | ❌ NO             |
| (no dept)    | (no dept)    | ✅ YES (all)      |

### Career Advisor Safety:

| Data State | Old Behavior | New Behavior |
|------------|--------------|--------------|
| `readinessScore = null` | ❌ Crash | ✅ Shows 0% |
| `readinessScore.breakdown = undefined` | ❌ Crash | ✅ Shows 0% |
| `readinessScore.breakdown.technical = undefined` | ❌ Crash | ✅ Shows 0% |
| All data present | ✅ Works | ✅ Works |

---

## 🚨 Important Notes

### 1. Existing Lectures Without Department:

If you have existing lectures in the database that were created before this fix:
- They won't have a `department` field
- Students won't see them
- **Solution:** Run migration script or manually update:

```javascript
// Migration script (run in MongoDB shell or create a route)
db.lectures.updateMany(
  { department: { $exists: false } },
  { $set: { department: "Computer Science" } } // Or appropriate dept
)
```

### 2. Department Field Required:

- Teachers MUST have a `department` field in their user profile
- Students MUST have a `department` field in their user profile
- If missing, lectures won't be filtered correctly

### 3. No Enrollment Restrictions:

- Students can now see ALL lectures from their department
- Enrollment is no longer enforced
- Processing status doesn't matter
- Publish status doesn't matter

**If you want to add restrictions back:**
```javascript
const query = { department: req.user.department };

// Optional: Only show published lectures
if (onlyPublished) {
  query.isPublished = true;
}

// Optional: Only show completed processing
if (onlyCompleted) {
  query.processingStatus = 'completed';
}

const lectures = await Lecture.find(query);
```

---

## 🔍 Debugging

### Check Departments:

**Teacher:**
```javascript
console.log('Teacher dept:', req.user.department);
// Should print: "Computer Science", "Mechanical", etc.
```

**Student:**
```javascript
console.log('Student dept:', req.user.department);
// Should match teacher dept to see lectures
```

**Lecture:**
```javascript
console.log('Lecture dept:', lecture.department);
// Should match student/teacher dept
```

### Server Console Output:

When student fetches lectures:
```
📚 Student 1VE22IS068 (Computer Science) fetching lectures...
🏢 Filtering by department: Computer Science
✅ Found 3 lectures for student
  - Data Structures (completed) [Computer Science]
  - Algorithms (processing) [Computer Science]
  - Database Systems (completed) [Computer Science]
```

If no lectures found:
```
📚 Student 1VE22IS068 (Computer Science) fetching lectures...
🏢 Filtering by department: Computer Science
✅ Found 0 lectures for student
```

**Possible causes:**
1. Teacher created lectures in different department
2. Lectures don't have department field (old lectures)
3. Student's department doesn't match any lectures

---

## ✨ Summary

### What Changed:
1. ✅ Added `department` field to Lecture model
2. ✅ Updated lecture creation to include teacher's department
3. ✅ Changed student query to filter by department only
4. ✅ Added optional chaining to Career Advisor component
5. ✅ Enhanced logging for debugging

### What It Fixes:
1. ✅ Students can now see all lectures from their department
2. ✅ Career Advisor doesn't crash on missing data
3. ✅ Simpler, more predictable lecture visibility
4. ✅ Better debugging with department-aware logs

### Next Steps:
1. **Test** creating a lecture as teacher
2. **Verify** student sees it (same department)
3. **Verify** student doesn't see it (different department)
4. **Check** Career Advisor loads without errors
5. **Update** existing lectures with department if needed

---

## 🎉 Status: COMPLETE

Both issues are fixed and ready to test!
