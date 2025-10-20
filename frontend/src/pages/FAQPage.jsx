import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, 
  MessageSquare, Loader, Filter, X, CheckCircle, XCircle 
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const FAQPage = ({ userRole = 'student' }) => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedbackFAQ, setCurrentFeedbackFAQ] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    comment: '',
    suggestedQuestion: '',
    suggestedAnswer: ''
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Role-based colors
  const roleColors = {
    student: 'blue',
    teacher: 'purple',
    parent: 'green'
  };

  const color = roleColors[userRole] || 'blue';

  // Fetch categories and FAQs on mount
  useEffect(() => {
    fetchCategories();
    fetchFAQs();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/faq/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFAQs = async () => {
    console.log('🚀 fetchFAQs called - Current category:', selectedCategory, 'Search:', searchQuery);
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Always fetch ALL FAQs first, then filter on frontend
      const endpoint = `${API_URL}/api/faq`;

      console.log('🔍 Fetching FAQs from:', endpoint);
      console.log('📂 Selected Category:', selectedCategory);
      console.log('🔎 Search Query:', searchQuery);

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📦 API Response:', response.data);
      console.log('📋 FAQs received:', response.data.data?.faqs?.length || 0);
      console.log('📝 First FAQ:', response.data.data?.faqs?.[0]);

      const receivedFAQs = response.data.data?.faqs || [];
      console.log('🎯 Received FAQs array:', receivedFAQs);
      console.log('🎯 Is array?', Array.isArray(receivedFAQs));
      console.log('🎯 Length:', receivedFAQs.length);
      
      setFAQs(receivedFAQs);
      
      // Apply filters on frontend
      let filtered = receivedFAQs;
      
      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(faq => faq.category === selectedCategory);
        console.log('🔍 Filtered by category:', selectedCategory, '- Result:', filtered.length);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(faq => 
          faq.question.toLowerCase().includes(query) ||
          faq.shortAnswer.toLowerCase().includes(query) ||
          (faq.longAnswer && faq.longAnswer.toLowerCase().includes(query)) ||
          (faq.keywords && faq.keywords.some(k => k.toLowerCase().includes(query)))
        );
        console.log('🔍 Filtered by search:', searchQuery, '- Result:', filtered.length);
      }
      
      setFilteredFAQs(filtered);
      
      console.log('✅ State updated - total faqs:', receivedFAQs.length, 'filtered:', filtered.length);
    } catch (error) {
      console.error('❌ Error fetching FAQs:', error);
      console.error('Error response:', error.response?.data);
      setFAQs([]);
      setFilteredFAQs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    console.log('🔎 Search triggered:', query);
    setSearchQuery(query);
    // Don't reset category - keep current filter
  };

  const handleCategoryFilter = (category) => {
    console.log('📌 Category clicked:', category);
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const submitFeedback = async (faqId, wasHelpful) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/faq/${faqId}/feedback`,
        { wasHelpful },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setFaqs(prev => prev.map(faq => {
        if (faq._id === faqId) {
          return {
            ...faq,
            helpfulCount: wasHelpful ? faq.helpfulCount + 1 : faq.helpfulCount,
            notHelpfulCount: !wasHelpful ? faq.notHelpfulCount + 1 : faq.notHelpfulCount
          };
        }
        return faq;
      }));

      if (!wasHelpful) {
        setCurrentFeedbackFAQ(faqId);
        setShowFeedbackModal(true);
      } else {
        setFeedbackSuccess(true);
        setTimeout(() => setFeedbackSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const submitDetailedFeedback = async () => {
    if (!currentFeedbackFAQ) return;

    try {
      setSubmittingFeedback(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/faq/${currentFeedbackFAQ}/feedback`,
        {
          wasHelpful: false,
          ...feedbackForm
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowFeedbackModal(false);
      setFeedbackForm({ comment: '', suggestedQuestion: '', suggestedAnswer: '' });
      setCurrentFeedbackFAQ(null);
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting detailed feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <h1 className={`text-4xl font-bold text-${color}-600 mb-2`}>
          ❓ Frequently Asked Questions
        </h1>
        <p className="text-gray-600">
          Find answers to common questions about ConnectBook
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-6xl mx-auto mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search FAQs... (e.g., 'How do I reset my password?')"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-${color}-500 focus:outline-none transition-all shadow-sm"
          />
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-600" />
          <span className="font-medium text-gray-700">Filter by Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? `bg-${color}-600 text-white shadow-md`
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryFilter(cat.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.name
                  ? `bg-${color}-600 text-white shadow-md`
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* FAQs List */}
      <div className="max-w-6xl mx-auto">
        {/* Debug Panel */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm font-mono">
          <div><strong>🐛 DEBUG INFO:</strong></div>
          <div>Loading: {loading ? 'true' : 'false'}</div>
          <div>FAQs State: {faqs.length} items</div>
          <div>Filtered FAQs: {filteredFAQs.length} items</div>
          <div>Selected Category: {selectedCategory}</div>
          <div>Search Query: {searchQuery || 'none'}</div>
          <div>FAQs is Array: {Array.isArray(faqs) ? 'yes' : 'no'}</div>
          <div>FilteredFAQs is Array: {Array.isArray(filteredFAQs) ? 'yes' : 'no'}</div>
          {faqs.length > 0 && <div>First FAQ: {JSON.stringify(faqs[0]?.question).substring(0, 50)}...</div>}
        </div>
        {(() => {
          console.log('🎨 Rendering FAQs - Loading:', loading, 'FilteredFAQs:', filteredFAQs.length, 'All FAQs:', faqs.length);
          return null;
        })()}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-${color}-600" size={40} />
          </div>
        ) : filteredFAQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">
              {searchQuery 
                ? `No FAQs found for "${searchQuery}"`
                : 'No FAQs available in this category'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(faq._id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-1 rounded bg-${color}-100 text-${color}-700`}>
                        {faq.category}
                      </span>
                      {faq.viewCount > 10 && (
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {faq.shortAnswer}
                    </p>
                  </div>
                  {expandedFAQ === faq._id ? (
                    <ChevronUp className="text-gray-400 flex-shrink-0 ml-4" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0 ml-4" size={24} />
                  )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedFAQ === faq._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200"
                    >
                      <div className="px-6 py-4">
                        {/* Detailed Answer */}
                        <div className="prose max-w-none mb-4">
                          <div 
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: faq.longAnswer
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\n/g, '<br/>')
                            }}
                          />
                        </div>

                        {/* Related Features */}
                        {faq.relatedFeatures && faq.relatedFeatures.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Related Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {faq.relatedFeatures.map((feature, idx) => (
                                <a
                                  key={idx}
                                  href={feature.route}
                                  className={`inline-flex items-center px-3 py-1 rounded-lg bg-${color}-50 text-${color}-700 hover:bg-${color}-100 transition-colors text-sm`}
                                >
                                  {feature.name} →
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Feedback Section */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <p className="text-sm text-gray-600 mb-3">Was this answer helpful?</p>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => submitFeedback(faq._id, true)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                            >
                              <ThumbsUp size={16} />
                              <span className="text-sm font-medium">
                                Yes ({faq.helpfulCount || 0})
                              </span>
                            </button>
                            <button
                              onClick={() => submitFeedback(faq._id, false)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            >
                              <ThumbsDown size={16} />
                              <span className="text-sm font-medium">
                                No ({faq.notHelpfulCount || 0})
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Help Us Improve
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                We're sorry this answer wasn't helpful. Please tell us how we can improve it.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Comments
                  </label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                    placeholder="What was unclear or missing?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suggested Question (Optional)
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.suggestedQuestion}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, suggestedQuestion: e.target.value })}
                    placeholder="How would you phrase this question?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitDetailedFeedback}
                    disabled={submittingFeedback}
                    className={`flex-1 px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors disabled:opacity-50`}
                  >
                    {submittingFeedback ? (
                      <Loader className="animate-spin mx-auto" size={20} />
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {feedbackSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <CheckCircle size={20} />
            <span className="font-medium">Thank you for your feedback!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQPage;
