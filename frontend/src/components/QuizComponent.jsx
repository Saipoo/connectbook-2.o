import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, AlertCircle } from 'lucide-react';

const QuizComponent = ({ quizzes, onSubmit, courseId, enrollmentId }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = quizzes.filter(q => !answers[q._id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} questions remaining.`);
      return;
    }

    setLoading(true);
    
    // Format answers for API
    const formattedAnswers = Object.keys(answers).map(questionId => ({
      questionId,
      answer: answers[questionId]
    }));

    try {
      const result = await onSubmit(formattedAnswers);
      setResults(result);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && results) {
    const percentage = results.percentage || 0;
    const passed = percentage >= 50; // Changed from 60 to 50

    const handleRetake = () => {
      setSubmitted(false);
      setResults(null);
      setAnswers({});
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-orange-100'
            }`}
          >
            {passed ? (
              <Award className="w-12 h-12 text-green-600" />
            ) : (
              <AlertCircle className="w-12 h-12 text-orange-600" />
            )}
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {passed 
              ? 'You have successfully completed the quiz!' 
              : 'You scored less than 50%. Review the answers and try again!'}
          </p>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
            <div className="text-5xl font-bold mb-2">{percentage}%</div>
            <div className="text-lg">Your Score</div>
            <div className="text-sm mt-2 opacity-90">
              {results.score} out of {results.totalMarks} points
            </div>
          </div>

          {results.completed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
            >
              <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Course Completed! You can now generate your certificate.
              </p>
            </motion.div>
          )}

          {!passed && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleRetake}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Retake Quiz
            </motion.button>
          )}
        </div>

        {/* Answers Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Review Answers</h3>
          {results.evaluatedAnswers && results.evaluatedAnswers.map((answer, index) => {
            const question = quizzes.find(q => q._id === answer.questionId);
            return (
              <div
                key={answer.questionId}
                className={`p-4 rounded-lg border-2 ${
                  answer.isCorrect 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">
                      Q{index + 1}: {question?.question}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Your answer:</span> {answer.answer}
                    </p>
                    {!answer.isCorrect && answer.correctAnswer && (
                      <p className="text-green-600 mt-1">
                        <span className="font-medium">Correct answer:</span> {answer.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Quiz</h2>
        <p className="text-gray-600">
          Answer all questions to complete the course and earn your certificate.
        </p>
      </div>

      <div className="space-y-6">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-5 border border-gray-200"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {quiz.question}
                </h3>

                {quiz.options && quiz.options.length > 0 ? (
                  <div className="space-y-2">
                    {quiz.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[quiz._id] === option
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={quiz._id}
                          value={option}
                          checked={answers[quiz._id] === option}
                          onChange={(e) => handleAnswerChange(quiz._id, e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={answers[quiz._id] || ''}
                    onChange={(e) => handleAnswerChange(quiz._id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                )}

                <div className="mt-2 text-sm text-gray-500">
                  Points: {quiz.marks}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Quiz'}
      </motion.button>
    </div>
  );
};

export default QuizComponent;
