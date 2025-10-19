import express from 'express';
import HackathonChallenge from '../models/HackathonChallenge.js';
import HackathonTeam from '../models/HackathonTeam.js';
import HackathonResult from '../models/HackathonResult.js';
import Certificate from '../models/Certificate.js';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';
import hackathonAIService from '../services/hackathonAIService.js';

const router = express.Router();

// @route   GET /api/hackathons
// @desc    Get all hackathons (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { domain, status, type } = req.query;

    let filter = {};
    
    if (domain) filter.domain = domain;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const hackathons = await HackathonChallenge.find(filter).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hackathons',
      error: error.message
    });
  }
});

// @route   POST /api/hackathons/join
// @desc    Join hackathon (solo or create team)
// @access  Private (Student)
router.post('/join', protect, authorize('student'), async (req, res) => {
  try {
    const { hackathonId, teamName, role } = req.body;

    const hackathon = await HackathonChallenge.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    if (hackathon.status !== 'active' && hackathon.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Cannot join this hackathon at this time'
      });
    }

    // Check if student already joined
    const existingTeam = await HackathonTeam.findOne({
      hackathonId,
      $or: [
        { 'teamLeader.usn': req.user.usn },
        { 'members.usn': req.user.usn }
      ]
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this hackathon'
      });
    }

    // Create team
    const team = await HackathonTeam.create({
      hackathonId,
      teamName: teamName || `Team ${req.user.name}`,
      teamLeader: {
        usn: req.user.usn,
        name: req.user.name,
        email: req.user.email
      },
      members: [{
        usn: req.user.usn,
        name: req.user.name,
        email: req.user.email,
        role: role || 'Leader',
        joinedAt: new Date()
      }],
      totalMembers: 1,
      status: 'registered'
    });

    // Generate AI problem statement
    console.log('🤖 Generating AI problem statement...');
    const problemResult = await hackathonAIService.instance.generateProblemStatement({
      theme: hackathon.theme,
      domain: hackathon.domain,
      difficulty: hackathon.difficulty,
      duration: hackathon.duration
    });

    if (problemResult.success) {
      team.problemStatement = {
        title: problemResult.problem.title,
        description: problemResult.problem.description,
        requirements: problemResult.problem.requirements,
        expectedDeliverables: problemResult.problem.expectedDeliverables,
        generatedAt: new Date()
      };
      await team.save();
    }

    // Update hackathon stats
    hackathon.totalParticipants += 1;
    hackathon.totalTeams += 1;
    await hackathon.save();

    res.status(201).json({
      success: true,
      message: 'Successfully joined hackathon',
      data: team
    });
  } catch (error) {
    console.error('Error joining hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining hackathon',
      error: error.message
    });
  }
});

// @route   POST /api/hackathons/team/invite
// @desc    Invite member to team
// @access  Private (Student - Team Leader)
router.post('/team/invite', protect, authorize('student'), async (req, res) => {
  try {
    const { teamId, memberUSN, memberRole } = req.body;

    const team = await HackathonTeam.findById(teamId).populate('hackathonId');
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify requester is team leader
    if (team.teamLeader.usn !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can invite members'
      });
    }

    // Check team size limit
    if (team.totalMembers >= team.hackathonId.maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: 'Team is full'
      });
    }

    // Check if member already in team
    const alreadyMember = team.members.some(m => m.usn === memberUSN.toUpperCase());
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'Student already in team'
      });
    }

    // Get student details
    const student = await Student.findOne({ usn: memberUSN.toUpperCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student already in another team for this hackathon
    const otherTeam = await HackathonTeam.findOne({
      hackathonId: team.hackathonId._id,
      _id: { $ne: teamId },
      'members.usn': memberUSN.toUpperCase()
    });

    if (otherTeam) {
      return res.status(400).json({
        success: false,
        message: 'Student already joined another team for this hackathon'
      });
    }

    // Add member
    team.members.push({
      usn: student.usn,
      name: student.name,
      email: student.email,
      role: memberRole || 'Member',
      joinedAt: new Date()
    });
    team.totalMembers = team.members.length;
    await team.save();

    // Update hackathon participant count
    const hackathon = await HackathonChallenge.findById(team.hackathonId._id);
    hackathon.totalParticipants += 1;
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: team
    });
  } catch (error) {
    console.error('Error inviting member:', error);
    res.status(500).json({
      success: false,
      message: 'Error inviting member',
      error: error.message
    });
  }
});

