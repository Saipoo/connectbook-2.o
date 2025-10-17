# 🎓 ConnectBook - Facial Recognition Attendance System

## 📋 Project Overview

ConnectBook is a comprehensive AI-powered educational management platform featuring facial recognition-based attendance, role-based dashboards, real-time notifications, and intelligent analytics.

**Current Module:** Facial Recognition Attendance System ✅

**Future Modules:** AI Grade Master, Study Planner, Career Advisor, Emergency Detection (Will be integrated into this same project)

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.io
- **Security:** Helmet, CORS, crypto-js
- **File Upload:** Multer

### Frontend
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Face Recognition:** face-api.js

---

## 📁 Project Structure

```
connectbook/
├── backend/
│   ├── models/           # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Parent.js
│   │   ├── StudentFace.js
│   │   ├── Timetable.js
│   │   └── AttendanceLog.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── faceRoutes.js
│   │   ├── timetableRoutes.js
│   │   └── attendanceRoutes.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── context/      # React Context providers
    │   ├── pages/        # Page components
    │   ├── services/     # API and Socket services
    │   ├── App.jsx       # Main app component
    │   ├── main.jsx      # Entry point
    │   └── index.css     # Global styles
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
cd "c:\Users\Dell\Desktop\crap cb major"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

**Configure `.env` file:**
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/connectbook?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_32_characters_min
JWT_EXPIRE=7d
ENCRYPTION_KEY=your_32_character_encryption_key_here
FRONTEND_URL=http://localhost:5173
```

**Start Backend Server:**
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

**Configure `.env` file:**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Start Frontend Development Server:**
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Face Recognition
- `POST /api/face/register` - Register face embeddings
- `POST /api/face/mark` - Mark attendance via face
- `GET /api/face/check/:usn` - Check if face registered
- `DELETE /api/face/delete/:usn` - Delete face (Admin only)

### Timetable
- `POST /api/timetable/upload` - Create timetable entry
- `POST /api/timetable/bulk-upload` - Bulk upload timetable
- `GET /api/timetable/my-schedule` - Get teacher schedule
- `PUT /api/timetable/:id` - Update timetable entry
- `DELETE /api/timetable/:id` - Delete timetable entry

### Attendance
- `GET /api/attendance/logs` - Get attendance logs (Teacher/Admin)
- `GET /api/attendance/student/:usn` - Get student attendance
- `GET /api/attendance/my-attendance` - Get own attendance (Student)
- `POST /api/attendance/manual` - Manual attendance (Teacher)
- `GET /api/attendance/stats` - Overall statistics (Admin)
- `DELETE /api/attendance/:id` - Delete log (Admin)

---

## 👥 User Roles & Features

### 👨‍🎓 Student
- **Face Registration:** Register facial data for attendance
- **Mark Attendance:** Automated facial recognition attendance
- **View Attendance:** View attendance history and statistics
- **Subject-wise Analysis:** Track attendance by subject

### 👩‍🏫 Teacher
- **Timetable Management:** Create and manage class schedules
- **View Logs:** Access student attendance records
- **Manual Attendance:** Mark attendance manually if needed
- **Export Data:** Download attendance reports (CSV/PDF)

### 👩‍👧 Parent
- **Linked Student:** Monitor specific student via USN
- **Real-time Updates:** Receive attendance notifications
- **Analytics:** View attendance trends and statistics
- **History:** Access complete attendance history

### 🧑‍💼 Admin
- **Dashboard:** Overview of all system statistics
- **User Management:** View all users and registrations
- **System Analytics:** Track system usage and performance
- **Data Management:** Delete/modify records as needed

---

## 🔐 Security Features

1. **JWT Authentication:** Secure token-based authentication
2. **bcrypt Password Hashing:** Industry-standard password encryption
3. **Role-based Access Control:** Granular permission management
4. **Encrypted Embeddings:** Face data encrypted before storage
5. **CORS Protection:** Configured for specific origins
6. **Helmet Security:** HTTP headers security
7. **Input Validation:** Server-side validation for all inputs

---

## 🎨 Frontend Pages (To Be Created)

You still need to create these pages in `frontend/src/pages/`:

### Authentication Pages
- ✅ `LandingPage.jsx` (Created)
- `Login.jsx`
- `Register.jsx`
- `NotFound.jsx`

### Student Pages
- `dashboards/StudentDashboard.jsx`
- `student/FaceRegister.jsx`
- `student/MarkAttendance.jsx`
- `student/AttendanceHistory.jsx`

### Teacher Pages
- `dashboards/TeacherDashboard.jsx`
- `teacher/TimetableManagement.jsx`
- `teacher/AttendanceLogs.jsx`

### Parent & Admin Pages
- `dashboards/ParentDashboard.jsx`
- `dashboards/AdminDashboard.jsx`

---

## 🧪 Testing the System

### 1. Register Test Users

**Student Registration:**
```json
{
  "name": "John Doe",
  "email": "john@student.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "student",
  "usn": "1MS21CS001",
  "department": "Computer Science",
  "class": "3rd Year",
  "section": "A"
}
```

**Teacher Registration:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@teacher.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "teacher",
  "department": "Computer Science",
  "subjects": ["Data Structures", "Algorithms", "DBMS"]
}
```

**Parent Registration:**
```json
{
  "name": "Mary Doe",
  "email": "mary@parent.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "parent",
  "linkedStudentUSN": "1MS21CS001"
}
```

### 2. Test Face Recognition
1. Login as student
2. Navigate to Face Registration
3. Allow camera access
4. Capture 3-5 face angles
5. Register face embeddings
6. Mark attendance using facial recognition

---

## 📊 MongoDB Collections

### students
- name, email, password, usn, department, class, section, role

### teachers
- name, email, password, department, subjects[], role

### parents
- name, email, password, linkedStudentUSN, role

### admins
- name, email, password, role

### student_faces
- usn, name, department, class, embeddings[][], encryptedEmbeddings, registeredAt

### timetables
- teacherId, teacherEmail, subject, day, startTime, endTime, department, class, section

### attendancelogs
- usn, name, subject, date, time, mode, status, department, class, section, markedBy

---

## 🔄 Socket.io Events

### Real-time Events
- `attendance_marked` - Emitted when attendance is marked
- `connect` - Client connection established
- `disconnect` - Client disconnection

---

## 🎯 Next Steps (To Complete the Project)

1. **Create all frontend pages** listed above
2. **Implement face-api.js** for facial recognition
3. **Add Lottie animations** for better UX
4. **Create reusable components:**
   - Navbar
   - Sidebar
   - Cards
   - Tables
   - Forms
5. **Test all user flows** thoroughly
6. **Deploy backend** to Heroku/Railway/Render
7. **Deploy frontend** to Vercel/Netlify
8. **Configure production environment** variables

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### CORS Errors
- Verify FRONTEND_URL in backend `.env`
- Check proxy configuration in `vite.config.js`

### Face Detection Not Working
- Ensure HTTPS for production (camera requires secure context)
- Download face-api.js models to `public/models/`
- Check browser camera permissions

---

## 📝 License

MIT License - Feel free to use for educational purposes

---

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint responses
3. Check browser console for errors
4. Verify MongoDB connection

---

## 🎉 Project Status

✅ Backend Complete (100%)
✅ Frontend Structure (30%)
⏳ Remaining Frontend Pages (70%)
⏳ Face Recognition Integration
⏳ Testing & Deployment

**Estimated Time to Complete:** 4-6 hours for remaining frontend components

---

**Built with ❤️ for Educational Institutions**

**Ready for integration with future ConnectBook modules** 🚀
