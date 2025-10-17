# 🚀 Quick Start Guide - Mentor Connect

## Prerequisites
- Node.js installed
- MongoDB Atlas connection string in `.env`
- Both backend and frontend folders present

---

## Step 1: Start Backend Server

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
✅ Server running on port 5000
✅ Socket.io initialized
```

Backend will be available at: **http://localhost:5000**

---

## Step 2: Start Frontend Development Server

```bash
# Navigate to frontend folder (in a new terminal)
cd frontend

# Install dependencies (if not already done)
npm install

# Start Vite dev server
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Frontend will be available at: **http://localhost:5173**

---

## Step 3: Test Mentor Connect Feature

### 3.1 Login as Teacher
1. Go to http://localhost:5173/login
2. Login with teacher credentials
3. Navigate to Dashboard
4. Click **"Mentor Connect"** in sidebar
5. You should see the chat interface

### 3.2 Login as Parent (in incognito/different browser)
1. Go to http://localhost:5173/login
2. Login with parent credentials
3. Navigate to Dashboard
4. Click **"Mentor Connect"** button in header
5. You should see the chat interface

### 3.3 Test Real-time Messaging
1. In Teacher's browser: Select a parent from contacts
2. Send a message: "Hello!"
3. In Parent's browser: Message should appear instantly
4. Reply from parent
5. Check typing indicators work
6. Check online status (green dot)

### 3.4 Test File Upload
1. Click paperclip icon in chat
2. Select an image or document
3. Click send
4. File should appear in chat with download button
5. Click to download/preview

### 3.5 Test Video Meeting
1. As Teacher: Click **"Schedule Meeting"** button
2. Fill meeting details:
   - Title: "Parent-Teacher Meeting"
   - Description: "Discuss progress"
   - Date/Time: Select future time
   - Duration: 30 minutes
   - Platform: Jitsi Meet
3. Click "Create Meeting"
4. Meeting link will be automatically sent to parent in chat
5. As Parent: Click "Join Meeting" in the message
6. Video meeting window should open
7. Test controls: Mute, Video, Screen Share, End Call

---

## Troubleshooting

### Backend Not Starting
```bash
# Check if MongoDB URI is set
# In backend/.env, verify:
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

### Frontend Not Connecting to Backend
```bash
# In frontend, create .env file:
VITE_API_URL=http://localhost:5000
```

### Socket.io Connection Error
- Ensure backend is running first
- Check browser console for errors
- Verify no firewall blocking port 5000

### File Upload Not Working
- Check `backend/uploads/chat_files/` folder exists
- Verify file size is under 10MB
- Check file type is supported

### Video Meeting Black Screen
- Allow browser camera/microphone permissions
- Use HTTPS in production (WebRTC requirement)
- Check browser console for WebRTC errors

---

## User Accounts for Testing

### Teacher Account
```
Email: teacher@connectbook.com
Password: (your registered password)
Role: teacher
```

### Parent Account
```
Email: parent@connectbook.com
Password: (your registered password)
Role: parent
Linked Student USN: (student's USN)
```

### Creating Test Accounts
1. Go to http://localhost:5173/register
2. Register as Teacher (Department: CSE, Class: 3A, Section: A)
3. Register as Student (USN: 1MS21CS001)
4. Register as Parent (Linked Student USN: 1MS21CS001)

---

## Testing Checklist

### Real-time Chat ✅
- [ ] Teacher can see parent in contacts
- [ ] Parent can see teacher in contacts
- [ ] Text messages send/receive instantly
- [ ] Typing indicator appears
- [ ] Online/offline status updates
- [ ] Seen status (double check marks)
- [ ] File upload works
- [ ] File download works
- [ ] Voice note upload works

### Video Meetings ✅
- [ ] Teacher can create meeting
- [ ] Meeting link sent to parent automatically
- [ ] Parent receives meeting notification
- [ ] Both can join meeting
- [ ] Camera/mic permissions work
- [ ] Video displays for both users
- [ ] Mute/unmute works
- [ ] Camera on/off works
- [ ] Screen sharing works
- [ ] Teacher can end meeting

### UI/UX ✅
- [ ] Mobile responsive design
- [ ] Dark mode toggle works
- [ ] Animations smooth
- [ ] Loading states show
- [ ] Error messages display
- [ ] Search contacts works
- [ ] Unread badges update

---

## API Endpoints Reference

### Chat Endpoints
```
POST   /api/mentor/connect/chat/send           - Send text message
POST   /api/mentor/connect/chat/send-file      - Upload file
GET    /api/mentor/connect/chat/:userId        - Get messages
PATCH  /api/mentor/connect/chat/seen/:messageId - Mark seen
GET    /api/mentor/connect/chat/contacts/list  - Get contacts
```

### Meeting Endpoints
```
POST   /api/mentor/connect/meeting/create           - Create meeting
GET    /api/mentor/connect/meeting/:meetingId       - Get meeting
GET    /api/mentor/connect/meeting/list/my-meetings - List meetings
PATCH  /api/mentor/connect/meeting/:meetingId/start - Start meeting
PATCH  /api/mentor/connect/meeting/:meetingId/end   - End meeting
PATCH  /api/mentor/connect/meeting/:meetingId/join  - Join meeting
```

### Socket.io Events
```
Emit:
- user_online           - Notify user is online
- join_room            - Join chat room
- send_message         - Send message
- user_typing          - Typing indicator
- join_meeting         - Join video meeting
- webrtc_offer         - WebRTC offer signal
- webrtc_answer        - WebRTC answer signal
- webrtc_ice_candidate - ICE candidate

Listen:
- receive_message         - New message received
- user_typing            - Other user typing
- message_seen           - Message marked seen
- user_status_changed    - Online/offline status
- meeting_created        - New meeting scheduled
- meeting_started        - Meeting started
- meeting_ended          - Meeting ended
- participant_joined     - User joined meeting
```

---

## Production Deployment Notes

### Backend
1. Set environment variables in production
2. Use process.env.PORT for dynamic port
3. Enable CORS for production domain
4. Use AWS S3 for file storage
5. Enable SSL/TLS for Socket.io
6. Use Redis for Socket.io adapter (multi-server)

### Frontend
1. Build production bundle: `npm run build`
2. Set VITE_API_URL to production backend
3. Enable HTTPS (required for WebRTC)
4. Configure CDN for static assets
5. Enable Gzip compression

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend terminal for logs
3. Verify MongoDB connection
4. Ensure all dependencies installed
5. Review this guide's troubleshooting section

---

**Happy Testing! 🎉**
