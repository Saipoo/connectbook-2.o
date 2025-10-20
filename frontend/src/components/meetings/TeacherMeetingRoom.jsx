import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Users,
  MessageSquare,
  Settings,
  Circle,
  Hand,
  MoreVertical,
  Maximize,
  Minimize
} from 'lucide-react';
import io from 'socket.io-client';
import RecordRTC from 'recordrtc';

const TeacherMeetingRoom = ({ lecture, onEndMeeting }) => {
  const [socket, setSocket] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Get user media
    initializeMedia();

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
      userId: lecture.teacherUSN,
      userName: lecture.teacherName,
      role: 'teacher'
    });

    // Listen for participants
    socket.on('participant_joined', (data) => {
      setParticipants(prev => [...prev, data]);
    });

    socket.on('participant_left', (data) => {
      setParticipants(prev => prev.filter(p => p.userId !== data.userId));
    });

    socket.on('current_participants', (data) => {
      console.log(`Current participants: ${data.count}`);
    });

    // Listen for chat messages
    socket.on('lecture_chat_message', (data) => {
      setChatMessages(prev => [...prev, data]);
    });

    // Listen for hand raise
    socket.on('hand_raised', (data) => {
      // Show notification
      alert(`${data.userName} raised their hand`);
    });

    return () => {
      socket.off('participant_joined');
      socket.off('participant_left');
      socket.off('lecture_chat_message');
      socket.off('hand_raised');
    };
  }, [socket, lecture]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const stopAllMedia = (keepRecorder = false) => {
    // Stop local video/audio tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
    }
    
    // Stop screen share tracks
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      screenStreamRef.current = null;
    }
    
    // Only destroy recorder if keepRecorder is false (not when we need the blob)
    if (!keepRecorder && recorderRef.current) {
      try {
        if (recorderRef.current.state === 'recording') {
          recorderRef.current.stopRecording(() => {
            recorderRef.current.destroy();
            recorderRef.current = null;
          });
        } else {
          recorderRef.current.destroy();
          recorderRef.current = null;
        }
      } catch (error) {
        console.error('Error stopping recorder:', error);
        recorderRef.current = null;
      }
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
        
        if (socket) {
          socket.emit('toggle_video', {
            lectureId: lecture._id,
            userId: lecture.teacherUSN,
            isVideoOn: videoTrack.enabled
          });
        }
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
        
        if (socket) {
          socket.emit('toggle_audio', {
            lectureId: lecture._id,
            userId: lecture.teacherUSN,
            isAudioOn: audioTrack.enabled
          });
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      
      if (socket) {
        socket.emit('stop_screen_share', {
          lectureId: lecture._id,
          userId: lecture.teacherUSN
        });
      }
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });

        screenStreamRef.current = screenStream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream;
        }

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (socket) {
            socket.emit('stop_screen_share', {
              lectureId: lecture._id,
              userId: lecture.teacherUSN
            });
          }
        };

        setIsScreenSharing(true);
        
        if (socket) {
          socket.emit('start_screen_share', {
            lectureId: lecture._id,
            userId: lecture.teacherUSN
          });
        }
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    }
  };

  const startRecording = async () => {
    try {
      // Combine local video/audio and screen share if available
      let combinedStream;
      
      if (isScreenSharing && screenStreamRef.current) {
        // Record screen + audio
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        combinedStream = new MediaStream([
          ...screenStreamRef.current.getVideoTracks(),
          audioTrack
        ]);
      } else {
        // Record camera + audio
        combinedStream = localStreamRef.current;
      }

      const recorder = new RecordRTC(combinedStream, {
        type: 'video',
        mimeType: 'video/webm',
        videoBitsPerSecond: 2500000,
        frameRate: 30
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      recordedChunksRef.current = [];
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      if (socket) {
        socket.emit('recording_started', { lectureId: lecture._id });
      }

      console.log('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording');
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      console.log('🎥 stopRecording() called, isRecording:', isRecording);
      console.log('🎥 recorderRef.current exists:', !!recorderRef.current);
      
      if (recorderRef.current) {
        try {
          console.log('Stopping RecordRTC...');
          recorderRef.current.stopRecording(() => {
            console.log('RecordRTC stopped, getting blob...');
            
            // Check if recorder still exists
            if (!recorderRef.current) {
              console.error('❌ Recorder was destroyed before getting blob!');
              resolve(null);
              return;
            }
            
            const blob = recorderRef.current.getBlob();
            console.log('🎯 getBlob() returned:', blob ? `${blob.size} bytes` : 'null');
            
            if (!blob || blob.size === 0) {
              console.error('❌ Blob is empty or null!');
              resolve(null);
              return;
            }
            
            console.log('✅ Got recording blob:', blob.size, 'bytes (', (blob.size / 1024 / 1024).toFixed(2), 'MB )');
            console.log('   - Blob type:', blob.type);
            
            // Store in ref to preserve it
            recordedChunksRef.current = [blob]; // Replace array with just the final blob
            
            setIsRecording(false);
            
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }

            if (socket) {
              socket.emit('recording_stopped', { lectureId: lecture._id });
            }

            console.log('🚀 Resolving Promise with blob of size:', blob.size);
            // IMPORTANT: Don't destroy recorder here - let handleEndMeeting do it after upload
            resolve(blob);
          });
        } catch (error) {
          console.error('❌ Error in stopRecording try block:', error);
          setIsRecording(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          resolve(null);
        }
      } else {
        console.error('❌ No recorder found when trying to stop recording');
        setIsRecording(false);
        resolve(null);
      }
    });
  };

  const handleEndMeeting = async () => {
    try {
      let recordingBlob = null;

      // Step 1: Stop recording and get blob FIRST (before destroying anything)
      // Check both isRecording state AND if recorder exists
      if (isRecording || recorderRef.current) {
        console.log('🎬 Attempting to get recording...');
        console.log('   - isRecording:', isRecording);
        console.log('   - recorderRef.current exists:', !!recorderRef.current);
        console.log('   - recordedChunksRef.current:', recordedChunksRef.current);
        
        // First check if we already have the blob in ref (from manual stop)
        if (recordedChunksRef.current && recordedChunksRef.current.length > 0) {
          console.log('✅ Found existing blob in recordedChunksRef!');
          recordingBlob = recordedChunksRef.current[0];
          console.log('   - Blob size:', recordingBlob.size);
        } else if (isRecording && recorderRef.current) {
          // Still recording, need to stop it
          console.log('🎬 Still recording, calling stopRecording()...');
          recordingBlob = await stopRecording();
        }
        
        console.log('📦 After getting blob:');
        console.log('   - recordingBlob:', recordingBlob);
        console.log('   - recordingBlob type:', typeof recordingBlob);
        console.log('   - recordingBlob instanceof Blob:', recordingBlob instanceof Blob);
        console.log('   - recordingBlob?.size:', recordingBlob?.size);
        
        // Create a new Blob to ensure it persists after recorder destruction
        if (recordingBlob && recordingBlob.size > 0) {
          const originalSize = recordingBlob.size;
          const originalType = recordingBlob.type;
          recordingBlob = new Blob([recordingBlob], { type: originalType });
          console.log('✅ Blob cloned for persistence:');
          console.log('   - Original size:', originalSize);
          console.log('   - Cloned size:', recordingBlob.size);
          console.log('   - Type:', recordingBlob.type);
        } else {
          console.error('❌ Cannot clone blob - it is null or empty!');
        }
      } else {
        console.log('⚠️ No recording to process');
      }

      // Step 2: Stop media streams FIRST (before notifying, to release resources)
      console.log('🛑 Stopping all media streams...');
      stopAllMedia(true); // Always keep recorder for now

      // Step 3: Notify participants
      if (socket) {
        socket.emit('leave_lecture_meeting', {
          lectureId: lecture._id,
          userId: lecture.teacherUSN,
          userName: lecture.teacherName
        });
      }

      // Step 4: Call parent callback with recording blob
      if (onEndMeeting) {
        console.log('📤 Calling onEndMeeting with blob:', recordingBlob?.size, 'bytes');
        await onEndMeeting(recordingBlob);
        console.log('✅ onEndMeeting completed');
      }

      // Step 5: NOW destroy the recorder after upload is complete
      if (recorderRef.current) {
        console.log('🗑️ Destroying recorder after upload...');
        try {
          recorderRef.current.destroy();
          recorderRef.current = null;
          console.log('✅ Recorder destroyed');
        } catch (error) {
          console.error('Error destroying recorder:', error);
        }
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
      // Still try to cleanup
      stopAllMedia();
      if (onEndMeeting) {
        onEndMeeting(null);
      }
    }
  };

  const sendChatMessage = () => {
    if (messageInput.trim() && socket) {
      const message = {
        lectureId: lecture._id,
        message: messageInput,
        userName: lecture.teacherName,
        userId: lecture.teacherUSN,
        timestamp: new Date().toISOString()
      };

      socket.emit('lecture_chat_message', message);
      setMessageInput('');
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        </div>
        
        <div className="flex items-center gap-4">
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg">
              <Circle className="w-3 h-3 fill-white animate-pulse" />
              <span className="text-white font-medium">{formatDuration(recordingDuration)}</span>
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
          {/* Main Video (Screen Share or Local Video) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isScreenSharing ? (
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Self View (Picture-in-Picture) */}
          {isScreenSharing && (
            <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Video Overlay Info */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white font-medium">{lecture.teacherName} (You)</p>
            <p className="text-gray-300 text-sm">Teacher</p>
          </div>

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
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{msg.userName}</span>
                    <span className="text-gray-400 text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{msg.message}</p>
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
              {/* Teacher (You) */}
              <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {lecture.teacherName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{lecture.teacherName}</p>
                  <p className="text-gray-400 text-sm">Teacher (You)</p>
                </div>
                <Mic className={`w-4 h-4 ${isAudioOn ? 'text-green-500' : 'text-red-500'}`} />
              </div>

              {/* Students */}
              {participants.map((participant) => (
                <div key={participant.userId} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
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
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-colors ${
                isScreenSharing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              {isScreenSharing ? (
                <MonitorOff className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
              >
                <Circle className="w-4 h-4 fill-white" />
                <span className="font-medium">Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
              >
                <Circle className="w-4 h-4" />
                <span className="font-medium">Stop Recording</span>
              </button>
            )}

            <button
              onClick={handleEndMeeting}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="font-medium">End Meeting</span>
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

            <button
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMeetingRoom;
