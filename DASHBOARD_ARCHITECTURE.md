# 📊 ConnectBook Dashboard System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONNECTBOOK PLATFORM                               │
│                     Unified Dashboard Integration                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   STUDENT ROLE   │    │   TEACHER ROLE   │    │   PARENT ROLE    │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DashboardLayout                                    │
│  ┌────────────────────┐  ┌──────────────────────────────────────────────┐  │
│  │   SIDEBAR MENU     │  │           MAIN CONTENT AREA                  │  │
│  │                    │  │                                              │  │
│  │  📱 Collapsible    │  │  ┌────────────────────────────────────┐     │  │
│  │  🎨 Theme Toggle   │  │  │      Welcome Banner                │     │  │
│  │  🔔 Badges         │  │  └────────────────────────────────────┘     │  │
│  │  ✨ Active Routes  │  │                                              │  │
│  │                    │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │  │
│  │  ┌──────────────┐  │  │  │ Stat │ │ Stat │ │ Stat │ │ Stat │       │  │
│  │  │  Menu Items  │  │  │  │ Card │ │ Card │ │ Card │ │ Card │       │  │
│  │  │              │  │  │  └──────┘ └──────┘ └──────┘ └──────┘       │  │
│  │  │  - Profile   │  │  │                                              │  │
│  │  │  - Feature 1 │  │  │  ┌────────────────────────────────────┐     │  │
│  │  │  - Feature 2 │  │  │  │     Recent Activities              │     │  │
│  │  │  - Feature 3 │  │  │  │  - Activity 1                      │     │  │
│  │  │  - Settings  │  │  │  │  - Activity 2                      │     │  │
│  │  │  - Logout    │  │  │  │  - Activity 3                      │     │  │
│  │  └──────────────┘  │  │  └────────────────────────────────────┘     │  │
│  │                    │  │                                              │  │
│  └────────────────────┘  │  ┌────────────────────────────────────┐     │  │
│                          │  │     Quick Actions                  │     │  │
│                          │  │  [Action 1] [Action 2] [Action 3]  │     │  │
│                          │  └────────────────────────────────────┘     │  │
│                          └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Student Dashboard Flow

```
┌──────────────────┐
│  Student Login   │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│  /dashboard/student/v2          │
│  StudentDashboardNew            │
└────────┬────────────────────────┘
         │
         ├─── Fetch Attendance ───────→ GET /api/attendance/my-attendance
         │
         ├─── Fetch Courses ─────────→ GET /api/courses/my-enrollments
         │
         └─── Fetch Certificates ────→ GET /api/courses/my-certificates
                │
                ▼
         ┌─────────────────┐
         │  Display Stats  │
         │  - Attendance%  │
         │  - Courses      │
         │  - Certificates │
         └─────────────────┘
                │
                ▼
         ┌──────────────────────┐
         │  Sidebar Navigation  │
         │  - Mark Attendance   │ ──→ /dashboard/student/mark-attendance
         │  - View Courses      │ ──→ /dashboard/student/course-master
         │  - Certificates      │ ──→ /dashboard/student/certificates
         │  - Mentor Connect    │ ──→ /mentor-connect
         └──────────────────────┘
```

## Teacher Dashboard Flow

```
┌──────────────────┐
│  Teacher Login   │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│  /dashboard/teacher/v2          │
│  TeacherDashboardNew            │
└────────┬────────────────────────┘
         │
         ├─── Fetch Courses ──────────→ GET /api/courses/teacher/my-courses
         │
         └─── Fetch Submissions ─────→ GET /api/grades/teacher/submissions
                │
                ▼
         ┌─────────────────────┐
         │   Display Stats     │
         │   - Courses Created │
         │   - Enrollments     │
         │   - Pending Reviews │ 🔔 Badge
         └─────────────────────┘
                │
                ▼
         ┌──────────────────────┐
         │  Sidebar Navigation  │
         │  - Create Course     │ ──→ /dashboard/teacher/course-creator
         │  - Verify Grades     │ ──→ /dashboard/teacher/grade-evaluator
         │  - View Attendance   │ ──→ /dashboard/teacher/attendance-logs
         └──────────────────────┘
```

## Parent Dashboard Flow

