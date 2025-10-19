# 🚀 QUICK START: Internship & Hackathon Module

## ⚡ Fastest Way to Get Started

### 1️⃣ Start Backend (Auto-Seeds Database)
Double-click: **`RESTART_AND_SEED.bat`**

OR run manually:
```bash
cd backend
npm run dev
```

✅ The backend will **automatically seed** 8 internships and 6 hackathons when it starts!

### 2️⃣ Start Frontend
```bash
cd frontend
npm run dev
```

### 3️⃣ Access the Features

**Student Login:**
- Navigate to: http://localhost:5173
- Login as student
- Go to: **Internship Simulator** or **Hackathon Challenges** (sidebar menu)

## 📊 What You'll See

### Internship Simulator
✅ **4 Simulation Internships** - Practice with AI-generated tasks:
- Google - Frontend Developer
- Microsoft - Data Analyst  
- Amazon - Cloud Engineer
- Meta - React Developer

✅ **4 Real-World Internships** - Apply to actual companies:
- Google STEP Program (₹80k-1L/month)
- Microsoft Data Science (₹90k-1.2L/month)
- Amazon SDE (₹1L-1.4L/month)
- Meta University (₹85k-1.1L/month)

### Hackathon Challenges
✅ **2 Simulation Hackathons** - Compete with AI evaluation:
- AI Innovation Challenge 2025 (₹1.75L prizes)
- Web3 & Blockchain Hackathon (₹2.6L prizes)

✅ **4 Real-World Hackathons** - Register for actual events:
- Smart India Hackathon 2025 (₹2.25L)
- HackWithInfy 2025 (₹4.5L + PPO)
- Google Solution Challenge (₹5L equivalent)
- Microsoft Imagine Cup (₹1.4Cr equivalent)

## 🎯 Features

### For Simulation Opportunities:
1. **Enroll/Join** - Click "Enroll Now" or "Join Hackathon"
2. **Complete Tasks** - AI generates personalized tasks
3. **Get AI Help** - Ask questions and get hints
4. **Submit Work** - AI evaluates your submissions
5. **Earn Certificates** - Get completion certificates

### For Real-World Opportunities:
1. **View Details** - See actual company info
2. **Apply/Register** - Click links to open official websites
3. **Track Applications** - Mark opportunities you're interested in
4. *Still can use simulation features!* - Practice before applying

## 🔍 Troubleshooting

### "No internships found" or "No hackathons found"

**Solution 1: Check Backend Console**
Look for these messages in the backend terminal:
```
✅ MongoDB Connected Successfully
✅ Successfully seeded 8 internships (4 simulation + 4 real)
✅ Successfully seeded 6 hackathons (2 simulation + 4 real)
```

If you don't see these messages, the seeding failed.

**Solution 2: Manual Seed**
```bash
cd backend
npm run seed:combined
```

**Solution 3: Clear and Re-seed**
1. Stop backend (Ctrl+C)
2. Delete data in MongoDB Compass:
   - Delete all from `internships` collection
   - Delete all from `hackathonchallenges` collection
3. Restart backend - it will auto-seed

**Solution 4: Check MongoDB Connection**
- Make sure MongoDB is running
- Check `.env` file has correct `MONGODB_URI`

### Frontend showing errors

**Solution 1: Clear Browser Cache**
- Press Ctrl+Shift+R (hard refresh)
- Or clear cache and reload

**Solution 2: Check Console**
- Press F12 → Console tab
- Look for API errors
- Verify backend is running on http://localhost:5000

**Solution 3: Restart Frontend**
```bash
cd frontend
# Press Ctrl+C to stop
npm run dev
```

## 📝 Testing Checklist

### Test Simulation Internships:
- [ ] Can see 4 simulation internships
- [ ] Can click "Enroll Now"
- [ ] Redirected to internship workspace
- [ ] AI generates tasks
- [ ] Can submit task solutions
- [ ] AI evaluates submissions
- [ ] Can earn certificates

### Test Real-World Internships:
- [ ] Can see 4 real-world internships
- [ ] See "🌐 REAL OPPORTUNITY" badge
- [ ] See stipend and location info
- [ ] Can click "Apply on Official Website" (when implemented)
- [ ] Link opens in new tab to company website

### Test Simulation Hackathons:
- [ ] Can see 2 simulation hackathons
- [ ] Can click "Join Hackathon"
- [ ] Can create/join team
- [ ] Team chat works
- [ ] Can submit project
- [ ] See leaderboard

### Test Real-World Hackathons:
- [ ] Can see 4 real-world hackathons
- [ ] See "🌐 REAL HACKATHON" badge
- [ ] See organizer and prize info
- [ ] Can click "Register Now" (when implemented)
- [ ] Link opens to official registration page

## 🎨 Visual Indicators

The interface clearly distinguishes between simulation and real opportunities:

**Simulation:**
- Badge: `🎯 SIMULATION`
- Description starts with "🎯 SIMULATION:"
- Purpose: Practice and learning

**Real-World:**
- Badge: `🌐 REAL OPPORTUNITY` / `🌐 REAL HACKATHON`
- Description starts with "🌐 REAL OPPORTUNITY:" / "🌐 REAL HACKATHON:"
- Includes external links to company websites
- Shows real stipends, prizes, and deadlines

## 🔥 Next Steps

1. ✅ **Restart backend** → Auto-seed happens
2. ✅ **Start frontend** → Browse opportunities  
3. ⏳ **Add external link buttons** → Make "Apply Now" clickable
4. ⏳ **Test workflows** → Verify everything works
5. ⏳ **Deploy** → Share with students!

## 📚 Additional Resources

- **Seeding Guide**: `backend/SEED_DATABASE.md`
- **All Features**: See main README.md
- **Quick Commands**: `QUICK_COMMANDS.md`

## 🆘 Need Help?

Check backend console logs for detailed information about:
- MongoDB connection status
- Seed operation results
- API request/response details
- Error messages with stack traces

Everything is logged for easy debugging! 🔍
