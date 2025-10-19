import express from 'express';
import CareerProfile from '../models/CareerProfile.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import Grade from '../models/Grade.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  analyzeCareerPaths,
  analyzeSkillGaps,
  generateResume,
  calculateReadinessScore,
  analyzeQuizResults,
  generateCareerRoadmap
} from '../services/careerAdvisorAIService.js';

const router = express.Router();

// ==================== CAREER PROFILE CRUD ====================

// @desc    Create or get career profile
// @route   POST /api/career/profile
// @access  Private (Student)
router.post('/profile', protect, authorize('student'), async (req, res) => {
  try {
    // Check if profile already exists
    let careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (careerProfile) {
      return res.status(200).json({
        success: true,
        message: 'Career profile already exists',
        data: careerProfile
      });
    }

    // Create new career profile
    const { interests, preferences } = req.body;

    careerProfile = await CareerProfile.create({
      usn: req.user.usn,
      studentName: req.user.name,
      email: req.user.email,
      interests: interests || [],
      preferences: preferences || {}
    });

    res.status(201).json({
      success: true,
      message: 'Career profile created successfully',
      data: careerProfile
    });
  } catch (error) {
    console.error('Error creating career profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create career profile',
      error: error.message
    });
  }
});

// @desc    Get student's career profile
// @route   GET /api/career/profile
// @access  Private (Student, Parent, Teacher)
router.get('/profile', protect, authorize('student', 'parent', 'teacher'), async (req, res) => {
  try {
    let usn;

    if (req.user.role === 'student') {
      usn = req.user.usn;
    } else {
      usn = req.query.usn;
      
      if (!usn) {
        return res.status(400).json({
          success: false,
          message: 'USN is required for non-student users'
        });
      }
    }

    const careerProfile = await CareerProfile.findOne({ usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found. Please create one first.'
      });
    }

    // Check parent visibility settings
    if (req.user.role === 'parent') {
      const visibleData = {
        usn: careerProfile.usn,
        studentName: careerProfile.studentName,
        chosenPaths: careerProfile.parentVisibility.showCareerPaths ? careerProfile.chosenPaths : [],
        readinessScore: careerProfile.parentVisibility.showReadinessScore ? careerProfile.readinessScore : null,
        skillGaps: careerProfile.parentVisibility.showSkillGaps ? careerProfile.skillGaps : [],
        goals: careerProfile.goals
      };

      return res.status(200).json({
        success: true,
        data: visibleData
      });
    }

    res.status(200).json({
      success: true,
      data: careerProfile
    });
  } catch (error) {
    console.error('Error fetching career profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch career profile',
      error: error.message
    });
  }
});

// @desc    Update career profile
// @route   PUT /api/career/profile
// @access  Private (Student)
router.put('/profile', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Update allowed fields
    const { interests, preferences, parentVisibility } = req.body;
    
    if (interests) careerProfile.interests = interests;
    if (preferences) careerProfile.preferences = { ...careerProfile.preferences, ...preferences };
    if (parentVisibility) careerProfile.parentVisibility = { ...careerProfile.parentVisibility, ...parentVisibility };

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Career profile updated successfully',
      data: careerProfile
    });
  } catch (error) {
    console.error('Error updating career profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update career profile',
      error: error.message
    });
  }
});

// ==================== AI CAREER ANALYSIS ====================