```
┌──────────────────┐
│   Parent Login   │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│  /dashboard/parent/v2           │
│  ParentDashboardNew             │
└────────┬────────────────────────┘
         │
         ├─── Fetch Student ──────────→ GET /api/parents/my-student
         │                                    │
         │                                    ▼
         │                             ┌──────────────┐
         │                             │  Student USN │
         │                             │  "1MS21CS001"│
         │                             └──────┬───────┘
         │                                    │
         ├─── Fetch Attendance ───────────────┴─→ GET /api/attendance/student/:usn
         │
         ├─── Fetch Grades ──────────────────────→ GET /api/grades/student/:id/results
         │
         ├─── Fetch Courses ─────────────────────→ GET /api/courses/student/:id/enrollments
         │
         └─── Fetch Certificates ────────────────→ GET /api/courses/student/:id/certificates
                │
                ▼
         ┌──────────────────────┐
         │   Display Student    │
         │   - Name & USN       │
         │   - Attendance %     │
         │   - Grades (avg)     │
         │   - Courses          │
         │   - Certificates     │
         └──────────────────────┘
                │
                ▼
         ┌──────────────────────┐
         │  Sidebar Navigation  │
         │  - View Attendance   │ ──→ /dashboard/parent/attendance
         │  - Check Grades      │ ──→ /dashboard/parent/grade-viewer
         │  - View Certificates │ ──→ /dashboard/parent/certificates
         │  - Message Teacher   │ ──→ /mentor-connect
         └──────────────────────┘
```

## Certificates Page Flow

```
┌──────────────────────────────────┐
│  /dashboard/student/certificates │
│  CertificatesPage                │
└────────┬─────────────────────────┘
         │
         ├─── Fetch Course Certs ────→ GET /api/courses/my-certificates
         │
         └─── Fetch Grade Certs ─────→ GET /api/grades/my-certificates
                │
                ▼
         ┌──────────────────────┐
         │  Combine & Tag       │
         │  - CourseMaster: 5   │
         │  - GradeMaster: 3    │
         └──────┬───────────────┘
                │
                ▼
         ┌──────────────────────┐
         │  Display Features    │
         │  - Search Bar        │
         │  - Filter Buttons    │
         │  - Certificate Grid  │
         │  - View/Download     │
         └──────────────────────┘
```

## Data Models

```
┌─────────────────┐        ┌─────────────────┐
│     Student     │        │     Teacher     │
├─────────────────┤        ├─────────────────┤
│ _id             │        │ _id             │
│ name            │        │ name            │
│ usn             │◄───┐   │ email           │
│ email           │    │   │ department      │
│ department      │    │   └─────────────────┘
└─────────────────┘    │
                       │
                       │
┌─────────────────┐    │
│     Parent      │    │
├─────────────────┤    │
│ _id             │    │
│ name            │    │
│ email           │    │
│ studentUSN      │────┘  🔗 Links to Student.usn
└─────────────────┘


┌─────────────────────────┐
│   CourseEnrollment      │
├─────────────────────────┤
│ _id                     │
│ studentId ──────────────┼─→ Student._id
│ courseId ───────────────┼─→ Course._id
│ completed (boolean)     │
│ overallProgress (%)     │
│ quizAttempts []         │
│ completionDate          │
└─────────────────────────┘


┌─────────────────────────┐
│   Certificate           │
├─────────────────────────┤
│ _id                     │
│ studentId ──────────────┼─→ Student._id
│ courseId ───────────────┼─→ Course._id
│ courseName              │
│ certificateUrl          │
│ issueDate               │
│ certificateId (unique)  │
└─────────────────────────┘


┌─────────────────────────┐
│   AttendanceLog         │
├─────────────────────────┤
│ _id                     │
│ studentUSN ─────────────┼─→ Student.usn
│ subject                 │
│ status (present/absent) │
│ date                    │
│ method (face/qr)        │
└─────────────────────────┘
```

## API Endpoint Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Endpoints                     │
└─────────────────────────────────────────────────────────────┘

Authentication Layer
├── POST /api/auth/login
├── POST /api/auth/register
└── POST /api/auth/logout

Attendance Routes
├── GET  /api/attendance/my-attendance          (Student)
├── GET  /api/attendance/student/:usn           (Parent/Teacher)
└── POST /api/attendance/mark                   (Student)

Course Routes
├── GET  /api/courses/my-enrollments            (Student)
├── GET  /api/courses/my-certificates           (Student)
├── GET  /api/courses/teacher/my-courses        (Teacher)
├── GET  /api/courses/student/:id/enrollments   (Parent)
└── GET  /api/courses/student/:id/certificates  (Parent)

