import mongoose from 'mongoose';

const transcriptionSegmentSchema = new mongoose.Schema({
  speaker: {
    type: String,
    enum: ['teacher', 'student'],
    required: true
  },
  text: String,
  timestamp: Number, // seconds from start
  duration: Number
});

const keyPointSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: {
    type: String,
    enum: ['definition', 'formula', 'concept', 'example', 'important']
  },
  timestamp: Number // reference to video timestamp
});

const questionSchema = new mongoose.Schema({
  question: String,
  type: {
    type: String,
    enum: ['think-about', 'recall', 'application', 'analysis']
  },
  relatedKeyPoint: String
});

const lectureSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  course: String,
  department: String, // Department for filtering (from teacher)
  teacherUSN: {
    type: String,
    required: true
  },
  teacherName: String,
  
  // Live Meeting Status
  meetingStatus: {
    type: String,
    enum: ['scheduled', 'live', 'ended', 'recorded'],
    default: 'scheduled'
  },
  meetingStartTime: Date,
  meetingEndTime: Date,
  isLiveMeeting: {
    type: Boolean,
    default: false
  },
  currentParticipants: [{
    userId: String,
    userName: String,
    role: String,
    joinedAt: Date
  }],
  
  // Recording Details
  recordingStartTime: Date,
  recordingEndTime: Date,
  duration: Number, // in minutes
  
  // File Storage
  videoUrl: String, // Path or URL to recorded video
  videoFileName: String,
  audioUrl: String, // Separate audio file if needed
  
  // AI Processing Status
  processingStatus: {
    type: String,
    enum: ['recording', 'processing', 'completed', 'failed', 'published'],
    default: 'recording'
  },
  processingError: String,
  
  // Transcription
  fullTranscription: String, // Complete text
  transcriptionSegments: [transcriptionSegmentSchema], // Time-stamped segments
  
  // AI Generated Content
  shortSummary: String, // One-page summary
  detailedNotes: String, // Structured notes in markdown
  keyPoints: [keyPointSchema],
  revisionQuestions: [questionSchema],
  
  // PDF Generation
  summaryPdfUrl: String,
  summaryPdfFileName: String,
  notebookLMStyleNotes: String, // Formatted like NotebookLM
  
  // Publishing
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  
  // Student Engagement
  enrolledStudents: [String], // USNs of students who can access
  studentsWatched: [{
    usn: String,
    watchedAt: Date,
    watchDuration: Number, // minutes watched
    completionPercentage: Number
  }],
  studentsDownloaded: [{
    usn: String,
    downloadedAt: Date,
    itemType: String // 'video' or 'notes'
  }],
  
  // Attendance Integration
  attendanceMarked: {
    type: Boolean,
    default: false
  },
  attendanceDate: Date,
  
  // Metadata
  tags: [String],
  topic: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  
  // Revision Mode Data
  consolidatedTopics: [String],
  flashcards: [{
    question: String,
    answer: String,
    topic: String
  }],
  repeatedConcepts: [{
    concept: String,
    frequency: Number,
    importance: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
lectureSchema.index({ teacherUSN: 1, createdAt: -1 });
lectureSchema.index({ subject: 1, isPublished: 1 });
lectureSchema.index({ enrolledStudents: 1, isPublished: 1 });
lectureSchema.index({ processingStatus: 1 });

// Virtual for formatted duration
lectureSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return 'N/A';
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Method to calculate average completion rate
lectureSchema.methods.getAverageCompletion = function() {
  if (!this.studentsWatched.length) return 0;
  const total = this.studentsWatched.reduce((sum, s) => sum + (s.completionPercentage || 0), 0);
  return Math.round(total / this.studentsWatched.length);
};

// Method to get engagement stats
lectureSchema.methods.getEngagementStats = function() {
  return {
    totalEnrolled: this.enrolledStudents.length,
    totalWatched: this.studentsWatched.length,
    totalDownloads: this.studentsDownloaded.length,
    averageCompletion: this.getAverageCompletion(),
    engagementRate: this.enrolledStudents.length > 0 
      ? Math.round((this.studentsWatched.length / this.enrolledStudents.length) * 100) 
      : 0
  };
};

export default mongoose.model('Lecture', lectureSchema);