// @desc    Analyze career paths using AI
// @route   POST /api/career/analyze
// @access  Private (Student)
router.post('/analyze', protect, authorize('student'), async (req, res) => {
  try {
    let careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      // Create profile if doesn't exist
      careerProfile = await CareerProfile.create({
        usn: req.user.usn,
        studentName: req.user.name,
        email: req.user.email
      });
    }

    // Sync integration data first
    await careerProfile.syncIntegrationData();

    // Get recent grades
    const grades = await Grade.find({ usn: req.user.usn }).sort({ createdAt: -1 }).limit(20);

    // Prepare student data for AI
    const studentData = {
      usn: req.user.usn,
      name: req.user.name,
      interests: careerProfile.interests,
      currentSkills: careerProfile.currentSkills,
      integrationData: careerProfile.integrationData,
      grades: grades.map(g => ({
        subject: g.subject,
        marks: g.marks,
        totalMarks: g.totalMarks,
        percentage: (g.marks / g.totalMarks) * 100
      }))
    };

    // Analyze career paths using AI
    const careerPathsResult = await analyzeCareerPaths(studentData);
    
    // Check if analysis was successful
    if (!careerPathsResult.success || !careerPathsResult.recommendations) {
      return res.status(500).json({
        success: false,
        message: 'Failed to analyze career paths',
        error: careerPathsResult.error || 'No recommendations generated'
      });
    }

    const careerPaths = careerPathsResult.recommendations;

    // Save recommended paths
    careerProfile.recommendedPaths = careerPaths.map(path => ({
      title: path.title,
      description: path.description,
      matchScore: path.matchScore,
      requiredSkills: path.requiredSkills,
      salaryRange: path.salaryRange,
      topCompanies: path.topCompanies,
      reasoning: path.reasoning,
      generatedAt: new Date()
    }));

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Career paths analyzed successfully',
      data: careerPaths
    });
  } catch (error) {
    console.error('Error analyzing career paths:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze career paths',
      error: error.message
    });
  }
});

// @desc    Get career recommendations
// @route   GET /api/career/recommendations
// @access  Private (Student)
router.get('/recommendations', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found. Please create one first.'
      });
    }

    // Return recommended paths
    const sortedPaths = careerProfile.recommendedPaths.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      data: sortedPaths
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
});

// @desc    Choose a career path
// @route   POST /api/career/choose-path
// @access  Private (Student)
router.post('/choose-path', protect, authorize('student'), async (req, res) => {
  try {
    const { pathTitle, targetDate } = req.body;

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Find the path in recommended paths
    const recommendedPath = careerProfile.recommendedPaths.find(p => p.title === pathTitle);

    if (!recommendedPath) {
      return res.status(404).json({
        success: false,
        message: 'Career path not found in recommendations'
      });
    }

    // Check if already chosen
    const alreadyChosen = careerProfile.chosenPaths.find(p => p.title === pathTitle);

    if (alreadyChosen) {
      return res.status(400).json({
        success: false,
        message: 'Career path already chosen'
      });
    }

    // Add to chosen paths
    careerProfile.chosenPaths.push({
      title: recommendedPath.title || pathTitle,
      description: recommendedPath.description || 'Career path description',
      targetDate: targetDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default: 1 year
      requiredSkills: recommendedPath.requiredSkills || [],
      salaryRange: recommendedPath.salaryRange || { min: 0, max: 0, currency: 'INR' }
    });

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Career path chosen successfully',
      data: careerProfile
    });
  } catch (error) {
    console.error('Error choosing career path:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to choose career path',
      error: error.message
    });
  }
});

// ==================== SKILL GAP ANALYSIS ====================

// @desc    Analyze skill gaps for chosen career path
// @route   POST /api/career/analyze-skills
// @access  Private (Student)
router.post('/analyze-skills', protect, authorize('student'), async (req, res) => {
  try {
    const { careerPath } = req.body;

    if (!careerPath) {
      return res.status(400).json({
        success: false,
        message: 'Career path is required'
      });
    }

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Prepare current profile for AI
    const currentProfile = {
      currentSkills: careerProfile.currentSkills,
      integrationData: careerProfile.integrationData,
      completedCourses: careerProfile.integrationData.courseMaster.completedCourses
    };

    // Analyze skill gaps using AI
    const skillGapAnalysis = await analyzeSkillGaps(currentProfile, careerPath);

    // Update skill gaps in profile
    careerProfile.skillGaps = skillGapAnalysis.map(gap => ({
      skill: gap.skill,
      currentLevel: gap.currentLevel || 'beginner',
      requiredLevel: gap.requiredLevel,
      importance: gap.importance,
      estimatedTime: gap.estimatedTime,
      resources: gap.resources.map(r => ({
        type: r.type,
        title: r.title,
        url: r.url,
        description: r.description
      }))
    }));

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Skill gaps analyzed successfully',
      data: skillGapAnalysis
    });
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze skill gaps',
      error: error.message
    });
  }
});

