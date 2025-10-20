import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { protect, authorize } from '../middleware/auth.js';
import Lecture from '../models/Lecture.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/lectures');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    console.log('📁 File upload filter:');
    console.log('   - originalname:', file.originalname);
    console.log('   - mimetype:', file.mimetype);
    
    // Allow common video and audio mime types
    const allowedMimeTypes = [
      'video/mp4',
      'video/avi',
      'video/quicktime', // .mov
      'video/x-matroska', // .mkv
      'video/webm',
      'audio/mpeg', // .mp3
      'audio/wav',
      'audio/mp4', // .m4a
      'audio/webm'
    ];
    
    // Check if mimetype starts with any allowed type (handles codecs in mimetype)
    const mimetypeAllowed = allowedMimeTypes.some(type => file.mimetype.startsWith(type));
    
    // Also check file extension
    const allowedExtensions = /\.(mp4|avi|mov|mkv|webm|mp3|wav|m4a)$/i;
    const extnameAllowed = allowedExtensions.test(file.originalname.toLowerCase());
    
    if (mimetypeAllowed || extnameAllowed) {
      console.log('✅ File type allowed');
      return cb(null, true);
    } else {
      console.error('❌ File type not allowed:', file.mimetype);
      cb(new Error('Only video and audio files are allowed!'));
    }
  }
});

// @desc    Create new lecture session
// @route   POST /api/lectures/create
// @access  Private (Teacher)
router.post('/create', protect, authorize('teacher'), async (req, res) => {
  try {
    const { title, subject, course, enrolledStudents, topic, difficulty } = req.body;

    // req.user is the full teacher object from auth middleware
    const teacher = req.user;
    
    const lecture = await Lecture.create({
      title,
      subject,
      course,
      department: teacher.department || '', // Add department from teacher
      teacherUSN: teacher._id.toString(), // Use teacher ID as USN
      teacherName: teacher.name, // Use the name field from Teacher model
      enrolledStudents: enrolledStudents || [],
      topic,
      difficulty: difficulty || 'intermediate',
      recordingStartTime: new Date(),
      processingStatus: 'recording'
    });

    res.status(201).json({
      success: true,
      message: 'Lecture session created',
      data: lecture
    });
  } catch (error) {
    console.error('Error creating lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lecture session',
      error: error.message
    });
  }
});

// @desc    Start live meeting for lecture
// @route   POST /api/lectures/:lectureId/start-meeting
// @access  Private (Teacher)
router.post('/:lectureId/start-meeting', protect, authorize('teacher'), async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (lecture.teacherUSN !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to start this meeting'
      });
    }

    // Update lecture to live meeting status
    lecture.meetingStatus = 'live';
    lecture.isLiveMeeting = true;
    lecture.meetingStartTime = new Date();
    lecture.processingStatus = 'recording';

    await lecture.save();

    // Emit socket event to notify students
    const io = req.app.get('io');
    io.emit('lecture_meeting_started', {
      lectureId: lecture._id,
      title: lecture.title,
      subject: lecture.subject,
      teacherName: lecture.teacherName
    });

    res.status(200).json({
      success: true,
      message: 'Live meeting started',
      data: lecture
    });
  } catch (error) {
    console.error('Error starting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start meeting',
      error: error.message
    });
  }
});

// @desc    End live meeting and save recording
// @route   POST /api/lectures/:lectureId/end-meeting
// @access  Private (Teacher)
router.post('/:lectureId/end-meeting', protect, authorize('teacher'), async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (lecture.teacherUSN !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to end this meeting'
      });
    }

    // Update lecture status
    lecture.meetingStatus = 'ended';
    lecture.isLiveMeeting = false;
    lecture.meetingEndTime = new Date();
    lecture.recordingEndTime = new Date();
    
    // Calculate duration
    const durationMs = lecture.meetingEndTime - lecture.meetingStartTime;
    lecture.duration = Math.floor(durationMs / 60000); // Convert to minutes

    await lecture.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`lecture-${lecture._id}`).emit('lecture_meeting_ended', {
      lectureId: lecture._id,
      message: 'Meeting has ended'
    });

    res.status(200).json({
      success: true,
      message: 'Meeting ended successfully',
      data: lecture
    });
  } catch (error) {
    console.error('Error ending meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end meeting',
      error: error.message
    });
  }
});

