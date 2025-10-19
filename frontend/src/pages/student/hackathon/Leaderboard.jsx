import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Medal, Award, TrendingUp, Users, 
  Code, Target, Sparkles, Crown
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathonData();
    fetchLeaderboard();
    fetchMyTeam();
  }, [hackathonId]);

  const fetchHackathonData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setHackathon(data.data);
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setLeaderboard(data.data);
      } else {
        setLeaderboard([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/my-team`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setMyTeam(data.data);
      }
    } catch (error) {
      console.error('Error fetching my team:', error);
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-600" />;
      default:
        return <span className="text-2xl font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getPrizeForRank = (rank) => {
    if (!hackathon || !Array.isArray(hackathon.prizes)) return null;
    return hackathon.prizes.find(p => p.position === rank);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading leaderboard...</p>
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

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Leaderboard</h1>
              </div>
              <p className="text-green-100 text-lg">{hackathon?.title}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">
                {Array.isArray(leaderboard) ? leaderboard.length : 0}
              </div>
              <p className="text-green-100">Teams Competing</p>
            </div>
          </div>
        </div>

        {/* My Team Highlight */}
        {myTeam && myTeam.rank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${getRankColor(myTeam.rank)} rounded-2xl flex items-center justify-center`}>
                  {getRankIcon(myTeam.rank)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-1">Your Team</p>
                  <h3 className="text-2xl font-bold text-gray-800">{myTeam.teamName}</h3>
                  <p className="text-sm text-gray-600">Rank #{myTeam.rank} • Score: {myTeam.finalScore?.toFixed(1) || 0}/100</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/dashboard/student/hackathon/${hackathonId}/room`)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all"
              >
                View Project
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Top 3 Podium */}
      {Array.isArray(leaderboard) && leaderboard.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {/* Second Place */}
          <div className="order-1">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 text-center border-4 border-gray-300 mt-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Medal className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-bold text-gray-600 mb-2">2</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{leaderboard[1]?.teamName}</h3>
              <p className="text-3xl font-bold text-gray-600 mb-2">{leaderboard[1]?.finalScore.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mb-4">
                {leaderboard[1]?.members.length} members
              </p>
              {getPrizeForRank(2) && (
                <div className="bg-white rounded-xl p-3">
                  <p className="text-2xl font-bold text-gray-700">
                    ₹{getPrizeForRank(2).amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">{getPrizeForRank(2).description}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* First Place */}
          <div className="order-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 text-center border-4 border-yellow-400 relative"
            >
              <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-600" />
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <div className="text-7xl font-bold text-yellow-600 mb-2">1</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{leaderboard[0]?.teamName}</h3>
              <p className="text-4xl font-bold text-yellow-600 mb-2">{leaderboard[0]?.finalScore.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mb-4">
                {leaderboard[0]?.members.length} members
              </p>
              {getPrizeForRank(1) && (
                <div className="bg-white rounded-xl p-4">
                  <p className="text-3xl font-bold text-yellow-600">
                    ₹{getPrizeForRank(1).amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">{getPrizeForRank(1).description}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Third Place */}
          <div className="order-3">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 text-center border-4 border-orange-300 mt-12"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Medal className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-bold text-orange-600 mb-2">3</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{leaderboard[2]?.teamName}</h3>
              <p className="text-3xl font-bold text-orange-600 mb-2">{leaderboard[2]?.finalScore.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mb-4">
                {leaderboard[2]?.members.length} members
              </p>
              {getPrizeForRank(3) && (
                <div className="bg-white rounded-xl p-3">
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{getPrizeForRank(3).amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">{getPrizeForRank(3).description}</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Complete Rankings
        </h2>

        {!Array.isArray(leaderboard) || leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No submissions yet</p>
            <p className="text-gray-400 text-sm">Be the first to submit your project!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((team, index) => (
              <motion.div
                key={team._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  myTeam?._id === team._id
                    ? 'bg-blue-50 border-2 border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Rank */}
                <div className={`w-16 h-16 bg-gradient-to-br ${getRankColor(team.rank)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {team.rank <= 3 ? (
                    getRankIcon(team.rank)
                  ) : (
                    <span className="text-xl font-bold text-white">#{team.rank}</span>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {team.teamName}
                    {myTeam?._id === team._id && (
                      <span className="ml-2 text-sm font-normal text-blue-600">(Your Team)</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {team.members.length} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Score: {team.finalScore.toFixed(1)}/100
                    </span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="hidden md:grid grid-cols-5 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Code</p>
                    <p className="text-sm font-bold text-gray-700">{team.scores?.codeQuality || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Creativity</p>
                    <p className="text-sm font-bold text-gray-700">{team.scores?.creativity || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Function</p>
                    <p className="text-sm font-bold text-gray-700">{team.scores?.functionality || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">UI/UX</p>
                    <p className="text-sm font-bold text-gray-700">{team.scores?.uiux || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Collab</p>
                    <p className="text-sm font-bold text-gray-700">{team.scores?.collaboration || 0}</p>
                  </div>
                </div>

                {/* Prize (if applicable) */}
                {team.rank <= 3 && getPrizeForRank(team.rank) && (
                  <div className="text-right">
                    <Award className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-800">
                      ₹{getPrizeForRank(team.rank).amount.toLocaleString()}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Stats */}
      {Array.isArray(leaderboard) && leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{leaderboard.length}</p>
            <p className="text-sm text-gray-600">Total Teams</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {leaderboard[0]?.finalScore?.toFixed(1) || 0}
            </p>
            <p className="text-sm text-gray-600">Highest Score</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <Code className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {leaderboard.length > 0 
                ? (leaderboard.reduce((sum, t) => sum + (t.finalScore || 0), 0) / leaderboard.length).toFixed(1)
                : 0
              }
            </p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {leaderboard.reduce((sum, t) => sum + (Array.isArray(t.members) ? t.members.length : 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Participants</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;
