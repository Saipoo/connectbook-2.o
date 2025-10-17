import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class MentorSocket {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Connect to Socket.io server
  connect(userId) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Mentor Socket connected:', this.socket.id);
      if (userId) {
        this.socket.emit('user_online', userId);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Mentor Socket connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('👋 Mentor Socket disconnected');
    });

    // Re-emit all registered listeners
    this.listeners.forEach((callback, event) => {
      this.socket.on(event, callback);
    });
  }

  // Disconnect from Socket.io server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a chat room
  joinRoom(roomId, userId) {
    if (this.socket?.connected) {
      this.socket.emit('join_room', { roomId, userId });
    }
  }

  // Send a message
  sendMessage(message) {
    if (this.socket?.connected) {
      this.socket.emit('send_message', message);
    }
  }

  // Send typing indicator
  sendTyping(receiverId, senderName, isTyping) {
    if (this.socket?.connected) {
      this.socket.emit('user_typing', { receiverId, senderName, isTyping });
    }
  }

  // Join meeting room
  joinMeeting(meetingId) {
    if (this.socket?.connected) {
      this.socket.emit('join_meeting', meetingId);
    }
  }

  // Leave meeting room
  leaveMeeting(meetingId) {
    if (this.socket?.connected) {
      this.socket.emit('leave_meeting', meetingId);
    }
  }

  // WebRTC signaling
  sendWebRTCOffer(meetingId, offer, targetSocketId) {
    if (this.socket?.connected) {
      this.socket.emit('webrtc_offer', { meetingId, offer, targetSocketId });
    }
  }

  sendWebRTCAnswer(meetingId, answer, targetSocketId) {
    if (this.socket?.connected) {
      this.socket.emit('webrtc_answer', { meetingId, answer, targetSocketId });
    }
  }

  sendICECandidate(meetingId, candidate, targetSocketId) {
    if (this.socket?.connected) {
      this.socket.emit('webrtc_ice_candidate', { meetingId, candidate, targetSocketId });
    }
  }

  // Listen to events
  on(event, callback) {
    this.listeners.set(event, callback);
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove event listener
  off(event) {
    this.listeners.delete(event);
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Check if connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const mentorSocket = new MentorSocket();
export default mentorSocket;
