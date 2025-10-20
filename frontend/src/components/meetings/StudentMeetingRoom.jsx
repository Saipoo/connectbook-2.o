import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  MessageSquare,
  Hand,
  HandMetal,
  Maximize,
  Minimize,
  Circle
} from 'lucide-react';
import io from 'socket.io-client';

const StudentMeetingRoom = ({ lecture, studentInfo, onLeaveMeeting }) => {
  const [socket, setSocket] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
      stopAllMedia();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Join lecture meeting room
    socket.emit('join_lecture_meeting', {
      lectureId: lecture._id,
      userId: studentInfo.usn,
      userName: studentInfo.name,
      role: 'student'
    });

    // Listen for events
    socket.on('participant_joined', (data) => {
      setParticipants(prev => [...prev, data]);
    });

    socket.on('participant_left', (data) => {
      setParticipants(prev => prev.filter(p => p.userId !== data.userId));
    });

    socket.on('lecture_chat_message', (data) => {
      setChatMessages(prev => [...prev, data]);
    });

    socket.on('screen_share_started', () => {
      setScreenShareActive(true);
    });

    socket.on('screen_share_stopped', () => {
      setScreenShareActive(false);
    });

    socket.on('recording_status', (data) => {
      setIsRecording(data.isRecording);
    });

    socket.on('lecture_meeting_ended', () => {
      alert('The meeting has ended');
      if (onLeaveMeeting) onLeaveMeeting();
    });

    return () => {
      socket.off('participant_joined');
      socket.off('participant_left');
      socket.off('lecture_chat_message');
      socket.off('screen_share_started');
      socket.off('screen_share_stopped');
      socket.off('recording_status');
      socket.off('lecture_meeting_ended');
    };
  }, [socket, lecture, studentInfo]);

  const stopAllMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = async () => {
    if (!isVideoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsVideoOn(true);

        if (socket) {
          socket.emit('toggle_video', {
            lectureId: lecture._id,
            userId: studentInfo.usn,
            isVideoOn: true
          });
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera');
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      setIsVideoOn(false);

      if (socket) {
        socket.emit('toggle_video', {
          lectureId: lecture._id,
          userId: studentInfo.usn,
          isVideoOn: false
        });
      }
    }
  };

  const toggleAudio = async () => {
    if (!isAudioOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        // Add audio track to existing stream or create new one
        if (localStreamRef.current) {
          const audioTrack = stream.getAudioTracks()[0];
          localStreamRef.current.addTrack(audioTrack);
        } else {
          localStreamRef.current = stream;
        }

        setIsAudioOn(true);

        if (socket) {
          socket.emit('toggle_audio', {
            lectureId: lecture._id,
            userId: studentInfo.usn,
            isAudioOn: true
          });
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone');
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => track.stop());
      }
      setIsAudioOn(false);

      if (socket) {
        socket.emit('toggle_audio', {
          lectureId: lecture._id,
          userId: studentInfo.usn,
          isAudioOn: false
        });
      }
    }
  };

  const toggleHandRaise = () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);

    if (socket) {
      if (newState) {
        socket.emit('raise_hand', {
          lectureId: lecture._id,
          userId: studentInfo.usn,
          userName: studentInfo.name
        });
      } else {
        socket.emit('lower_hand', {
          lectureId: lecture._id,
          userId: studentInfo.usn
        });
      }
    }
  };

  const handleLeaveMeeting = () => {
    if (socket) {
      socket.emit('leave_lecture_meeting', {
        lectureId: lecture._id,
        userId: studentInfo.usn,
        userName: studentInfo.name
      });
    }

    stopAllMedia();

    if (onLeaveMeeting) {
      onLeaveMeeting();
    }
  };

  const sendChatMessage = () => {
    if (messageInput.trim() && socket) {
      const message = {
        lectureId: lecture._id,
        message: messageInput,
        userName: studentInfo.name,
        userId: studentInfo.usn,
        timestamp: new Date().toISOString()
      };

      socket.emit('lecture_chat_message', message);
      setMessageInput('');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-semibold text-lg">{lecture.title}</h2>
          <span className="text-gray-400 text-sm">{lecture.subject}</span>
          <span className="text-gray-400 text-sm">• Teacher: {lecture.teacherName}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-600 px-3 py-1 rounded-lg">
              <Circle className="w-2 h-2 fill-red-500 animate-pulse" />
              <span className="text-red-400 text-sm font-medium">Recording</span>
            </div>
          )}
          <span className="text-gray-400 text-sm">
            {participants.length + 1} {participants.length === 0 ? 'participant' : 'participants'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Teacher's Video/Screen (Main View) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {screenShareActive ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Teacher is sharing their screen</p>
                  <p className="text-gray-500 text-sm mt-2">Screen content will appear here</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Waiting for teacher's video...</p>
                </div>
              </div>
            )}
          </div>

          {/* Self View (if video is on) */}
          {isVideoOn && (
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                You
              </div>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-white" />
            ) : (
              <Maximize className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Sidebar - Chat */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 ${
                    msg.userId === studentInfo.usn ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{msg.userName}</span>
                    <span className="text-gray-300 text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-white text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Participants */}
        {showParticipants && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">
                Participants ({participants.length + 1})
              </h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Teacher */}
              <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {lecture.teacherName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{lecture.teacherName}</p>
                  <p className="text-gray-400 text-sm">Teacher</p>
                </div>
              </div>

              {/* You */}
              <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {studentInfo.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{studentInfo.name} (You)</p>
                  <p className="text-gray-400 text-sm">Student</p>
                </div>
                <div className="flex gap-1">
                  {isVideoOn && <Video className="w-4 h-4 text-green-500" />}
                  {isAudioOn && <Mic className="w-4 h-4 text-green-500" />}
                </div>
              </div>

              {/* Other Students */}
              {participants.filter(p => p.role === 'student').map((participant) => (
                <div key={participant.userId} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {participant.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{participant.userName}</p>
                    <p className="text-gray-400 text-sm">Student</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-colors ${
                isAudioOn
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isAudioOn ? 'Mute' : 'Unmute'}
            >
              {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOn
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleHandRaise}
              className={`p-4 rounded-full transition-colors ${
                isHandRaised
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={isHandRaised ? 'Lower hand' : 'Raise hand'}
            >
              <Hand className="w-5 h-5" />
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLeaveMeeting}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="font-medium">Leave Meeting</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`p-4 rounded-full transition-colors ${
                showParticipants
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title="Participants"
            >
              <Users className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-4 rounded-full transition-colors ${
                showChat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title="Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default StudentMeetingRoom;
