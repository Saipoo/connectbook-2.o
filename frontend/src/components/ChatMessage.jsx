import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiFile, FiDownload, FiCheckCircle, FiCheck, 
  FiVideo, FiImage, FiMusic 
} from 'react-icons/fi';

const ChatMessage = ({ message, isSender, senderName }) => {
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <FiImage className="w-5 h-5" />;
    } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
      return <FiMusic className="w-5 h-5" />;
    } else if (['mp4', 'webm', 'mov'].includes(ext)) {
      return <FiVideo className="w-5 h-5" />;
    }
    return <FiFile className="w-5 h-5" />;
  };

  const getFileUrl = (fileUrl) => {
    if (fileUrl?.startsWith('http')) return fileUrl;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${fileUrl}`;
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        );

      case 'file':
        const isImage = message.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        return (
          <div className="space-y-2">
            {isImage && (
              <img 
                src={getFileUrl(message.fileUrl)} 
                alt={message.fileName}
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition"
                onClick={() => window.open(getFileUrl(message.fileUrl), '_blank')}
              />
            )}
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-lg">
              <div className="text-blue-600 dark:text-blue-400">
                {getFileIcon(message.fileName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.fileName}</p>
                <p className="text-xs text-gray-500">
                  {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : 'File'}
                </p>
              </div>
              <a
                href={getFileUrl(message.fileUrl)}
                download={message.fileName}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                <FiDownload className="w-5 h-5" />
              </a>
            </div>
            {message.content && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                {message.content}
              </p>
            )}
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-2">
            <audio controls className="w-full max-w-xs">
              <source src={getFileUrl(message.fileUrl)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            {message.content && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {message.content}
              </p>
            )}
          </div>
        );

      case 'meeting_link':
        // Extract meeting link from content
        const extractLink = () => {
          // Try to extract URL from content string
          const urlMatch = message.content?.match(/(https?:\/\/[^\s]+)/);
          return urlMatch ? urlMatch[1] : message.fileUrl;
        };
        
        const meetingLink = extractLink();
        
        return (
          <div className="space-y-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <FiVideo className="w-5 h-5" />
              <p className="font-semibold text-sm">Video Meeting Invitation</p>
            </div>
            {message.content && (
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {/* Display content without the raw link */}
                {message.content.split('Click to join:')[0]}
              </div>
            )}
            {meetingLink && (
              <button
                onClick={() => window.open(meetingLink, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiVideo className="w-4 h-4" />
                Join Meeting
              </button>
            )}
          </div>
        );

      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] min-w-[200px] ${
          isSender
            ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-r-2xl rounded-tl-2xl'
        } p-3 shadow-md overflow-hidden`}
      >
        {!isSender && senderName && (
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            {senderName}
          </p>
        )}
        
        <div className="mb-2 overflow-hidden">
          {renderMessageContent()}
        </div>

        <div className="flex items-center justify-end gap-2 text-xs opacity-70">
          <span>{formatTime(message.createdAt)}</span>
          {isSender && (
            <span>
              {message.seen ? (
                <FiCheckCircle className="w-3 h-3 text-blue-300" />
              ) : message.delivered ? (
                <FiCheck className="w-3 h-3" />
              ) : (
                <FiCheck className="w-3 h-3 opacity-50" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