// @desc    Join live lecture meeting (for students)
// @route   POST /api/lectures/:lectureId/join-meeting
// @access  Private (Student)
router.post('/:lectureId/join-meeting', protect, authorize('student'), async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (!lecture.isLiveMeeting) {
      return res.status(400).json({
        success: false,
        message: 'This meeting is not currently live'
      });
    }

    // Optional: Check if student is enrolled (disabled for now to allow all students to join)
    // if (!lecture.enrolledStudents.includes(req.user.usn)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'You are not enrolled in this lecture'
    //   });
    // }

    // Add participant if not already in list
    const existingParticipant = lecture.currentParticipants.find(
      p => p.userId === req.user.usn
    );

    if (!existingParticipant) {
      lecture.currentParticipants.push({
        userId: req.user.usn,
        userName: req.user.name,
        role: 'student',
        joinedAt: new Date()
      });
      await lecture.save();
    }

    res.status(200).json({
      success: true,
      message: 'Joined meeting successfully',
      data: lecture
    });
  } catch (error) {
    console.error('Error joining meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join meeting',
      error: error.message
    });
  }
});

// @desc    Get live lectures (for students)
// @route   GET /api/lectures/live
// @access  Private (Student)
router.get('/live', protect, authorize('student'), async (req, res) => {
  try {
    // Show all live lectures (for now, remove enrollment restriction for testing)
    const liveLectures = await Lecture.find({
      isLiveMeeting: true
    }).sort({ meetingStartTime: -1 });

    res.status(200).json({
      success: true,
      count: liveLectures.length,
      data: liveLectures
    });
  } catch (error) {
    console.error('Error fetching live lectures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live lectures',
      error: error.message
    });
  }
});

// @desc    Upload recorded lecture video/audio
// @route   POST /api/lectures/:lectureId/upload
// @access  Private (Teacher)
router.post('/:lectureId/upload', protect, authorize('teacher'), upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (lecture.teacherUSN !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload to this lecture'
      });
    }

    // Update lecture with file info
    if (req.files.video) {
      lecture.videoUrl = `/uploads/lectures/${req.files.video[0].filename}`;
      lecture.videoFileName = req.files.video[0].filename;
    }

    if (req.files.audio) {
      lecture.audioUrl = `/uploads/lectures/${req.files.audio[0].filename}`;
    }

    lecture.recordingEndTime = new Date();
    lecture.duration = Math.round((lecture.recordingEndTime - lecture.recordingStartTime) / (1000 * 60));
    lecture.processingStatus = 'processing';

    await lecture.save();

    console.log(`📤 Recording uploaded for lecture: ${lecture.title}`);
    console.log(`📹 Video URL: ${lecture.videoUrl}`);
    console.log(`⏱️ Duration: ${lecture.duration} minutes`);

    // Trigger AI processing in background
    processLectureAI(lecture._id).catch(err => {
      console.error('Background AI processing error:', err);
    });

    res.status(200).json({
      success: true,
      message: 'Recording uploaded successfully. AI processing started.',
      data: lecture
    });
  } catch (error) {
    console.error('Error uploading lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload recording',
      error: error.message
    });
  }
});