// @desc    Get skill gaps
// @route   GET /api/career/skill-gaps
// @access  Private (Student)
router.get('/skill-gaps', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Sort by importance
    const sortedGaps = careerProfile.skillGaps.sort((a, b) => {
      const importanceOrder = { required: 3, recommended: 2, optional: 1 };
      return importanceOrder[b.importance] - importanceOrder[a.importance];
    });

    res.status(200).json({
      success: true,
      data: sortedGaps
    });
  } catch (error) {
    console.error('Error fetching skill gaps:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill gaps',
      error: error.message
    });
  }
});

// @desc    Update skill progress
// @route   PUT /api/career/skill-progress
// @access  Private (Student)
router.put('/skill-progress', protect, authorize('student'), async (req, res) => {
  try {
    const { skillName, progress } = req.body;

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Find and update skill gap
    const skillGap = careerProfile.skillGaps.find(g => g.skill === skillName);

    if (!skillGap) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found in gaps'
      });
    }

    skillGap.progress = progress;

    // Also update in current skills if high progress
    if (progress >= 50) {
      const existingSkill = careerProfile.currentSkills.find(s => s.name === skillName);
      
      if (existingSkill) {
        existingSkill.level = progress >= 80 ? 'advanced' : 'intermediate';
      } else {
        careerProfile.currentSkills.push({
          name: skillName,
          level: progress >= 80 ? 'advanced' : 'intermediate',
          acquiredDate: new Date()
        });
      }
    }

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Skill progress updated successfully',
      data: careerProfile
    });
  } catch (error) {
    console.error('Error updating skill progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skill progress',
      error: error.message
    });
  }
});

// ==================== RESUME GENERATION ====================

// @desc    Generate AI resume
// @route   POST /api/career/generate-resume
// @access  Private (Student)
router.post('/generate-resume', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Sync integration data
    await careerProfile.syncIntegrationData();

    // Prepare student profile for AI
    const studentProfile = {
      name: careerProfile.studentName,
      email: careerProfile.email,
      usn: careerProfile.usn,
      skills: careerProfile.currentSkills,
      integrationData: careerProfile.integrationData,
      chosenPaths: careerProfile.chosenPaths
    };

    // Generate resume using AI
    const generatedResume = await generateResume(studentProfile);

    // Update resume in profile
    careerProfile.resume = {
      summary: generatedResume.summary,
      education: generatedResume.education || [],
      experience: generatedResume.experience || [],
      projects: generatedResume.projects || [],
      certifications: generatedResume.certifications || [],
      skills: generatedResume.skills || [],
      achievements: generatedResume.achievements || [],
      lastGenerated: new Date()
    };

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Resume generated successfully',
      data: generatedResume
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate resume',
      error: error.message
    });
  }
});

// @desc    Get resume
// @route   GET /api/career/resume
// @access  Private (Student, Parent with permission)
router.get('/resume', protect, authorize('student', 'parent'), async (req, res) => {
  try {
    let usn;

    if (req.user.role === 'student') {
      usn = req.user.usn;
    } else {
      usn = req.query.usn;
      
      if (!usn) {
        return res.status(400).json({
          success: false,
          message: 'USN is required for non-student users'
        });
      }
    }

    const careerProfile = await CareerProfile.findOne({ usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Check parent permission
    if (req.user.role === 'parent' && !careerProfile.parentVisibility.showResume) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view resume'
      });
    }

    res.status(200).json({
      success: true,
      data: careerProfile.resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message
    });
  }
});

