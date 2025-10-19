// Load environment variables FIRST (before any other imports)
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly load .env file from backend directory
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔧 Loading .env from:', join(__dirname, '.env'));
console.log('🔑 GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/authRoutes.js';
import faceRoutes from './routes/faceRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import studyPlannerRoutes from './routes/studyPlannerRoutes.js';
import careerAdvisorRoutes from './routes/careerAdvisorRoutes.js';

// Import seed functions
import { seedDummyCourses } from './seedData.js';
import { seedInternshipsAndHackathons } from './seedInternshipsHackathonsAuto.js';

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    
    // Auto-seed dummy courses on startup
    await seedDummyCourses();
    
    // Auto-seed internships and hackathons on startup
    await seedInternshipsAndHackathons();
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Socket.io Connection
const activeUsers = new Map(); // Track online users

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // User joins with their ID
  socket.on('user_online', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.join(userId); // Join room with user ID
    console.log(`✅ User ${userId} is now online`);
    
    // Broadcast online status
    socket.broadcast.emit('user_status_changed', {
      userId,
      status: 'online'
    });
  });

  // Join chat room
  socket.on('join_room', (data) => {
    const { roomId, userId } = data;
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Send message
  socket.on('send_message', (message) => {
    socket.to(message.receiverId).emit('receive_message', message);
  });

  // Typing indicator
  socket.on('user_typing', (data) => {
    const { receiverId, senderName, isTyping } = data;
    socket.to(receiverId).emit('user_typing', {
      senderName,
      isTyping
    });
  });

  // Join meeting room
  socket.on('join_meeting', (meetingId) => {
    socket.join(`meeting-${meetingId}`);
    console.log(`User joined meeting: ${meetingId}`);
  });

  // Leave meeting room
  socket.on('leave_meeting', (meetingId) => {
    socket.leave(`meeting-${meetingId}`);
    console.log(`User left meeting: ${meetingId}`);
  });

  // WebRTC signaling
  socket.on('webrtc_offer', (data) => {
    socket.to(`meeting-${data.meetingId}`).emit('webrtc_offer', data);
  });

  socket.on('webrtc_answer', (data) => {
    socket.to(`meeting-${data.meetingId}`).emit('webrtc_answer', data);
  });

  socket.on('webrtc_ice_candidate', (data) => {
    socket.to(`meeting-${data.meetingId}`).emit('webrtc_ice_candidate', data);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      // Broadcast offline status
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        status: 'offline'
      });
      console.log(`👋 User ${socket.userId} disconnected`);
    } else {
      console.log('👋 User disconnected:', socket.id);
    }
  });
});

// Make io accessible to routes
app.set('io', io);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/face', faceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/mentor/connect/chat', chatRoutes);
app.use('/api/mentor/connect/meeting', meetingRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/study-planner', studyPlannerRoutes);
app.use('/api/career', careerAdvisorRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'ConnectBook Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 ConnectBook Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { io };