// @route   GET /api/hackathons/:id/my-team
// @desc    Get student's team for hackathon
// @access  Private (Student)
router.get('/:id/my-team', protect, authorize('student'), async (req, res) => {
  try {
    const team = await HackathonTeam.findOne({
      hackathonId: req.params.id,
      $or: [
        { 'teamLeader.usn': req.user.usn },
        { 'members.usn': req.user.usn }
      ]
    }).populate('hackathonId');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Not part of any team for this hackathon'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
      error: error.message
    });
  }
});

// @route   POST /api/hackathons/team/chat
// @desc    Send chat message to team
// @access  Private (Student - Team Member)
router.post('/team/chat', protect, authorize('student'), async (req, res) => {
  try {
    const { teamId, message } = req.body;

    const team = await HackathonTeam.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify student is team member
    const isMember = team.members.some(m => m.usn === req.user.usn);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not a team member'
      });
    }

    // Add message
    team.chatMessages.push({
      sender: req.user.usn,
      senderName: req.user.name,
      message,
      timestamp: new Date()
    });
    await team.save();

    res.status(200).json({
      success: true,
      data: team.chatMessages[team.chatMessages.length - 1]
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// @route   GET /api/hackathons/team/:teamId/chat
// @desc    Get team chat messages
// @access  Private (Student - Team Member)
router.get('/team/:teamId/chat', protect, authorize('student'), async (req, res) => {
  try {
    const team = await HackathonTeam.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify student is team member
    const isMember = team.members.some(m => m.usn === req.user.usn);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not a team member'
      });
    }

    res.status(200).json({
      success: true,
      data: team.chatMessages || []
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat',
      error: error.message
    });
  }
});

// @route   POST /api/hackathons/submit
// @desc    Submit hackathon project
// @access  Private (Student - Team Leader)
router.post('/submit', protect, authorize('student'), async (req, res) => {
  try {
    const { teamId, project } = req.body;

    const team = await HackathonTeam.findById(teamId).populate('hackathonId');
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify requester is team leader
    if (team.teamLeader.usn !== req.user.usn) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can submit project'
      });
    }

    if (team.status === 'submitted' || team.status === 'evaluated') {
      return res.status(400).json({
        success: false,
        message: 'Project already submitted'
      });
    }

    // Update project submission
    team.project = {
      title: project.title,
      description: project.description,
      techStack: project.techStack || [],
      repoUrl: project.repoUrl,
      demoUrl: project.demoUrl,
      videoUrl: project.videoUrl,
      documentation: project.documentation,
      files: project.files || [],
      submittedAt: new Date()
    };
    team.status = 'submitted';
    await team.save();

    // Trigger AI evaluation
    console.log('🤖 Evaluating hackathon submission with AI...');
    const submittedOnTime = new Date() <= new Date(team.hackathonId.endDate);
    
    const evaluationResult = await hackathonAIService.instance.evaluateSubmission({
      problemStatement: team.problemStatement,
      project: team.project,
      teamSize: team.totalMembers,
      submittedOnTime
    });

    if (evaluationResult.success) {
      team.evaluation = {
        evaluatedAt: new Date(),
        evaluatedBy: 'AI',
        scores: evaluationResult.evaluation.scores,
        feedback: evaluationResult.evaluation.feedback,
        strengths: evaluationResult.evaluation.strengths,
        improvements: evaluationResult.evaluation.improvements
      };
      team.status = 'evaluated';
      await team.save();

      // Create result entry
      await HackathonResult.create({
        hackathonId: team.hackathonId._id,
        teamId: team._id,
        teamName: team.teamName,
        members: team.members.map(m => ({
          usn: m.usn,
          name: m.name,
          email: m.email
        })),
        finalScore: evaluationResult.evaluation.scores.overall,
        scores: evaluationResult.evaluation.scores,
        feedback: evaluationResult.evaluation.feedback,
        strengths: evaluationResult.evaluation.strengths,
        improvements: evaluationResult.evaluation.improvements,
        submittedAt: team.project.submittedAt,
        evaluatedAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project submitted and evaluated successfully',
      data: team
    });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting project',
      error: error.message
    });
  }
});