// @desc    Update resume manually
// @route   PUT /api/career/resume
// @access  Private (Student)
router.put('/resume', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Update resume fields
    const { summary, education, experience, projects, certifications, skills, achievements } = req.body;
    
    if (summary) careerProfile.resume.summary = summary;
    if (education) careerProfile.resume.education = education;
    if (experience) careerProfile.resume.experience = experience;
    if (projects) careerProfile.resume.projects = projects;
    if (certifications) careerProfile.resume.certifications = certifications;
    if (skills) careerProfile.resume.skills = skills;
    if (achievements) careerProfile.resume.achievements = achievements;

    careerProfile.resume.lastUpdated = new Date();

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: careerProfile.resume
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume',
      error: error.message
    });
  }
});

// ==================== CAREER QUIZ ====================

// @desc    Submit career quiz
// @route   POST /api/career/quiz/:type
// @access  Private (Student)
router.post('/quiz/:type', protect, authorize('student'), async (req, res) => {
  try {
    const { type } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Quiz answers are required'
      });
    }

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Analyze quiz results using AI
    const quizAnalysis = await analyzeQuizResults(answers, type);

    // Save quiz result
    careerProfile.quizResults.push({
      type,
      answers,
      results: quizAnalysis,
      completedAt: new Date()
    });

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: quizAnalysis
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
});

// @desc    Get quiz results
// @route   GET /api/career/quiz-results
// @access  Private (Student)
router.get('/quiz-results', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: careerProfile.quizResults
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results',
      error: error.message
    });
  }
});

// ==================== MENTOR CONNECTIONS ====================

// @desc    Connect with mentor
// @route   POST /api/career/connect-mentor
// @access  Private (Student)
router.post('/connect-mentor', protect, authorize('student'), async (req, res) => {
  try {
    const { mentorEmail, careerPath, message } = req.body;

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Find mentor (teacher)
    const mentor = await Teacher.findOne({ email: mentorEmail });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Add mentor connection
    careerProfile.mentorConnections.push({
      mentorId: mentor._id,
      mentorName: mentor.name,
      mentorEmail: mentor.email,
      careerPath,
      message,
      status: 'pending'
    });

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Mentor connection request sent successfully',
      data: careerProfile
    });
  } catch (error) {
    console.error('Error connecting with mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect with mentor',
      error: error.message
    });
  }
});

// @desc    Get mentor connections
// @route   GET /api/career/mentor-connections
// @access  Private (Student)
router.get('/mentor-connections', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: careerProfile.mentorConnections
    });
  } catch (error) {
    console.error('Error fetching mentor connections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor connections',
      error: error.message
    });
  }
});

// ==================== READINESS SCORE ====================

// @desc    Calculate career readiness score
// @route   GET /api/career/readiness-score
// @access  Private (Student, Parent with permission)
router.get('/readiness-score', protect, authorize('student', 'parent'), async (req, res) => {
  try {
    let usn;

    if (req.user.role === 'student') {
      usn = req.user.usn;
    } else {
      usn = req.query.usn;
      
      if (!usn) {
        return res.status(400).json({
          success: false,
          message: 'USN is required for non-student users'
        });
      }
    }

    const careerProfile = await CareerProfile.findOne({ usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Check parent permission
    if (req.user.role === 'parent' && !careerProfile.parentVisibility.showReadinessScore) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view readiness score'
      });
    }

    // Get target career path
    const targetPath = req.query.careerPath || (careerProfile.chosenPaths[0] && careerProfile.chosenPaths[0].title);

    if (!targetPath) {
      return res.status(400).json({
        success: false,
        message: 'No career path specified'
      });
    }

    // Sync integration data
    await careerProfile.syncIntegrationData();

    // Calculate readiness score using AI
    const studentProfile = {
      currentSkills: careerProfile.currentSkills,
      integrationData: careerProfile.integrationData,
      skillGaps: careerProfile.skillGaps,
      quizResults: careerProfile.quizResults
    };

    const readinessAnalysis = await calculateReadinessScore(studentProfile, targetPath);

    // Update readiness score in profile
    careerProfile.readinessScore = {
      overall: readinessAnalysis.overall,
      technical: readinessAnalysis.breakdown.technical,
      softSkills: readinessAnalysis.breakdown.softSkills,
      experience: readinessAnalysis.breakdown.experience,
      lastCalculated: new Date()
    };

    await careerProfile.save();

    res.status(200).json({
      success: true,
      data: readinessAnalysis
    });
  } catch (error) {
    console.error('Error calculating readiness score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate readiness score',
      error: error.message
    });
  }
});

