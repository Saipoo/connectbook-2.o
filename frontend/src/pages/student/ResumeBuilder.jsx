import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  FileText,
  Download,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Edit,
  Eye,
  Save,
  RefreshCw,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState('choose'); // choose, generate, edit, preview
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showOptimize, setShowOptimize] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and minimalist design', color: 'indigo' },
    { id: 'classic', name: 'Classic', description: 'Traditional professional format', color: 'gray' },
    { id: 'technical', name: 'Technical', description: 'Perfect for developers', color: 'blue' },
    { id: 'creative', name: 'Creative', description: 'Stand out with colors', color: 'purple' }
  ];

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const fetchSavedResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/career/resume/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSavedResumes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const generateResume = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/api/career/resume/generate`,
        { template: selectedTemplate, jobDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setGeneratedResume(response.data.data);
        setActiveStep('edit');
        fetchSavedResumes();
        alert('✨ Resume generated successfully!');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const optimizeResume = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/api/career/resume/optimize`,
        { 
          resumeContent: generatedResume.content,
          jobDescription 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setOptimizationResults(response.data.data);
        setShowOptimize(true);
      }
    } catch (error) {
      console.error('Error optimizing resume:', error);
      alert('Failed to optimize resume');
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (section, text) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/api/career/resume/suggest`,
        { section, currentText: text, context: jobDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuggestions(response.data.data);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  };

  const deleteResume = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/career/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Resume deleted successfully');
      fetchSavedResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  const exportToPDF = () => {
    alert('PDF export coming soon! For now, use browser print (Ctrl+P) and save as PDF.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                AI Resume Builder
              </h1>
              <p className="text-gray-600 mt-2">Create ATS-optimized resumes like CareerFlow.ai</p>
            </div>
            {savedResumes.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Saved Resumes</p>
                <p className="text-2xl font-bold text-indigo-600">{savedResumes.length}</p>
              </div>
            )}
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            {['choose', 'generate', 'edit', 'preview'].map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    activeStep === step
                      ? 'bg-indigo-600 text-white'
                      : idx < ['choose', 'generate', 'edit', 'preview'].indexOf(activeStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx < ['choose', 'generate', 'edit', 'preview'].indexOf(activeStep) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">{step}</span>
                {idx < 3 && <div className="w-16 h-1 bg-gray-200 mx-4"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step: Choose Template */}
        {activeStep === 'choose' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Template</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`cursor-pointer rounded-xl p-6 border-2 transition hover:shadow-lg ${
                    selectedTemplate === template.id
                      ? `border-${template.color}-500 bg-${template.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className={`w-12 h-12 text-${template.color}-600 mb-4`} />
                  <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  {selectedTemplate === template.id && (
                    <div className="mt-4 flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description (Optional - helps optimize resume)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get ATS-optimized keywords..."
                rows={6}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActiveStep('generate');
                  generateResume();
                }}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Resume with AI
              </button>
            </div>
          </div>
        )}

        {/* Step: Generating */}
        {activeStep === 'generate' && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Sparkles className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Resume</h2>
            <p className="text-gray-600">AI is analyzing your profile and crafting the perfect resume...</p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Step: Edit Resume */}
        {activeStep === 'edit' && generatedResume && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor Panel */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Resume</h2>
                <div className="flex gap-2">
                  <button
                    onClick={optimizeResume}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Optimize
                  </button>
                  <button
                    onClick={() => setActiveStep('preview')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Resume Content Editor */}
              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Professional Summary
                  </label>
                  <textarea
                    value={generatedResume.content.summary || ''}
                    onChange={(e) => {
                      setGeneratedResume({
                        ...generatedResume,
                        content: { ...generatedResume.content, summary: e.target.value }
                      });
                      getSuggestions('summary', e.target.value);
                    }}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Technical Skills
                  </label>
                  <input
                    type="text"
                    value={generatedResume.content.skills?.technical?.join(', ') || ''}
                    onChange={(e) => {
                      setGeneratedResume({
                        ...generatedResume,
                        content: {
                          ...generatedResume.content,
                          skills: {
                            ...generatedResume.content.skills,
                            technical: e.target.value.split(',').map(s => s.trim())
                          }
                        }
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Comma-separated skills"
                  />
                </div>

                {/* Projects */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Projects
                  </label>
                  {(generatedResume.content.projects || []).map((project, idx) => (
                    <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => {
                          const newProjects = [...generatedResume.content.projects];
                          newProjects[idx].title = e.target.value;
                          setGeneratedResume({
                            ...generatedResume,
                            content: { ...generatedResume.content, projects: newProjects }
                          });
                        }}
                        className="w-full px-3 py-2 border rounded mb-2 font-bold"
                        placeholder="Project Title"
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const newProjects = [...generatedResume.content.projects];
                          newProjects[idx].description = e.target.value;
                          setGeneratedResume({
                            ...generatedResume,
                            content: { ...generatedResume.content, projects: newProjects }
                          });
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Project Description"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                AI Suggestions
              </h3>
              
              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Start editing to get AI-powered suggestions!</p>
              )}
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {activeStep === 'preview' && generatedResume && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStep('edit')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Resume Preview Content */}
            <div className="max-w-4xl mx-auto border-2 border-gray-200 rounded-lg p-8 bg-white">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Your Name'}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-indigo-600 pb-1">
                  Professional Summary
                </h2>
                <p className="text-gray-700">{generatedResume.content.summary}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-indigo-600 pb-1">
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(generatedResume.content.skills?.technical || []).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-indigo-600 pb-1">
                  Projects
                </h2>
                {(generatedResume.content.projects || []).map((project, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-700">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-gray-500 mt-1">
                        <strong>Technologies:</strong> {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Certifications */}
              {generatedResume.content.certifications && generatedResume.content.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-indigo-600 pb-1">
                    Certifications
                  </h2>
                  <ul className="list-disc list-inside text-gray-700">
                    {generatedResume.content.certifications.map((cert, idx) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saved Resumes */}
        {activeStep === 'choose' && savedResumes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Saved Resumes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResumes.map((resume, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 capitalize">{resume.template}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(resume.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteResume(resume._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setGeneratedResume(resume);
                      setActiveStep('preview');
                    }}
                    className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Resume
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimization Modal */}
        {showOptimize && optimizationResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900">Optimization Results</h3>
                <button
                  onClick={() => setShowOptimize(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 text-center">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {optimizationResults.atsScore}/100
                  </div>
                  <p className="text-gray-600">ATS Compatibility Score</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {optimizationResults.suggestions.keywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Content Improvements</h4>
                    <ul className="space-y-2">
                      {optimizationResults.suggestions.content.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setGeneratedResume({
                        ...generatedResume,
                        content: optimizationResults.optimizedResume
                      });
                      setShowOptimize(false);
                      alert('✨ Resume optimized successfully!');
                    }}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Apply Optimizations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
