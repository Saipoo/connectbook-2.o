import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, CheckCircle, Play } from 'lucide-react';

const CourseCard = ({ course, onEnroll, onViewCourse, isStudent = true }) => {
  const {
    _id,
    title,
    description,
    category,
    thumbnailUrl,
    teacherName,
    estimatedDuration,
    level,
    enrollmentCount,
    isEnrolled,
    progress,
    completed
  } = course;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={`http://localhost:5000/${thumbnailUrl}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-600">
            {category}
          </span>
        </div>

        {/* Enrollment Status */}
        {isEnrolled && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Enrolled
            </span>
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            level === 'Beginner' ? 'bg-green-500 text-white' :
            level === 'Intermediate' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{teacherName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedDuration}h</span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Enrollment Count */}
        {!isStudent && (
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-semibold">{enrollmentCount || 0}</span> students enrolled
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          {isStudent && !isEnrolled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEnroll(_id)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Enroll Now
            </motion.button>
          )}

          {isStudent && isEnrolled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewCourse(_id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {completed ? 'Review Course' : 'Continue Learning'}
            </motion.button>
          )}

          {!isStudent && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewCourse(_id)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Manage Course
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
