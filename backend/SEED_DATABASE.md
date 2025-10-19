# 🌱 Database Seeding Guide

## Automatic Seeding

The database **automatically seeds** when you start the backend server with:

```bash
npm run dev
```

or

```bash
npm start
```

The server will check if internships and hackathons exist in the database. If not, it will automatically seed:
- ✅ **4 Simulation Internships** (for practice and learning)
- ✅ **4 Real-World Internships** (with external application links)
- ✅ **2 Simulation Hackathons** (for practice competitions)
- ✅ **4 Real-World Hackathons** (with registration links)

## Manual Seeding

If you need to manually seed the database, use:

### Seed Everything (Internships + Hackathons)
```bash
npm run seed:combined
```

### Seed Only Internships and Hackathons (Auto-seed format)
```bash
node seedInternshipsHackathonsAuto.js
```

### Seed Real-World Opportunities Only
```bash
npm run seed:real
```

### Seed Individual Types
```bash
# Only internships (old dummy data)
npm run seed:internships

# Only hackathons (old dummy data)
npm run seed:hackathons
```

## Clear and Re-seed

If you want to clear the database and re-seed:

1. **Stop the backend server** (Ctrl+C)

2. **Delete existing data** (in MongoDB Compass or via command):
   ```javascript
   // In MongoDB shell or Compass
   db.internships.deleteMany({})
   db.hackathonchallenges.deleteMany({})
   ```

3. **Restart the server** - it will auto-seed:
   ```bash
   npm run dev
   ```

## What Gets Seeded?

### 📝 Simulation Internships (4)
- Google - Frontend Developer
- Microsoft - Data Analyst
- Amazon - Cloud Engineer
- Meta - React Developer

These have AI-generated tasks and full simulation features.

### 🌐 Real-World Internships (4)
- Google STEP Program - Apply at: https://buildyourfuture.withgoogle.com/programs/step
- Microsoft Data Science - Apply at: https://careers.microsoft.com/students
- Amazon SDE - Apply at: https://amazon.jobs
- Meta University - Apply at: https://www.metacareers.com/students

These include external application links and real stipend information.

### 🎯 Simulation Hackathons (2)
- AI Innovation Challenge 2025
- Web3 & Blockchain Hackathon

Full simulation with team chat, AI evaluation, and leaderboards.

### 🏆 Real-World Hackathons (4)
- Smart India Hackathon 2025 - Register at: https://www.sih.gov.in/
- HackWithInfy 2025 - Register at: https://www.hackerearth.com/hackwithinfy
- Google Solution Challenge - Register at: https://developers.google.com/community/gdsc-solution-challenge
- Microsoft Imagine Cup - Register at: https://imaginecup.microsoft.com/

These include registration links and real prize information.

## Troubleshooting

### "No internships found" / "No hackathons found"

1. Check backend console logs - look for seed messages
2. Verify MongoDB connection is successful
3. Check if seed function ran (should see "✅ Successfully seeded..." messages)
4. Try manual seeding: `npm run seed:combined`

### Data not showing after seed

1. Refresh the frontend (F5)
2. Check browser console for API errors
3. Verify backend is running on http://localhost:5000
4. Check MongoDB database has the collections

### Duplicate key errors

This means data already exists. To re-seed:
1. Delete existing data from MongoDB
2. Restart the server

## Seed Data Location

- **Auto-seed file**: `backend/seedInternshipsHackathonsAuto.js`
- **Combined seed**: `backend/seedAllInternshipsAndHackathons.js`
- **Real-only seeds**: 
  - `backend/seedRealInternships.js`
  - `backend/seedRealHackathons.js`

## Verification

After seeding, you should see in the backend console:

```
✅ MongoDB Connected Successfully
✅ Dummy courses seeded successfully
🔍 Checking internships and hackathons in database...
📊 Current counts: 0 internships, 0 hackathons
🌱 Starting seed process for internships and hackathons...
📝 Inserting 8 internships...
✅ Successfully seeded 8 internships (4 simulation + 4 real)
🏆 Inserting 6 hackathons...
✅ Successfully seeded 6 hackathons (2 simulation + 4 real)
🎉 Internships and hackathons seed completed!
```

## Next Steps

Once seeded, students can:
1. Browse and enroll in simulation internships
2. View and apply to real-world internships (opens external links)
3. Join simulation hackathons and form teams
4. Register for real-world hackathons (opens registration pages)

All simulation features (AI tasks, team chat, evaluations) work for both types!