Grade Routes
├── GET  /api/grades/teacher/submissions        (Teacher)
├── GET  /api/grades/student/:id/results        (Parent)
└── GET  /api/grades/my-certificates            (Student)

Parent Routes (NEW)
├── GET  /api/parents/my-student                (Parent)
└── GET  /api/parents/student/:usn/attendance   (Parent)

Mentor Connect
├── POST /api/mentor/connect/chat/send          (All)
└── POST /api/mentor/connect/meeting/create     (All)
```

## Component Hierarchy

```
App
└── Routes
    ├── /dashboard/student/v2
    │   └── <ProtectedRoute role="student">
    │       └── <StudentDashboardNew>
    │           └── <DashboardLayout menuItems={studentMenu}>
    │               ├── Sidebar (280px/80px)
    │               │   ├── Profile Section
    │               │   ├── Menu Items (9)
    │               │   ├── Theme Toggle
    │               │   └── Logout Button
    │               └── Main Content
    │                   ├── Welcome Banner
    │                   ├── Stats Grid (4 cards)
    │                   ├── Recent Activities
    │                   └── Quick Actions
    │
    ├── /dashboard/teacher/v2
    │   └── <ProtectedRoute role="teacher">
    │       └── <TeacherDashboardNew>
    │           └── <DashboardLayout menuItems={teacherMenu}>
    │               └── [Similar structure]
    │
    ├── /dashboard/parent/v2
    │   └── <ProtectedRoute role="parent">
    │       └── <ParentDashboardNew>
    │           └── <DashboardLayout menuItems={parentMenu}>
    │               └── [Similar structure]
    │
    └── /dashboard/student/certificates
        └── <ProtectedRoute role="student">
            └── <CertificatesPage>
                ├── Search Bar
                ├── Filter Buttons
                ├── Statistics Cards
                └── Certificates Grid
```

## State Management Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Component State  │
│ useState()       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ API Call         │
│ axios.get()      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Backend Route    │
│ Express Handler  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ MongoDB Query    │
│ Model.find()     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Response         │
│ res.json()       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Update State     │
│ setData()        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Re-render UI     │
│ Component Update │
└──────────────────┘
```

## Authentication Flow

```
┌─────────┐
│  Login  │
└────┬────┘
     │
     ▼
┌───────────────┐
│ JWT Generated │
│ {             │
│   userId,     │
│   role,       │
│   exp         │
│ }             │
└────┬──────────┘
     │
     ▼
┌───────────────────┐
│ Stored in Context │
│ AuthContext       │
└────┬──────────────┘
     │
     ▼
┌───────────────────┐
│ Protected Routes  │
│ Check role        │
└────┬──────────────┘
     │
     ├──→ student  ──→ StudentDashboard
     ├──→ teacher  ──→ TeacherDashboard
     └──→ parent   ──→ ParentDashboard
```

## Responsive Breakpoints

```
Mobile (< 768px)
┌──────────────┐
│ Hamburger    │
│ Menu         │
└──────────────┘
┌──────────────┐
│ Stack Cards  │
│ Vertically   │
│              │
│ ┌──────────┐ │
│ │  Card 1  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │  Card 2  │ │
│ └──────────┘ │
└──────────────┘

Tablet (768px - 1024px)
┌──────────────────────────┐
│ Sidebar │  Content       │
│ (Full)  │                │
│         │  ┌────┐ ┌────┐ │
│         │  │ C1 │ │ C2 │ │
│         │  └────┘ └────┘ │
│         │  ┌────┐ ┌────┐ │
│         │  │ C3 │ │ C4 │ │
│         │  └────┘ └────┘ │
└──────────────────────────┘

Desktop (> 1024px)
┌────────────────────────────────────┐
│ Sidebar │  Content                 │
│ (Coll.) │                          │
│         │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│   ◄►    │  │C1 │ │C2 │ │C3 │ │C4 │ │
│         │  └───┘ └───┘ └───┘ └───┘ │
│         │                          │
│         │  ┌────────────────┐      │
│         │  │  Activities    │      │
│         │  └────────────────┘      │
└────────────────────────────────────┘
```

---

**Legend:**
- 📱 = Mobile Feature
- 🔔 = Notification Badge
- 🎨 = Theme/Design
- ✨ = Animation
- 🔗 = Data Relationship
- ──→ = Navigation/Flow
- ◄► = Collapsible

**Status:** ✅ System Architecture Complete
**Date:** October 17, 2025
