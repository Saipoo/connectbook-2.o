import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, MessageCircle, Send, Lightbulb, Upload, 
  FileText, Link as LinkIcon, Trophy, Clock, Target, Code, X
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectRoom = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('problem'); // problem, chat, submit, ai-help

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // AI Help
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Submission
  const [submissionData, setSubmissionData] = useState({
    projectTitle: '',
    description: '',
    techStack: '',
    repoUrl: '',
    demoUrl: '',
    videoUrl: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamData();
    fetchHackathonData();
    fetchChatMessages();
  }, [hackathonId]);

  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/my-team`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setTeam(data.data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHackathonData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setHackathon(data.hackathon);
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
    }
  };

  const fetchChatMessages = async () => {
    if (!team) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hackathons/team/${team._id}/chat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setChatMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hackathons/team/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teamId: team._id, message: newMessage })
      });
      const data = await response.json();
      
      if (data.success) {
        setChatMessages([...chatMessages, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAIHelp = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    const userMsg = { role: 'user', content: aiQuestion, timestamp: new Date() };
    setChatMessages([...chatMessages, userMsg]);
    setAiQuestion('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hackathons/ai-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teamId: team._id, question: aiQuestion })
      });
      const data = await response.json();
      
      if (data.success) {
        const aiMsg = { role: 'assistant', content: data.response, timestamp: new Date() };
        setChatMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error('Error getting AI help:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('teamId', team._id);
      formData.append('projectTitle', submissionData.projectTitle);
      formData.append('description', submissionData.description);
      formData.append('techStack', submissionData.techStack);
      formData.append('repoUrl', submissionData.repoUrl);
      formData.append('demoUrl', submissionData.demoUrl);
      formData.append('videoUrl', submissionData.videoUrl);
      
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:5000/api/hackathons/submit', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Project submitted successfully! AI judging in progress...');
        setTimeout(() => {
          navigate(`/dashboard/student/hackathon/${hackathonId}/leaderboard`);
        }, 1000);
      } else {
        alert(data.message || 'Failed to submit project');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project');
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!hackathon) return '';
    const now = new Date();
    const end = new Date(hackathon.endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Time\'s up!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading project room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate('/dashboard/student/hackathon')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Hackathons
        </button>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{team?.teamName}</h1>
              <p className="text-gray-600">{hackathon?.title}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {getTimeRemaining()}
              </div>
              <button
                onClick={() => navigate(`/dashboard/student/hackathon/${hackathonId}/leaderboard`)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Trophy className="w-4 h-4" />
                View Leaderboard
              </button>
            </div>
          </div>

          {/* Team Members */}
          <div className="mt-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              Team: {team?.members.map(m => m.studentName).join(', ')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('problem')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'problem'
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
              : 'bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-white'
          }`}
        >
          <Target className="w-5 h-5 inline mr-2" />
          Problem Statement
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
              : 'bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-white'
          }`}
        >
          <MessageCircle className="w-5 h-5 inline mr-2" />
          Team Chat
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'submit'
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
              : 'bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-white'
          }`}
        >
          <Upload className="w-5 h-5 inline mr-2" />
          Submit Project
        </button>
        <button
          onClick={() => setActiveTab('ai-help')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'ai-help'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
              : 'bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-white'
          }`}
        >
          <Lightbulb className="w-5 h-5 inline mr-2" />
          AI Help ({team?.aiHelpRequested || 0})
        </button>
      </div>

      {/* Problem Statement Tab */}
      {activeTab === 'problem' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          {team?.problemStatement ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{team.problemStatement.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{team.problemStatement.description}</p>

              {team.problemStatement.requirements?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {team.problemStatement.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {team.problemStatement.deliverables?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Deliverables</h3>
                  <ul className="space-y-2">
                    {team.problemStatement.deliverables.map((del, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {team.problemStatement.techStack?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Suggested Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.problemStatement.techStack.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Problem statement is being generated...</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Team Chat Tab */}
      {activeTab === 'chat' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <div className="h-96 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-xl p-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages yet. Start chatting with your team!</p>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {msg.studentName?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">{msg.studentName || 'AI'}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm bg-white rounded-lg p-3">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              disabled={sendingMessage}
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      )}

      {/* Submit Project Tab */}
      {activeTab === 'submit' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          {team?.projectSubmission?.submittedAt ? (
            <div className="text-center py-12">
              <Trophy className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Submitted on {new Date(team.projectSubmission.submittedAt).toLocaleString()}
              </p>
              {team.finalScore !== undefined && (
                <div className="bg-green-50 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-4xl font-bold text-green-600 mb-2">{team.finalScore.toFixed(1)}/100</p>
                  <p className="text-gray-600">Final Score</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={submissionData.projectTitle}
                  onChange={(e) => setSubmissionData({ ...submissionData, projectTitle: e.target.value })}
                  required
                  placeholder="Enter your project title..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={submissionData.description}
                  onChange={(e) => setSubmissionData({ ...submissionData, description: e.target.value })}
                  required
                  rows={6}
                  placeholder="Describe your project, features, and implementation..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tech Stack *
                </label>
                <input
                  type="text"
                  value={submissionData.techStack}
                  onChange={(e) => setSubmissionData({ ...submissionData, techStack: e.target.value })}
                  required
                  placeholder="e.g., React, Node.js, MongoDB, AWS..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Repository URL *
                  </label>
                  <input
                    type="url"
                    value={submissionData.repoUrl}
                    onChange={(e) => setSubmissionData({ ...submissionData, repoUrl: e.target.value })}
                    required
                    placeholder="GitHub/GitLab URL"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={submissionData.demoUrl}
                    onChange={(e) => setSubmissionData({ ...submissionData, demoUrl: e.target.value })}
                    placeholder="Deployed app URL"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Video Demo URL
                  </label>
                  <input
                    type="url"
                    value={submissionData.videoUrl}
                    onChange={(e) => setSubmissionData({ ...submissionData, videoUrl: e.target.value })}
                    placeholder="YouTube/Vimeo URL"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Files (Screenshots, Documentation, etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-all">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="project-files"
                  />
                  <label htmlFor="project-files" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload files</p>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Project for Judging'}
              </button>
            </form>
          )}
        </motion.div>
      )}

      {/* AI Help Tab */}
      {activeTab === 'ai-help' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <div className="mb-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800 mb-1">AI Coding Assistant</p>
                <p className="text-sm text-gray-600">
                  Get help with your code, debug issues, or ask for implementation guidance.
                  The AI will provide hints and suggestions without giving direct solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded-xl p-4">
            {chatMessages.filter(m => m.role).length === 0 ? (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No questions yet. Ask the AI for help!</p>
              </div>
            ) : (
              chatMessages.filter(m => m.role).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAIHelp} className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask a coding question..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
              disabled={aiLoading}
            />
            <button
              type="submit"
              disabled={aiLoading || !aiQuestion.trim()}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectRoom;
