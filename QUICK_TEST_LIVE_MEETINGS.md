# Quick Testing Guide - Live Lecture Meetings

## 🚀 Quick Start (5 Minutes)

### Step 1: Start the Server
```bash
cd "c:\Users\Dell\Desktop\crap cb major"
npm start
```
Wait for: `✅ MongoDB Connected Successfully` and `🚀 ConnectBook Server running on port 5000`

### Step 2: Login as Teacher
1. Open browser: http://localhost:5173
2. Login with teacher credentials
3. Click "Lecture Notes" in sidebar (Film icon)

### Step 3: Create Live Lecture
1. Click **"Create New Lecture"** button (top right)
2. Fill in:
   - Title: "Test Live Meeting"
   - Subject: "Computer Science"  
   - Course: "CS101"
   - Topic: "Testing Live Features"
   - Difficulty: "Intermediate"
3. Click **"Create & Upload Recording"**

### Step 4: Choose Live Meeting
1. Modal appears with 2 options
2. Click **"Start Live Meeting"** (left option with video icon)
3. **Allow camera and microphone** when browser prompts

### Step 5: Meeting Room Opens
You should see:
- ✅ Your video feed (full screen)
- ✅ Control bar at bottom with buttons
- ✅ Meeting title at top
- ✅ "0 participants" counter

### Step 6: Test Controls
Try these buttons (bottom control bar):

**Left Side:**
- 🎤 Microphone button (should toggle mute/unmute)
- 📹 Video button (should toggle camera on/off)
- 🖥️ Screen Share button (click to share screen)

**Center:**
- 🔴 **"Start Recording"** button - CLICK THIS!
  - Should show red timer: 00:00:00
  - Should say "Stop Recording" after clicking

**Right Side:**
- 👥 Participants button (shows participant list)
- 💬 Chat button (opens chat sidebar)
- ⚙️ Settings button

### Step 7: Test Recording
1. Click **"Start Recording"** (center)
2. Watch timer count up: 00:00:01, 00:00:02...
3. Say something or show your screen
4. Wait 10-15 seconds
5. Click **"Stop Recording"**

### Step 8: End Meeting
1. Click red **"End Meeting"** button (center)
2. Wait for upload confirmation
3. Should see: "✅ Meeting ended and recording saved!"

### Step 9: Verify Processing
1. You're back at Lecture Notes page
2. Find your "Test Live Meeting" lecture
3. Should show yellow "Processing" badge
4. Wait 1-2 minutes
5. Refresh page
6. Should show green "Completed" badge

### Step 10: Test Student Side
**Open new incognito/private window:**
1. Go to: http://localhost:5173
2. Login as student
3. Click "Lecture Notes" in sidebar
4. Should see 3 tabs: **"Live Now"**, "All Lectures", "Revision Mode"
5. Click **"Live Now"** tab

**If teacher is still in meeting:**
- You'll see "LIVE NOW" badge with red pulsing dot
- Click **"Join Meeting"** button
- Allow camera/mic (optional)
- You should enter meeting room and see teacher

**If meeting ended:**
- Click "All Lectures" tab
- Find "Test Live Meeting"
- Click **"View Notes"** button
- Should see AI-generated:
  - ✅ Summary
  - ✅ Key Points
  - ✅ Detailed Notes
  - ✅ Revision Questions

---

## 🎯 Full Feature Test Checklist

### Teacher Meeting Room:
- [ ] Camera turns on/off
- [ ] Microphone mutes/unmutes
- [ ] Screen sharing works
- [ ] Recording starts with timer
- [ ] Recording stops
- [ ] Participants sidebar opens
- [ ] Chat sidebar opens
- [ ] Chat messages can be typed
- [ ] Fullscreen mode works
- [ ] End meeting button works
- [ ] Recording uploads successfully

### Student Meeting Room:
- [ ] Can see teacher's video
- [ ] Can enable own camera (optional)
- [ ] Can enable own microphone (optional)
- [ ] Raise hand button works
- [ ] Chat sidebar opens
- [ ] Can send chat messages
- [ ] Can see other participants
- [ ] Leave meeting button works
- [ ] Receives notification when meeting ends

### Integration:
- [ ] Live lectures show in "Live Now" tab
- [ ] Live indicator (red dot) pulses
- [ ] Join meeting button appears
- [ ] Enrollment validation works
- [ ] Recording processes with AI after meeting
- [ ] Notes appear in student view
- [ ] Download notes button works

---

## 🐛 Troubleshooting

### Camera/Mic Not Working:
**Error:** "Could not access camera/microphone"
**Fix:**
1. Click lock icon in browser address bar
2. Allow Camera and Microphone
3. Refresh page
4. Try again

### Screen Share Not Working:
**Error:** "Error sharing screen"
**Fix:**
1. Use Chrome or Edge browser
2. When prompt appears, select screen/window
3. Click "Share" button
4. Should work

### Recording Not Uploading:
**Error:** "Meeting ended but there was an error saving"
**Fix:**
1. Check server is running (terminal should show activity)
2. Check file size isn't too large
3. Try shorter recording (< 2 minutes for testing)
4. Check browser console for errors (F12)

