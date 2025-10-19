# Internship & Hackathon Simulator - Quick Start

## 🎯 Overview
Successfully integrated **Internship Simulator** and **Hackathon Challenge Mode** into ConnectBook!

### ✅ What's Complete (Backend)
- **7 MongoDB Models** created for data management
- **2 AI Services** with Gemini 1.5 Flash integration
- **22 API Endpoints** (11 internship + 11 hackathon)
- **Seed Data** for 12 internships and 8 hackathons
- **AI Features**: Task generation, evaluation, help system

---

## 🚀 Getting Started

### Step 1: Seed the Database
Run ONE of these commands in the `backend` folder:

```bash
# Seed internships only
npm run seed:internships

# Seed hackathons only
npm run seed:hackathons

# Seed both at once (RECOMMENDED)
npm run seed:all
```

**Expected output:**
```
🚀 Starting seed process...
✅ Connected to MongoDB
📝 Seeding internships...
✅ Seeded 12 internships
🏆 Seeding hackathons...
✅ Seeded 8 hackathons
🎉 All seed data has been successfully created!
```

### Step 2: Restart Backend Server
```bash
cd backend
npm start
```

### Step 3: Test API Endpoints

**Test Internships:**
```
GET http://localhost:5000/api/internships
```

**Test Hackathons:**
```
GET http://localhost:5000/api/hackathons
```

---

## 📊 Seeded Data

### Internships (12 total)
| Company | Domain | Role | Duration | Level |
|---------|--------|------|----------|-------|
| Google | Web Development | Frontend Developer | 8 weeks | Intermediate |
| Microsoft | Data Science | Data Analyst | 10 weeks | Intermediate |
| Amazon | Cloud Computing | Cloud Engineer | 12 weeks | Advanced |
| Meta | Frontend Development | React Developer | 8 weeks | Intermediate |
| Apple | Mobile Development | iOS Developer | 10 weeks | Advanced |
| Netflix | Backend Development | Backend Engineer | 12 weeks | Advanced |
| Spotify | Machine Learning | ML Engineer | 10 weeks | Advanced |
| Tesla | Artificial Intelligence | AI Research Intern | 12 weeks | Advanced |
| Airbnb | Full Stack Development | Full Stack Developer | 10 weeks | Intermediate |
| IBM | Cloud Computing | DevOps Engineer | 10 weeks | Intermediate |
| Adobe | UI/UX Design | UI/UX Designer | 8 weeks | Intermediate |
| Intel | Cybersecurity | Security Analyst | 10 weeks | Advanced |

### Hackathons (8 total)
| Title | Domain | Duration | Status | Prize Pool |
|-------|--------|----------|--------|------------|
| AI Innovation Challenge 2024 | AI | 48h | Upcoming | ₹1,00,000 |
| Web3 DApp Marathon | Blockchain | 36h | Active | ₹1,45,000 |
| Cloud Solutions Hackathon | Cloud | 24h | Upcoming | ₹80,000 |
| Mobile App Marathon | Mobile | 48h | Upcoming | ₹1,15,000 |
| Cybersecurity CTF Challenge | Security | 24h | Upcoming | ₹95,000 |
| Data Science Challenge | Data Science | 72h | Completed | ₹90,000 |
| Game Dev Jam | Game Dev | 48h | Upcoming | ₹1,05,000 |
| IoT Innovation Sprint | IoT | 60h | Upcoming | ₹1,25,000 |

**Total Prize Money**: ₹8,55,000

---

## 🔌 API Endpoints Reference

### Internship Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/internships` | List all internships (with filters) | Public |
| GET | `/api/internships/:id` | Get single internship details | Public |
| POST | `/api/internships/enroll` | Enroll in internship (auto-generates tasks) | Student |
| GET | `/api/internships/my-enrollments` | Get student's enrollments | Student |
| GET | `/api/internships/enrollment/:id/tasks` | Get tasks for enrollment | Student |
| POST | `/api/internships/task/submit` | Submit task (auto-evaluates with AI) | Student |
| POST | `/api/internships/task/ai-help` | Get AI help for a task | Student |
| GET | `/api/internships/task/:id/evaluation` | View task evaluation | Student |
| POST | `/api/internships/certificate` | Generate certificate | Student |
| GET | `/api/internships/certificates` | List student certificates | Student |
| GET | `/api/internships/student/:usn` | View student progress | Parent/Teacher |

### Hackathon Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/hackathons` | List all hackathons (with filters) | Public |
| GET | `/api/hackathons/:id` | Get single hackathon details | Public |
| POST | `/api/hackathons/join` | Join hackathon (auto-generates problem) | Student |
| POST | `/api/hackathons/team/invite` | Invite team members | Student |
| GET | `/api/hackathons/:id/my-team` | Get student's team | Student |
| POST | `/api/hackathons/team/chat` | Send chat message | Student |
| GET | `/api/hackathons/team/:id/chat` | Get chat history | Student |
| POST | `/api/hackathons/submit` | Submit project (auto-evaluates & ranks) | Student |
| POST | `/api/hackathons/ai-help` | Get AI coding help | Student |
| GET | `/api/hackathons/:id/leaderboard` | View rankings | Public |
| GET | `/api/hackathons/my-participations` | Student's hackathons | Student |
| GET | `/api/hackathons/student/:usn` | View student progress | Parent/Teacher |

