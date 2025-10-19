import mongoose from 'mongoose';

const studyTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  subject: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['assignment', 'revision', 'practice', 'project', 'exam-prep', 'reading'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  estimatedHours: {
    type: Number,
    default: 1
  },
  completedHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  completedAt: Date,
  notes: String,
  aiGenerated: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const studyGoalSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  targetGrade: String,
  currentGrade: String,
  targetDate: Date,
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'achieved', 'delayed'],
    default: 'not-started'
  },
  milestones: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }]
}, { timestamps: true });

const pomodoroSessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  subject: String,
  duration: {
    type: Number, // in minutes
    default: 25
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const studyPlanSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: true,
    uppercase: true
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  
  // Tasks
  tasks: [studyTaskSchema],
  
  // Goals
  goals: [studyGoalSchema],
  
  // AI-Generated Schedule
  weeklySchedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: [{
      startTime: String, // "09:00"
      endTime: String,   // "10:00"
      subject: String,
      activity: String,
      type: {
        type: String,
        enum: ['class', 'study', 'revision', 'break', 'assignment', 'project']
      },
      aiGenerated: {
        type: Boolean,
        default: false
      }
    }]
  }],
  
  // AI Recommendations
  aiRecommendations: [{
    type: {
      type: String,
      enum: ['focus-subject', 'revision-topic', 'study-technique', 'time-management', 'resource']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    message: String,
    subject: String,
    actionable: {
      type: Boolean,
      default: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  
  // Weak Subjects (from GradeMaster integration)
  weakSubjects: [{
    subject: String,
    currentGrade: Number,
    targetGrade: Number,
    recommendedHoursPerWeek: Number,
    topics: [String]
  }],
  
  // Pomodoro Sessions
  pomodoroSessions: [pomodoroSessionSchema],
  
  // Settings
  preferences: {
    studyHoursPerDay: {
      type: Number,
      default: 4
    },
    breakDuration: {
      type: Number,
      default: 5 // minutes
    },
    pomodoroLength: {
      type: Number,
      default: 25 // minutes
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    autoSchedule: {
      type: Boolean,
      default: true
    }
  },
  
  // Sharing & Collaboration
  sharedWith: [{
    userId: String,
    role: {
      type: String,
      enum: ['teacher', 'parent', 'mentor']
    },
    permissions: {
      type: String,
      enum: ['view', 'comment', 'edit'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistics
  stats: {
    totalTasksCompleted: {
      type: Number,
      default: 0
    },
    totalStudyHours: {
      type: Number,
      default: 0
    },
    averageTaskCompletionTime: Number, // in hours
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastStudyDate: Date,
    subjectWiseHours: {
      type: Map,
      of: Number
    }
  },
  
  lastAISync: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
  
}, { timestamps: true });

// Indexes
studyPlanSchema.index({ usn: 1, semester: 1, academicYear: 1 });
studyPlanSchema.index({ 'tasks.dueDate': 1 });
studyPlanSchema.index({ 'tasks.status': 1 });

// Methods
studyPlanSchema.methods.calculateProgress = function() {
  const totalTasks = this.tasks.length;
  if (totalTasks === 0) return 0;
  
  const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
  return Math.round((completedTasks / totalTasks) * 100);
};

studyPlanSchema.methods.updateStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastStudy = this.stats.lastStudyDate ? 
    new Date(this.stats.lastStudyDate).setHours(0, 0, 0, 0) : null;
  
  if (!lastStudy) {
    this.stats.currentStreak = 1;
  } else {
    const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      this.stats.currentStreak += 1;
      if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak;
      }
    } else {
      // Streak broken
      this.stats.currentStreak = 1;
    }
  }
  
  this.stats.lastStudyDate = new Date();
};

studyPlanSchema.methods.getOverdueTasks = function() {
  const now = new Date();
  return this.tasks.filter(t => 
    t.status !== 'completed' && 
    new Date(t.dueDate) < now
  );
};

studyPlanSchema.methods.getUpcomingTasks = function(days = 7) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.tasks.filter(t => 
    t.status !== 'completed' &&
    new Date(t.dueDate) >= now &&
    new Date(t.dueDate) <= futureDate
  ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);

export default StudyPlan;
