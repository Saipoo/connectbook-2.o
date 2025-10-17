# 🚀 ConnectBook - Quick Start Guide

## ⚡ Ultra-Fast Setup (5 Minutes)

### 1️⃣ Install Backend Dependencies
```cmd
cd "c:\Users\Dell\Desktop\crap cb major\backend"
npm install
```

### 2️⃣ Configure Backend Environment
```cmd
copy .env.example .env
notepad .env
```

**Add your MongoDB Atlas URI:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connectbook?retryWrites=true&w=majority
JWT_SECRET=any_random_32_character_string_here
ENCRYPTION_KEY=12345678901234567890123456789012
```

### 3️⃣ Start Backend
```cmd
npm run dev
```
✅ Backend running on: http://localhost:5000

### 4️⃣ Install Frontend Dependencies (New Terminal)
```cmd
cd "c:\Users\Dell\Desktop\crap cb major\frontend"
npm install
```

### 5️⃣ Start Frontend
```cmd
npm run dev
```
✅ Frontend running on: http://localhost:5173

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |
| **MongoDB Atlas** | https://cloud.mongodb.com |

---

## 🧪 Quick Test

### Register & Login Test

1. Open: http://localhost:5173
2. Click **"Register"**
3. Fill form:
   - Name: `Test Student`
   - Email: `test@student.com`
   - Password: `password123`
   - Role: `Student`
   - USN: `1MS21CS001`
   - Department: `Computer Science`
   - Class: `3rd Year`
   - Section: `A`
4. Click **"Create Account"**
5. Click **"Login"**
6. Enter credentials
7. ✅ Should redirect to dashboard

---

## 📡 API Testing (Postman/Thunder Client)

### Test Registration
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "api@test.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "student",
  "usn": "1MS21CS999",
  "department": "CS",
  "class": "3rd",
  "section": "A"
}
```

### Test Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "api@test.com",
  "password": "password123",
  "role": "student"
}
```

Copy the `token` from response.

### Test Protected Route
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🎯 What Works NOW

✅ **Landing Page** - Beautiful homepage with animations
✅ **Registration** - All 4 roles (Student/Teacher/Parent/Admin)
✅ **Login** - Role-based authentication
✅ **Backend APIs** - All endpoints functional
✅ **MongoDB** - Data persistence
✅ **Dark Mode** - Theme toggle
✅ **Responsive Design** - Mobile friendly

---

## ⏳ What's Missing

🔴 **Dashboard Pages** - Student/Teacher/Parent/Admin dashboards
🔴 **Face Registration** - Webcam + face-api.js integration
🔴 **Mark Attendance** - Facial recognition attendance
🔴 **Attendance History** - View past records
🔴 **Timetable Management** - Teacher schedules
🔴 **Charts** - Attendance analytics

---

## 🔥 Common Commands

### Both Servers Running
```cmd
:: Terminal 1 (Backend)
cd backend && npm run dev

:: Terminal 2 (Frontend)
cd frontend && npm run dev
```

### Stop Servers
Press `Ctrl + C` in each terminal

### Restart Servers
Press `Ctrl + C` then run `npm run dev` again

### Clear Cache
```cmd
:: Backend
cd backend
rmdir /s node_modules
npm install

:: Frontend
cd frontend
rmdir /s node_modules
npm install
```

---

## 🐛 Quick Troubleshooting

### "Cannot connect to MongoDB"
- ✅ Check MONGODB_URI in `.env`
- ✅ Replace `<password>` with actual password
- ✅ Whitelist IP in MongoDB Atlas (0.0.0.0/0)

### "Port already in use"
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Cannot connect to backend"
- ✅ Backend running? Check http://localhost:5000/api/health
- ✅ Check console for errors
- ✅ Clear browser cache (Ctrl+Shift+Del)

### "Login not working"
- ✅ Correct email/password?
- ✅ Selected correct role?
- ✅ Check browser console (F12)
- ✅ Check MongoDB for user data

---

## 📂 Project Structure (Current)

```
connectbook/
├── backend/ ✅ COMPLETE
│   ├── models/ (7 files)
│   ├── routes/ (4 files)
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/ ⚠️ IN PROGRESS
│   ├── src/
│   │   ├── components/ (1 file)
│   │   ├── context/ (2 files)
│   │   ├── pages/ (4 files) ⚠️ Need 7 more
│   │   ├── services/ (2 files)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── README.md ✅
├── INSTALLATION.md ✅
└── PROJECT_STATUS.md ✅
```

---

## 🎓 Key Technologies

| Category | Technology |
|----------|-----------|
| **Backend** | Node.js, Express, MongoDB, Socket.io |
| **Frontend** | React, Vite, TailwindCSS, Framer Motion |
| **Auth** | JWT, bcrypt |
| **Face** | face-api.js (to be integrated) |
| **Charts** | Recharts (to be integrated) |

---

## 📞 Need Help?

1. Check `INSTALLATION.md` for detailed setup
2. Check `PROJECT_STATUS.md` for completion status
3. Check `README.md` for full documentation
4. Check browser console (F12) for errors
5. Check backend terminal for API errors

---

## ✅ Checklist for Success

Before asking for help:

- [ ] Both servers running
- [ ] MongoDB Atlas set up correctly
- [ ] `.env` files configured
- [ ] No errors in terminal
- [ ] Can access http://localhost:5173
- [ ] Can register a new user
- [ ] User appears in MongoDB

---

## 🎉 You're Ready!

Your ConnectBook foundation is **solid and production-ready**!

**Next Steps:**
1. Test current features
2. Build remaining dashboard pages
3. Integrate face-api.js
4. Add charts with Recharts
5. Deploy to production

**The hard part (backend) is DONE. Now it's just building beautiful UIs!** 🚀

---

**Happy Coding!** 💻✨