---

## 🤖 AI Features

### Internship AI
1. **Task Generation**: Automatically creates realistic tasks when student enrolls
2. **Task Evaluation**: AI grades submissions with detailed feedback
3. **AI Help**: Provides hints without giving complete solutions
4. **Certificate Generation**: Auto-generates certificates on completion

### Hackathon AI
1. **Problem Statement Generation**: Creates unique challenges based on theme
2. **Project Judging**: Evaluates submissions with weighted criteria
3. **Code Help**: Mentors teams with hints and guidance
4. **Auto-Ranking**: Sorts teams by scores for leaderboard

**AI Model**: `gemini-1.5-flash`
**Fallback**: Intelligent random data if API unavailable

---

## 📁 File Structure

### Backend Files Created
```
backend/
├── models/
│   ├── Internship.js                    # Internship catalog
│   ├── InternshipEnrollment.js          # Student enrollments
│   ├── InternshipTask.js                # Tasks with submissions
│   ├── InternshipCertificate.js         # Generated certificates
│   ├── HackathonChallenge.js            # Hackathon events
│   ├── HackathonTeam.js                 # Teams with chat
│   └── HackathonResult.js               # Results & leaderboard
├── services/
│   ├── internshipAIService.js           # AI for internships
│   └── hackathonAIService.js            # AI for hackathons
├── routes/
│   ├── internshipRoutes.js              # 11 internship endpoints
│   └── hackathonRoutes.js               # 11 hackathon endpoints
├── seedInternships.js                   # Seed internships data
├── seedHackathons.js                    # Seed hackathons data
└── seedInternshipsAndHackathons.js      # Seed both at once
```

---

## ⏭️ Next Steps (Frontend Development)

### Components to Create
1. **InternshipSimulator.jsx** - Browse and enroll in internships
2. **InternshipWorkspace.jsx** - View tasks and progress
3. **TaskSubmission.jsx** - Submit tasks with file upload
4. **HackathonChallenges.jsx** - Browse hackathons
5. **TeamCreation.jsx** - Form teams and invite members
6. **ProjectRoom.jsx** - Team workspace with chat
7. **Leaderboard.jsx** - View rankings and winners

### Dashboard Updates Needed
1. **StudentDashboard.jsx** - Add menu items for Internship & Hackathon
2. **TeacherDashboard.jsx** - Add monitoring sections
3. **ParentDashboard.jsx** - Add child's progress views

---

## 🧪 Testing Workflow

### Test Internship Flow
1. Browse internships → `GET /api/internships`
2. Enroll in internship → `POST /api/internships/enroll`
3. View generated tasks → `GET /api/internships/enrollment/:id/tasks`
4. Submit a task → `POST /api/internships/task/submit`
5. Check AI evaluation → `GET /api/internships/task/:id/evaluation`
6. Request AI help → `POST /api/internships/task/ai-help`
7. Generate certificate → `POST /api/internships/certificate`

### Test Hackathon Flow
1. Browse hackathons → `GET /api/hackathons`
2. Join hackathon → `POST /api/hackathons/join`
3. View problem statement → `GET /api/hackathons/:id/my-team`
4. Send team chat → `POST /api/hackathons/team/chat`
5. Request AI help → `POST /api/hackathons/ai-help`
6. Submit project → `POST /api/hackathons/submit`
7. Check leaderboard → `GET /api/hackathons/:id/leaderboard`

---

## 🎨 Design Guidelines (Frontend)

### UI Theme
- **Style**: Glassmorphism with blue-orange gradients
- **Animations**: Framer Motion for smooth transitions
- **Layout**: Responsive (mobile, tablet, desktop)

### Key Components
- **Cards**: Glassmorphism effect for internships/hackathons
- **Progress Bars**: Show completion percentage
- **Badges**: Status indicators (enrolled, in-progress, completed)
- **Chat**: Real-time team communication
- **Modals**: Task submission, team invitation
- **Timers**: Countdown for hackathon deadlines

---

## 🔧 Troubleshooting

### Issue: Seed script fails
**Solution**: Ensure MongoDB is running and MONGODB_URI in `.env` is correct

### Issue: AI features not working
**Solution**: Check GEMINI_API_KEY in `.env` file. Fallback will provide random data.

### Issue: Authorization errors
**Solution**: Ensure JWT token is passed in Authorization header: `Bearer <token>`

---

## 📖 Additional Resources

- **Model Schemas**: See individual model files for detailed field documentation
- **AI Service Logic**: Check `internshipAIService.js` and `hackathonAIService.js`
- **Route Handlers**: Review `internshipRoutes.js` and `hackathonRoutes.js`

---

**Backend Status**: ✅ 100% Complete
**Frontend Status**: ⏳ Pending Development
**Seed Data**: ✅ Ready to Deploy

🎉 **You're all set to run the seed scripts and start frontend development!**