### Students Can't Join:
**Error:** "You are not enrolled in this lecture"
**Fix:**
1. When creating lecture, add student USNs to enrolledStudents
2. Or modify Student model to include course enrollment
3. Or temporarily remove enrollment check for testing

### No Live Lectures Showing:
**Issue:** "Live Now" tab shows "No Live Lectures"
**Fix:**
1. Teacher must click "Start Live Meeting" (not just create)
2. Meeting must be in "live" status
3. Student must be enrolled
4. Refresh the page (auto-refreshes every 30 sec)

---

## 📊 Expected Results

### After Starting Meeting (Teacher):
```
✅ Meeting room opens fullscreen
✅ Camera feed visible
✅ All controls present
✅ Recording button ready
✅ Participant count shows "1 participant"
```

### After Joining Meeting (Student):
```
✅ Meeting room opens fullscreen
✅ Teacher's video visible (or placeholder)
✅ Can enable own camera/mic
✅ Raise hand button present
✅ Chat available
✅ Leave meeting button works
```

### After Ending Meeting:
```
✅ Teacher sees upload confirmation
✅ Recording blob created
✅ File uploads to server
✅ Lecture status: "Processing"
✅ AI starts processing
✅ After 1-2 min: Status "Completed"
✅ Notes appear in student view
```

---

## ⏱️ Performance Benchmarks

| Action | Expected Time |
|--------|--------------|
| Create Lecture | < 1 second |
| Start Meeting | < 2 seconds |
| Camera/Mic Access | 2-5 seconds (browser prompt) |
| Join Meeting | < 2 seconds |
| Start Recording | Instant |
| Stop Recording | 1-2 seconds |
| End Meeting | 2-3 seconds |
| Upload Recording | 5-30 seconds (depends on duration) |
| AI Processing | 1-5 minutes (depends on length) |

---

## 🎬 Test Scenarios

### Scenario 1: Quick Test (2 minutes)
1. Create lecture
2. Start live meeting
3. Record for 10 seconds
4. End meeting
5. Verify upload confirmation

### Scenario 2: Full Feature Test (5 minutes)
1. Create lecture
2. Start live meeting
3. Enable all features (camera, mic, screen share)
4. Start recording
5. Record for 30 seconds
6. Test chat
7. Check participants
8. Stop recording
9. End meeting
10. Verify AI processing

### Scenario 3: Multi-user Test (10 minutes)
1. Teacher creates and starts meeting
2. Student 1 joins from another browser
3. Student 2 joins from incognito window
4. Test chat between all participants
5. Student raises hand
6. Teacher sees hand raise alert
7. Record entire interaction
8. End meeting
9. All students can view notes after processing

### Scenario 4: Screen Share Test (3 minutes)
1. Start meeting
2. Click screen share
3. Select screen/window
4. Start recording
5. Switch between apps on screen
6. Stop recording
7. End meeting
8. Verify screen was recorded

---

## 💾 What Gets Saved

After successful meeting:

### In Database (Lecture document):
```javascript
{
  title: "Test Live Meeting",
  meetingStatus: "ended",
  meetingStartTime: ISODate("2025-10-20T..."),
  meetingEndTime: ISODate("2025-10-20T..."),
  duration: 2, // minutes
  videoUrl: "/uploads/lectures/lecture-xxx.webm",
  processingStatus: "processing",
  // After AI processing:
  fullTranscription: "...",
  shortSummary: "...",
  detailedNotes: "...",
  keyPoints: [...],
  revisionQuestions: [...]
}
```

### In File System:
```
backend/uploads/lectures/
  ├─ lecture-67134abc123.webm  (recorded video)
  └─ lecture-67134abc123.mp4   (converted, if needed)
```

---

## ✅ Success Indicators

You know it's working when:

1. **Teacher Side:**
   - ✅ Can see self on camera
   - ✅ Recording timer increments
   - ✅ "Meeting ended and recording saved!" message appears
   - ✅ Lecture appears with "Processing" status

2. **Student Side:**
   - ✅ "Live Now" tab shows red pulsing dot
   - ✅ Can click "Join Meeting" button
   - ✅ Meeting room opens
   - ✅ Can interact (chat, hand raise)
   - ✅ Notes appear after meeting ends

3. **Backend:**
   - ✅ Console shows: "📚 teacher [name] joined lecture meeting: [id]"
   - ✅ Console shows: "User joined meeting: [id]"
   - ✅ Console shows: "Recording started"
   - ✅ File appears in uploads/lectures/ folder
   - ✅ AI processing logs appear
   - ✅ Gemini API calls succeed

---

## 🎉 You're Done!

If all tests pass, you have a fully functional live lecture meeting system! 🚀

**Next Steps:**
- Enroll real students in lectures
- Conduct actual class sessions
- Share feature with teachers
- Gather feedback
- Monitor AI processing quality
- Optimize recording quality settings

---

**Need Help?**
Check browser console (F12) for errors
Check server terminal for logs
Review LIVE_MEETING_IMPLEMENTATION_COMPLETE.md for full details