// @route   POST /api/hackathons/ai-help
// @desc    Get AI coding help
// @access  Private (Student - Team Member)
router.post('/ai-help', protect, authorize('student'), async (req, res) => {
  try {
    const { teamId, question } = req.body;

    const team = await HackathonTeam.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify student is team member
    const isMember = team.members.some(m => m.usn === req.user.usn);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not a team member'
      });
    }

    // Get AI help
    const helpResult = await hackathonAIService.instance.getCodeHelp(question, {
      problemTitle: team.problemStatement?.title,
      techStack: team.project?.techStack
    });

    if (helpResult.success) {
      team.aiHelpRequested += 1;
      await team.save();

      res.status(200).json({
        success: true,
        response: helpResult.response
      });
    } else {
      res.status(500).json({
        success: false,
        message: helpResult.message
      });
    }
  } catch (error) {
    console.error('Error getting AI help:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting AI help',
      error: error.message
    });
  }
});

// @route   GET /api/hackathons/:id/leaderboard
// @desc    Get hackathon leaderboard
// @access  Private
router.get('/:id/leaderboard', protect, async (req, res) => {
  try {
    const results = await HackathonResult.find({
      hackathonId: req.params.id
    }).sort({ finalScore: -1 });

    // Assign ranks
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    // Save ranks
    await Promise.all(results.map(r => r.save()));

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

// @route   GET /api/hackathons/my-participations
// @desc    Get student's hackathon participations
// @access  Private (Student)
router.get('/my-participations', protect, authorize('student'), async (req, res) => {
  try {
    const teams = await HackathonTeam.find({
      $or: [
        { 'teamLeader.usn': req.user.usn },
        { 'members.usn': req.user.usn }
      ]
    }).populate('hackathonId').sort({ createdAt: -1 });

    const results = await HackathonResult.find({
      'members.usn': req.user.usn
    }).populate('hackathonId');

    res.status(200).json({
      success: true,
      data: {
        teams,
        results
      }
    });
  } catch (error) {
    console.error('Error fetching participations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching participations',
      error: error.message
    });
  }
});

// @route   GET /api/hackathons/student/:usn
// @desc    Get student's hackathon data (for parent/teacher)
// @access  Private (Parent, Teacher, Admin)
router.get('/student/:usn', protect, authorize('parent', 'teacher', 'admin'), async (req, res) => {
  try {
    const { usn } = req.params;

    // Authorization check for parents
    if (req.user.role === 'parent' && req.user.linkedStudentUSN !== usn.toUpperCase()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student\'s data'
      });
    }

    const teams = await HackathonTeam.find({
      $or: [
        { 'teamLeader.usn': usn.toUpperCase() },
        { 'members.usn': usn.toUpperCase() }
      ]
    }).populate('hackathonId');

    const results = await HackathonResult.find({
      'members.usn': usn.toUpperCase()
    });

    res.status(200).json({
      success: true,
      data: {
        teams,
        results
      }
    });
  } catch (error) {
    console.error('Error fetching student hackathons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student hackathons',
      error: error.message
    });
  }
});

// @route   GET /api/hackathons/:id
// @desc    Get single hackathon details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const hackathon = await HackathonChallenge.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hackathon',
      error: error.message
    });
  }
});

export default router;