// ==================== CAREER ROADMAP ====================

// @desc    Generate career roadmap
// @route   GET /api/career/roadmap
// @access  Private (Student)
router.get('/roadmap', protect, authorize('student'), async (req, res) => {
  try {
    const { careerPath, timeframe = 12 } = req.query;

    if (!careerPath) {
      return res.status(400).json({
        success: false,
        message: 'Career path is required'
      });
    }

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Sync integration data
    await careerProfile.syncIntegrationData();

    // Prepare student profile for AI
    const studentProfile = {
      currentSkills: careerProfile.currentSkills,
      skillGaps: careerProfile.skillGaps,
      integrationData: careerProfile.integrationData,
      goals: careerProfile.goals
    };

    // Generate roadmap using AI
    const roadmap = await generateCareerRoadmap(studentProfile, careerPath, parseInt(timeframe));

    res.status(200).json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: error.message
    });
  }
});

// ==================== INTEGRATION & SYNC ====================

// @desc    Sync data from all modules
// @route   POST /api/career/sync-data
// @access  Private (Student)
router.post('/sync-data', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    // Sync integration data
    await careerProfile.syncIntegrationData();

    res.status(200).json({
      success: true,
      message: 'Data synced successfully',
      data: careerProfile.integrationData
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync data',
      error: error.message
    });
  }
});

// ==================== GOALS ====================

// @desc    Add career goal
// @route   POST /api/career/goal
// @access  Private (Student)
router.post('/goal', protect, authorize('student'), async (req, res) => {
  try {
    const { title, description, type, targetDate, milestones } = req.body;

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    careerProfile.goals.push({
      title,
      description,
      type: type || 'short-term',
      targetDate: targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Default: 3 months
      milestones: milestones || []
    });

    await careerProfile.save();

    res.status(201).json({
      success: true,
      message: 'Goal added successfully',
      data: careerProfile
    });
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add goal',
      error: error.message
    });
  }
});

// @desc    Update goal progress
// @route   PUT /api/career/goal/:goalId
// @access  Private (Student)
router.put('/goal/:goalId', protect, authorize('student'), async (req, res) => {
  try {
    const { progress, status } = req.body;

    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    const goal = careerProfile.goals.id(req.params.goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (progress !== undefined) goal.progress = progress;
    if (status) goal.status = status;

    if (status === 'completed') {
      goal.completedAt = new Date();
    }

    await careerProfile.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: careerProfile
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goal',
      error: error.message
    });
  }
});

// ==================== DASHBOARD ====================

// @desc    Get career dashboard overview
// @route   GET /api/career/dashboard
// @access  Private (Student)
router.get('/dashboard', protect, authorize('student'), async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ usn: req.user.usn });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found. Please create one first.'
      });
    }

    // Sync data
    await careerProfile.syncIntegrationData();

    // Get readiness score if chosen path exists
    let readinessAnalysis = null;
    if (careerProfile.chosenPaths.length > 0) {
      const targetPath = careerProfile.chosenPaths[0].title;
      
      const studentProfile = {
        currentSkills: careerProfile.currentSkills,
        integrationData: careerProfile.integrationData,
        skillGaps: careerProfile.skillGaps,
        quizResults: careerProfile.quizResults
      };

      readinessAnalysis = await calculateReadinessScore(studentProfile, targetPath);
    }

    res.status(200).json({
      success: true,
      data: {
        profile: careerProfile,
        topRecommendations: (careerProfile.recommendedPaths || []).slice(0, 3),
        criticalSkillGaps: (careerProfile.skillGaps || []).filter(g => g.importance === 'required').slice(0, 5),
        readinessScore: readinessAnalysis,
        recentQuizzes: (careerProfile.quizResults || []).slice(-3),
        activeGoals: (careerProfile.goals || []).filter(g => g.status !== 'completed')
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

export default router;