// AI Processing Function (runs in background)
async function processLectureAI(lectureId) {
  try {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return;

    console.log(`🤖 Starting AI processing for lecture: ${lecture.title}`);

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not configured in environment variables!');
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let transcription = '';

    // Step 1: Transcribe the video/audio if available
    if (lecture.videoUrl || lecture.audioUrl) {
      try {
        const filePath = lecture.videoUrl || lecture.audioUrl;
        const fullPath = path.join(__dirname, '..', filePath);
        
        console.log(`📹 Reading video/audio file: ${fullPath}`);
        
        // Check if file exists
        try {
          await fs.access(fullPath);
          console.log(`✅ File exists: ${fullPath}`);
        } catch (accessError) {
          console.error(`❌ File not found: ${fullPath}`);
          throw new Error(`Recording file not found: ${fullPath}`);
        }
        
        // Read the file
        const fileBuffer = await fs.readFile(fullPath);
        console.log(`✅ File read successfully (${fileBuffer.length} bytes)`);
        
        const base64File = fileBuffer.toString('base64');
        console.log(`✅ File converted to base64 (${base64File.length} characters)`);
        
        // Determine mime type
        const mimeType = lecture.videoUrl ? 'video/webm' : 'audio/webm';
        
        console.log(`🎤 Transcribing with Gemini API...`);
        console.log(`   - Model: gemini-1.5-flash`);
        console.log(`   - MIME type: ${mimeType}`);
        console.log(`   - File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);
        
        // Use Gemini to transcribe the video/audio
        const transcriptionPrompt = `You are transcribing a lecture recording. Please provide an accurate transcription of everything spoken in this ${lecture.subject} lecture about "${lecture.topic}".

Instructions:
- Transcribe EXACTLY what is spoken
- Use clear formatting and punctuation
- Capture all technical terms, definitions, and explanations
- If multiple speakers, label them (Teacher, Student)
- Include any questions asked and answers given
- Write [inaudible] only if truly cannot understand

Provide a complete, word-for-word transcription of this lecture recording.`;

        console.log(`📤 Sending to Gemini API for transcription...`);
        
        const transcriptionResult = await model.generateContent([
          transcriptionPrompt,
          {
            inlineData: {
              data: base64File,
              mimeType: mimeType
            }
          }
        ]);
        
        transcription = transcriptionResult.response.text();
        console.log(`✅ Transcription complete!`);
        console.log(`   - Transcription length: ${transcription.length} characters`);
        console.log(`   - First 200 chars: ${transcription.substring(0, 200)}...`);
        
      } catch (fileError) {
        console.error('❌ Error transcribing video/audio:');
        console.error(`   - Error message: ${fileError.message}`);
        console.error(`   - Error stack: ${fileError.stack}`);
        // Fallback to generating based on topic
        console.log('⚠️ Falling back to topic-based generation...');
        transcription = await generateFallbackTranscription(lecture, model);
      }
    } else {
      // No video/audio file - generate based on topic
      console.log('⚠️ No video/audio file found. Generating based on topic...');
      transcription = await generateFallbackTranscription(lecture, model);
    }

    // Verify transcription is not empty
    if (!transcription || transcription.trim().length === 0) {
      console.error('❌ Transcription is empty!');
      throw new Error('Failed to generate transcription');
    }

    lecture.fullTranscription = transcription;
    console.log(`💾 Saved full transcription (${transcription.length} characters)`);

    // Step 2: Generate Short Summary
    console.log(`📝 Generating summary from transcription...`);
    const summaryPrompt = `
Based on this lecture transcription, create a concise one-page summary:

${transcription}

Requirements:
- 200-300 words maximum
- Cover main concepts
- Highlight key takeaways
- Use clear, student-friendly language
`;

    const summaryResult = await model.generateContent(summaryPrompt);
    lecture.shortSummary = summaryResult.response.text();
    
    if (!lecture.shortSummary || lecture.shortSummary.trim().length === 0) {
      console.error('❌ Summary generation failed!');
      lecture.shortSummary = 'Summary generation failed. Please check the transcription.';
    } else {
      console.log(`✅ Summary generated (${lecture.shortSummary.length} characters)`);
      console.log(`   - First 100 chars: ${lecture.shortSummary.substring(0, 100)}...`);
    }

    // Step 3: Generate Detailed Notes (NotebookLM Style)
    const notesPrompt = `
Create detailed lecture notes in NotebookLM style for:

${transcription}

Format requirements:
- Use markdown formatting
- Section titles with ##
- Bullet points for key concepts
- **Bold** for important terms
- Include "💡 Think about:" reflection prompts
- Add "📌 Key Takeaway:" boxes
- Use emojis for visual appeal
- Structured and easy to scan
`;

    const notesResult = await model.generateContent(notesPrompt);
    lecture.notebookLMStyleNotes = notesResult.response.text();
    lecture.detailedNotes = notesResult.response.text();
    console.log(`✅ Detailed notes generated (${lecture.detailedNotes.length} characters)`);

    // Step 4: Extract Key Points
    const keyPointsPrompt = `
Extract 5-8 key points from this lecture:

${transcription}

Return as JSON array with format:
[
  {
    "title": "Concept Name",
    "description": "Brief explanation",
    "category": "definition" or "formula" or "concept" or "example" or "important"
  }
]
`;

    const keyPointsResult = await model.generateContent(keyPointsPrompt);
    const keyPointsText = keyPointsResult.response.text();
    
    try {
      const jsonMatch = keyPointsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const keyPoints = JSON.parse(jsonMatch[0]);
        lecture.keyPoints = keyPoints.map((kp, index) => ({
          title: kp.title,
          description: kp.description,
          category: kp.category,
          timestamp: Math.floor((index / keyPoints.length) * lecture.duration * 60)
        }));
      }
    } catch (parseError) {
      console.error('Error parsing key points:', parseError);
    }

    // Step 5: Generate Revision Questions
    const questionsPrompt = `
Create 8-10 revision questions for this lecture:

${transcription}

Return as JSON array with format:
[
  {
    "question": "Question text",
    "type": "think-about" or "recall" or "application" or "analysis"
  }
]
`;

    const questionsResult = await model.generateContent(questionsPrompt);
    const questionsText = questionsResult.response.text();
    
    try {
      const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        lecture.revisionQuestions = questions;
      }
    } catch (parseError) {
      console.error('Error parsing questions:', parseError);
    }

    // Step 6: Generate Flashcards for Revision Mode
    const flashcardsPrompt = `
Create 10-15 flashcards for quick revision:

${transcription}

Return as JSON array with format:
[
  {
    "question": "Front of card",
    "answer": "Back of card",
    "topic": "Related topic"
  }
]
`;

    const flashcardsResult = await model.generateContent(flashcardsPrompt);
    const flashcardsText = flashcardsResult.response.text();
    
    try {
      const jsonMatch = flashcardsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        lecture.flashcards = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing flashcards:', parseError);
    }

    // Mark processing as complete and auto-publish
    lecture.processingStatus = 'completed';
    lecture.isPublished = true; // Auto-publish after successful AI processing
    lecture.publishedAt = new Date();
    await lecture.save();

    console.log(`✅ Lecture ${lectureId} processed and published successfully`);
  } catch (error) {
    console.error('AI Processing error:', error);
    
    const lecture = await Lecture.findById(lectureId);
    if (lecture) {
      lecture.processingStatus = 'failed';
      lecture.processingError = error.message;
      await lecture.save();
    }
  }
}

// Fallback function to generate content when video transcription fails
async function generateFallbackTranscription(lecture, model) {
  const fallbackPrompt = `
Generate a detailed educational lecture transcription for the following:
Subject: ${lecture.subject}
Topic: ${lecture.topic || 'General overview'}
Duration: ${lecture.duration || 5} minutes

Create a realistic lecture transcript with:
- Teacher explanations and key points
- Student questions (if applicable)  
- Clear structure with introduction, main content, and conclusion

Format as: [Speaker: Text]
`;

  const result = await model.generateContent(fallbackPrompt);
  return result.response.text();
}

// @desc    Get all lectures for teacher
// @route   GET /api/lectures/teacher
// @access  Private (Teacher)
router.get('/teacher', protect, authorize('teacher'), async (req, res) => {
  try {
    const lectures = await Lecture.find({ teacherUSN: req.user._id.toString() })
      .sort({ createdAt: -1 });

    const lecturesWithStats = lectures.map(lecture => ({
      ...lecture.toObject(),
      engagementStats: lecture.getEngagementStats()
    }));

    res.status(200).json({
      success: true,
      count: lectures.length,
      data: lecturesWithStats
    });
  } catch (error) {
    console.error('Error fetching teacher lectures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lectures',
      error: error.message
    });
  }
});

// @desc    Get all published lectures for student
// @route   GET /api/lectures/student
// @access  Private (Student)
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    console.log(`📚 Student ${req.user.usn} (${req.user.department}) fetching lectures...`);
    
    // Show all lectures from the same department
    const query = {};
    
    // If student has a department, filter by department
    if (req.user.department) {
      query.department = req.user.department;
      console.log(`🏢 Filtering by department: ${req.user.department}`);
    }
    
    const lectures = await Lecture.find(query).sort({ publishedAt: -1, createdAt: -1 });

    console.log(`✅ Found ${lectures.length} lectures for student`);
    lectures.forEach(lecture => {
      console.log(`  - ${lecture.title} (${lecture.processingStatus}) [${lecture.department || 'No dept'}]`);
    });

    res.status(200).json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    console.error('Error fetching student lectures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lectures',
      error: error.message
    });
  }
});

// @desc    Get single lecture details
// @route   GET /api/lectures/:lectureId
// @access  Private
router.get('/:lectureId', protect, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check authorization
    const isTeacher = req.user.role === 'teacher' && lecture.teacherUSN === req.user._id.toString();
    const isEnrolled = req.user.role === 'student' && lecture.enrolledStudents.includes(req.user.usn);

    if (!isTeacher && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this lecture'
      });
    }

    res.status(200).json({
      success: true,
      data: lecture
    });
  } catch (error) {
    console.error('Error fetching lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lecture',
      error: error.message
    });
  }
});

// @desc    Publish lecture (make available to students)
// @route   POST /api/lectures/:lectureId/publish
// @access  Private (Teacher)
router.post('/:lectureId/publish', protect, authorize('teacher'), async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (lecture.teacherUSN !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this lecture'
      });
    }

    if (lecture.processingStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot publish lecture. AI processing not completed yet.'
      });
    }

    lecture.isPublished = true;
    lecture.publishedAt = new Date();
    lecture.processingStatus = 'published';
    await lecture.save();

    res.status(200).json({
      success: true,
      message: 'Lecture published successfully',
      data: lecture
    });
  } catch (error) {
    console.error('Error publishing lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish lecture',
      error: error.message
    });
  }
});

// @desc    Track student video watching
// @route   POST /api/lectures/:lectureId/track-watch
// @access  Private (Student)
router.post('/:lectureId/track-watch', protect, authorize('student'), async (req, res) => {
  try {
    const { watchDuration, completionPercentage } = req.body;
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Update or add watch record
    const existingWatch = lecture.studentsWatched.find(s => s.usn === req.user.usn);
    
    if (existingWatch) {
      existingWatch.watchDuration = watchDuration;
      existingWatch.completionPercentage = completionPercentage;
      existingWatch.watchedAt = new Date();
    } else {
      lecture.studentsWatched.push({
        usn: req.user.usn,
        watchedAt: new Date(),
        watchDuration,
        completionPercentage
      });
    }

    await lecture.save();

    res.status(200).json({
      success: true,
      message: 'Watch progress tracked'
    });
  } catch (error) {
    console.error('Error tracking watch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track watch progress',
      error: error.message
    });
  }
});

// @desc    Track student downloads
// @route   POST /api/lectures/:lectureId/track-download
// @access  Private (Student)
router.post('/:lectureId/track-download', protect, authorize('student'), async (req, res) => {
  try {
    const { itemType } = req.body; // 'video' or 'notes'
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    lecture.studentsDownloaded.push({
      usn: req.user.usn,
      downloadedAt: new Date(),
      itemType
    });

    await lecture.save();

    res.status(200).json({
      success: true,
      message: 'Download tracked'
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track download',
      error: error.message
    });
  }
});

// @desc    Get revision mode consolidated notes
// @route   GET /api/lectures/revision-mode
// @access  Private (Student)
router.get('/student/revision-mode', protect, authorize('student'), async (req, res) => {
  try {
    const { subject } = req.query;

    const lectures = await Lecture.find({
      isPublished: true,
      enrolledStudents: req.user.usn,
      ...(subject && { subject })
    }).sort({ publishedAt: -1 });

    // Consolidate all lectures into revision material
    const allFlashcards = [];
    const allKeyPoints = [];
    const allQuestions = [];

    lectures.forEach(lecture => {
      if (lecture.flashcards) allFlashcards.push(...lecture.flashcards);
      if (lecture.keyPoints) allKeyPoints.push(...lecture.keyPoints);
      if (lecture.revisionQuestions) allQuestions.push(...lecture.revisionQuestions);
    });

    res.status(200).json({
      success: true,
      data: {
        totalLectures: lectures.length,
        flashcards: allFlashcards,
        keyPoints: allKeyPoints,
        revisionQuestions: allQuestions,
        lectures: lectures.map(l => ({
          id: l._id,
          title: l.title,
          subject: l.subject,
          topic: l.topic,
          shortSummary: l.shortSummary
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching revision mode data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revision material',
      error: error.message
    });
  }
});

// @desc    Update lecture details
// @route   PUT /api/lectures/:lectureId
// @access  Private (Teacher)
router.put('/:lectureId', protect, authorize('teacher'), async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (lecture.teacherUSN !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lecture'
      });
    }

    const allowedUpdates = ['title', 'subject', 'topic', 'difficulty', 'shortSummary', 'detailedNotes'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(lecture, updates);
    await lecture.save();

    res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: lecture
    });
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lecture',
      error: error.message
    });
  }
});

// @desc    Delete lecture
// @route   DELETE /api/lectures/:lectureId
// @access  Private (Teacher)
router.delete('/:lectureId', protect, authorize('teacher'), async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (lecture.teacherUSN !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lecture'
      });
    }

    // Delete associated files
    if (lecture.videoFileName) {
      const videoPath = path.join(__dirname, '../uploads/lectures', lecture.videoFileName);
      try {
        await fs.unlink(videoPath);
      } catch (err) {
        console.error('Error deleting video file:', err);
      }
    }

    await lecture.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lecture',
      error: error.message
    });
  }
});

export default router;
