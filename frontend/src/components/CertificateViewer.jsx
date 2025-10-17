import React from 'react';
import { motion } from 'framer-motion';
import { Download, Award, Calendar, User, BookOpen, X } from 'lucide-react';

const CertificateViewer = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${certificate.pdfUrl}`;
    link.download = `certificate-${certificate.certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Certificate of Completion</h2>
              <p className="text-blue-100">Congratulations on your achievement!</p>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-4 border-blue-200 mb-6">
            <div className="text-center mb-6">
              <div className="inline-block">
                <Award className="w-20 h-20 text-blue-600 mb-4" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                CERTIFICATE
              </h3>
              <p className="text-xl text-gray-600">OF COMPLETION</p>
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-700 mb-4">This is to certify that</p>
              <h4 className="text-3xl font-bold text-gray-900 mb-2">
                {certificate.studentName}
              </h4>
              <div className="w-64 h-px bg-gray-300 mx-auto mb-6" />
              <p className="text-gray-700 mb-2">has successfully completed the course</p>
              <h5 className="text-2xl font-bold text-blue-600">
                {certificate.courseName}
              </h5>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Completion Date</span>
                </div>
                <p className="text-gray-800 font-bold">
                  {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600 mb-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Instructor</span>
                </div>
                <p className="text-gray-800 font-bold">{certificate.teacherName}</p>
              </div>

              {certificate.totalQuizMarks > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 text-gray-600 mb-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-semibold">Quiz Score</span>
                  </div>
                  <p className="text-gray-800 font-bold">
                    {certificate.quizScore}/{certificate.totalQuizMarks} (
                    {((certificate.quizScore / certificate.totalQuizMarks) * 100).toFixed(1)}%)
                  </p>
                </div>
              )}

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600 mb-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Certificate ID</span>
                </div>
                <p className="text-gray-800 font-mono text-sm font-bold">
                  {certificate.certificateId}
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>ConnectBook - CourseMaster</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              Download Certificate
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CertificateViewer;
