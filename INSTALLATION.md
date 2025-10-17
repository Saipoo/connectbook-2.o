# 🚀 ConnectBook - Installation & Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
- **Git** (optional but recommended)
- **VS Code** (recommended IDE)

---

## 🛠️ Step-by-Step Installation

### Step 1: MongoDB Atlas Setup

1. **Create a MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas/register
2. **Create a new cluster** (Free tier is sufficient)
3. **Create a database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (remember these!)
   - Grant "Read and write to any database" permission

4. **Whitelist your IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   
5. **Get your connection string:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `connectbook`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/connectbook?retryWrites=true&w=majority
```

---

### Step 2: Backend Setup

Open **Command Prompt** or **PowerShell** in Windows:

```cmd
cd "c:\Users\Dell\Desktop\crap cb major\backend"
```

#### Install Dependencies
```cmd
npm install
```

#### Create Environment File
```cmd
copy .env.example .env
```

#### Edit .env File

Open `.env` in a text editor and configure:

```env
# MongoDB Connection (REQUIRED - Use your Atlas connection string)
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/connectbook?retryWrites=true&w=majority

# Server Port
PORT=5000

# Environment
NODE_ENV=development

# JWT Secret (IMPORTANT - Change this to a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# JWT Expiry
JWT_EXPIRE=7d

# Encryption Key for Face Embeddings (IMPORTANT - 32 characters exactly)
ENCRYPTION_KEY=12345678901234567890123456789012

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** 
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Change `JWT_SECRET` to a strong random string (minimum 32 characters)
- Change `ENCRYPTION_KEY` to a 32-character random string

**Generate strong keys using Node.js:**
```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Start Backend Server
```cmd
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
🚀 ConnectBook Server running on port 5000
🌐 Environment: development
```

**Keep this terminal window open!** The backend server must be running.

---

### Step 3: Frontend Setup

Open a **NEW** Command Prompt or PowerShell window:

```cmd
cd "c:\Users\Dell\Desktop\crap cb major\frontend"
```

#### Install Dependencies
```cmd
npm install
```

This will install all required packages including:
- React, React Router
- Axios (API calls)
- Tailwind CSS (styling)
- Framer Motion (animations)
- face-api.js (facial recognition)
- Recharts (charts)
- Socket.io-client (real-time updates)
- React Hot Toast (notifications)

#### Create Environment File
```cmd
copy .env.example .env
```

The default `.env` should work for local development:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### Start Frontend Development Server
```cmd
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

## 🌐 Access the Application

Open your web browser and navigate to:

**Frontend:** http://localhost:5173
**Backend API:** http://localhost:5000/api/health

---

## ✅ Verify Installation

### 1. Test Backend API

Open browser and go to: http://localhost:5000/api/health

You should see:
```json
{
  "status": "success",
  "message": "ConnectBook Backend is running",
  "timestamp": "2025-..."
}
```

### 2. Test Frontend

Open: http://localhost:5173

You should see the ConnectBook landing page with:
- Navigation bar
- "Digitalizing Education through AI" heading
- Module cards (AI Face Attendance, Grade Master, etc.)
- Login and Register buttons

---

## 🧪 Test the System

### Create Test Accounts

#### 1. Register a Student
1. Click "Register" or "Get Started"
2. Fill in the form:
   - Name: John Doe
   - Email: john@student.com
   - Password: password123
   - Confirm Password: password123
   - Role: Student
   - USN: 1MS21CS001
   - Department: Computer Science
   - Class: 3rd Year
   - Section: A
3. Click "Create Account"
4. You should be redirected to login page

#### 2. Login as Student
1. Click "Login"
2. Enter:
   - Email: john@student.com
   - Password: password123
   - Role: Student
3. Click "Sign In"
4. You should be redirected to Student Dashboard

#### 3. Register a Teacher
Follow similar steps with:
- Email: teacher@school.com
- Role: Teacher
- Department: Computer Science
- Subjects: Data Structures, Algorithms, DBMS

#### 4. Register a Parent
- Email: parent@family.com
- Role: Parent
- Linked Student USN: 1MS21CS001 (use the student's USN)

#### 5. Register an Admin
- Email: admin@school.com
- Role: Admin

---

## 📊 Check MongoDB Data

1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Select "connectbook" database
4. You should see collections:
   - students
   - teachers
   - parents
   - admins
   - (More collections will appear as you use features)

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "MongoDB Connection Error"**
- ✅ Check your `MONGODB_URI` in `.env`
- ✅ Ensure you replaced `<password>` with actual password
- ✅ Check IP whitelist in MongoDB Atlas (should include 0.0.0.0/0)
- ✅ Verify database user has correct permissions

**Error: "Port 5000 already in use"**
```cmd
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

Or change PORT in `.env` to a different port like 5001

### Frontend Won't Start

**Error: "Cannot connect to backend"**
- ✅ Ensure backend server is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Clear browser cache and reload

**Error: "Module not found"**
```cmd
cd frontend
rmdir /s node_modules
npm install
```

### Login Issues

**"Invalid credentials"**
- ✅ Ensure you're using the correct email and password
- ✅ Ensure you selected the correct role
- ✅ Check if user was created (check MongoDB Atlas)

**"Token expired"**
- Clear browser local storage: 
  - Press F12 → Application → Local Storage → Clear All
  - Refresh page and login again

---

## 🎯 Next Steps

After successful installation, you'll need to create the remaining pages:

### Missing Pages (To be created):

1. **Student Dashboard Pages:**
   - `/src/pages/dashboards/StudentDashboard.jsx`
   - `/src/pages/student/FaceRegister.jsx`
   - `/src/pages/student/MarkAttendance.jsx`
   - `/src/pages/student/AttendanceHistory.jsx`

2. **Teacher Dashboard Pages:**
   - `/src/pages/dashboards/TeacherDashboard.jsx`
   - `/src/pages/teacher/TimetableManagement.jsx`
   - `/src/pages/teacher/AttendanceLogs.jsx`

3. **Parent & Admin Pages:**
   - `/src/pages/dashboards/ParentDashboard.jsx`
   - `/src/pages/dashboards/AdminDashboard.jsx`

These pages will use the backend APIs you've already created!

---

## 📝 Quick Commands Reference

### Backend Commands
```cmd
cd backend
npm install           # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend Commands
```cmd
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## 🔒 Security Notes

For **Production Deployment**:

1. **Change all default credentials**
2. **Use strong JWT_SECRET (64+ characters)**
3. **Use environment-specific encryption keys**
4. **Enable MongoDB IP whitelist (remove 0.0.0.0/0)**
5. **Use HTTPS for frontend and backend**
6. **Enable CORS only for your domain**
7. **Never commit `.env` files to Git**

---

## 📧 Support

If you encounter issues:
1. Check the console output for errors
2. Review the troubleshooting section
3. Check MongoDB Atlas connection
4. Verify all environment variables
5. Ensure both servers are running

---

## 🎉 Success!

If you can:
- ✅ Access http://localhost:5173
- ✅ See the landing page
- ✅ Register a new account
- ✅ Login successfully
- ✅ See data in MongoDB Atlas

**Congratulations!** Your ConnectBook backend and frontend are successfully set up!

You're now ready to build the remaining dashboard pages and implement face recognition features! 🚀

---

**Last Updated:** October 2025
**Version:** 1.0.0
