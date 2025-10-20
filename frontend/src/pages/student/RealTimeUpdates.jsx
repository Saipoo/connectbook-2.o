import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  Briefcase,
  Heart,
  Rocket,
  Brain,
  BookOpen,
  X,
  Loader,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RealTimeUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUpdates, setTotalUpdates] = useState(0);

  const categories = [
    { id: 'all', label: 'All Updates', icon: Newspaper, color: 'indigo' },
    { id: 'education', label: 'Education', icon: BookOpen, color: 'blue' },
    { id: 'ai-tech', label: 'AI & Tech', icon: Brain, color: 'purple' },
    { id: 'jobs-internships', label: 'Jobs & Internships', icon: Briefcase, color: 'green' },
    { id: 'motivation', label: 'Motivation', icon: Heart, color: 'pink' },
    { id: 'startups-ceos', label: 'Startups & CEOs', icon: Rocket, color: 'orange' },
    { id: 'general-knowledge', label: 'General Knowledge', icon: Lightbulb, color: 'yellow' }
  ];

  const fetchUpdates = useCallback(async (pageNum = 1, reset = false) => {
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: pageNum,
        limit: 10,
        sortBy: 'postedAt',
        order: 'desc'
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await axios.get(`${API_URL}/api/updates`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        const newUpdates = response.data.data;
        setUpdates(reset ? newUpdates : [...updates, ...newUpdates]);
        setHasMore(response.data.page < response.data.pages);
        setTotalUpdates(response.data.total);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      toast.error('Failed to load updates');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, updates]);

  useEffect(() => {
    setLoading(true);
    setUpdates([]);
    setPage(1);
    fetchUpdates(1, true);
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchUpdates(page + 1, false);
    }
  };

  const openUpdateDetail = async (update) => {
    setSelectedUpdate(update);
    
    // Record view
    try {
      const token = localStorage.getItem('token');
      await axios.get(`${API_URL}/api/updates/${update._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const closeUpdateDetail = () => {
    setSelectedUpdate(null);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return posted.toLocaleDateString();
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Newspaper;
  };

  const UpdateCard = ({ update }) => {
    const Icon = getCategoryIcon(update.category);
    const color = getCategoryColor(update.category);

    return (
      <div
        onClick={() => openUpdateDetail(update)}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-indigo-300"
      >
        {update.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img
              src={update.imageUrl}
              alt={update.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
              <Icon className="w-3 h-3 mr-1" />
              {categories.find(c => c.id === update.category)?.label}
            </span>
            
            {update.aiGenerated && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Curated
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600">
            {update.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {update.summary}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTimeAgo(update.postedAt)}
              </span>
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {update.viewCount || 0} views
              </span>
            </div>
            
            {update.priority >= 8 && (
              <span className="flex items-center text-orange-600 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const UpdateDetailModal = ({ update }) => {
    if (!update) return null;

    const Icon = getCategoryIcon(update.category);
    const color = getCategoryColor(update.category);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800`}>
                <Icon className="w-4 h-4 mr-1" />
                {categories.find(c => c.id === update.category)?.label}
              </span>
              {update.aiGenerated && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Curated
                </span>
              )}
            </div>
            <button
              onClick={closeUpdateDetail}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {update.imageUrl && (
              <div className="h-64 overflow-hidden">
                <img
                  src={update.imageUrl}
                  alt={update.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {update.title}
              </h2>

              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTimeAgo(update.postedAt)}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {update.viewCount || 0} views
                </span>
                {update.priority >= 8 && (
                  <span className="flex items-center text-orange-600 font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Trending
                  </span>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {update.summary}
                </p>
              </div>

              {/* Detailed Content */}
              {update.detailedContent && (
                <div className="prose max-w-none mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Full Details</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {update.detailedContent}
                  </p>
                </div>
              )}

              {/* Key Points */}
              {update.keyPoints && update.keyPoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2 text-indigo-600" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {update.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Why It Matters */}
              {update.whyItMatters && (
                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Why It Matters
                  </h3>
                  <p className="text-indigo-800">
                    {update.whyItMatters}
                  </p>
                </div>
              )}

              {/* Related Resources */}
              {update.relatedResources && update.relatedResources.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Related Resources</h3>
                  <div className="space-y-2">
                    {update.relatedResources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-700">{resource.title}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Link */}
              {update.sourceLink && (
                <div className="border-t border-gray-200 pt-4">
                  <a
                    href={update.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Read more at source
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              )}

              {/* Tags */}
              {update.tags && update.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {update.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Newspaper className="w-8 h-8 mr-3 text-indigo-600" />
                Real-Time Updates
              </h1>
              <p className="text-gray-600 mt-2">
                Stay updated with the latest in education, technology, careers, and more
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Updates</p>
              <p className="text-2xl font-bold text-indigo-600">{totalUpdates}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-3 pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? `bg-${category.color}-600 text-white shadow-md`
                      : `bg-white text-gray-700 hover:bg-${category.color}-50 border border-gray-200`
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Updates Grid */}
        {loading && updates.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No updates found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {updates.map((update) => (
                <UpdateCard key={update._id} update={update} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Update Detail Modal */}
      {selectedUpdate && <UpdateDetailModal update={selectedUpdate} />}
    </div>
  );
};

export default RealTimeUpdates;
