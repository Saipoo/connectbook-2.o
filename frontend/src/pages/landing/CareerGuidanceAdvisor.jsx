import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Target, Briefcase, TrendingUp, BookOpen, Award, Users, Lightbulb } from 'lucide-react';

const CareerGuidanceAdvisor = () => {
  useEffect(() => {
    document.title = "AI Career Advisor for Students | ConnectBook - Smart Career Planning & Guidance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Personalized AI career guidance for students. Career assessments, skill gap analysis, industry insights, and customized roadmaps for successful career planning.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">AI Career Guidance & Advisor</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Navigate your career journey with confidence. Get personalized career assessments, 
            industry insights, skill recommendations, and customized career roadmaps powered by AI.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Career Guidance
            </Link>
            <Link to="/about" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
              Explore Careers
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Personalized Career Planning with Artificial Intelligence</h2>
          <p className="text-lg text-gray-700 mb-4">
            ConnectBook's AI Career Advisor helps students make informed career decisions by providing comprehensive career 
            assessments, analyzing their strengths and interests, mapping skills to career opportunities, and creating 
            personalized roadmaps for success. Our advanced AI considers thousands of career paths, industry trends, 
            skill requirements, and individual preferences to deliver guidance that's both realistic and aspirational.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Many students struggle with career uncertainty, choosing paths that don't align with their strengths, or lacking 
            awareness of emerging opportunities. Our AI Career Advisor addresses these challenges by conducting in-depth 
            assessments of your skills, interests, values, and personality. It then matches you with suitable careers, 
            identifies skill gaps, recommends learning paths, connects you with mentors, and provides industry insights—
            all personalized to your unique profile and goals.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Comprehensive Career Guidance Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Compass className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Career Assessment</h3>
              <p className="text-gray-700">
                Complete comprehensive assessments analyzing your personality, interests, values, skills, and work 
                preferences. AI generates detailed career compatibility reports with specific job recommendations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Target className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Skill Gap Analysis</h3>
              <p className="text-gray-700">
                Identify exactly which skills you need to develop for your target careers. AI compares your current 
                abilities with industry requirements and prioritizes learning based on career goals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Industry Insights & Trends</h3>
              <p className="text-gray-700">
                Stay informed about job market trends, emerging roles, salary expectations, growth projections, and 
                industry demands. AI provides real-time data to help you make informed career decisions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Personalized Career Roadmap</h3>
              <p className="text-gray-700">
                Receive step-by-step career roadmaps with milestones, timelines, recommended courses, certifications, 
                projects, and networking strategies tailored to your chosen career path.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How AI Career Guidance Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Complete Career Assessment</h3>
                <p className="text-gray-700">
                  Begin with comprehensive assessments covering personality traits (MBTI-style), work values, interests 
                  (Holland Code), skills inventory, academic strengths, and career aspirations. The process takes 20-30 
                  minutes and provides deep insights into your career preferences.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Analyzes Your Profile</h3>
                <p className="text-gray-700">
                  Our machine learning algorithms process your assessment results alongside thousands of career profiles, 
                  job market data, and success patterns. The AI identifies careers that align with your unique combination 
                  of traits, skills, and preferences.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Receive Career Recommendations</h3>
                <p className="text-gray-700">
                  Get personalized career suggestions ranked by compatibility, including detailed descriptions of each role, 
                  required qualifications, typical career progression, salary ranges, work-life balance, and day-to-day 
                  responsibilities. Explore 10-15 matched careers across various industries.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Build Your Career Roadmap</h3>
                <p className="text-gray-700">
                  Select your target career and receive a customized action plan. This includes academic recommendations, 
                  skill-building courses, certification paths, internship targets, networking strategies, project ideas, 
                  and timeline milestones to track your progress toward career readiness.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Career Planning for Every Stage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
              <BookOpen className="w-10 h-10 text-indigo-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">High School Students</h3>
              <p className="text-gray-700 text-sm">
                Explore career options, understand college majors, identify career-aligned extracurriculars, 
                and plan for university admissions with career goals in mind.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <Users className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">College Students</h3>
              <p className="text-gray-700 text-sm">
                Refine career choices, plan internships, develop job-ready skills, build portfolios, 
                and prepare for campus placements with targeted guidance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <Award className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Recent Graduates</h3>
              <p className="text-gray-700 text-sm">
                Navigate job search strategies, optimize resumes, prepare for interviews, negotiate offers, 
                and transition from academia to professional career successfully.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
              <Lightbulb className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Career Changers</h3>
              <p className="text-gray-700 text-sm">
                Explore alternative career paths, identify transferable skills, plan career transitions, 
                and discover opportunities aligned with evolving interests and goals.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Makes Our AI Career Advisor Unique</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-indigo-600 text-white rounded-lg p-2 h-fit">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Holistic Career Matching</h3>
                  <p className="text-gray-700">
                    Unlike basic career tests, our AI considers personality, skills, values, interests, academic background, 
                    and personal circumstances to recommend careers that truly fit your holistic profile.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-purple-600 text-white rounded-lg p-2 h-fit">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-Time Industry Data</h3>
                  <p className="text-gray-700">
                    Career recommendations are based on current and projected job market trends, ensuring you're guided 
                    toward in-demand roles with strong growth potential and competitive salaries.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-blue-600 text-white rounded-lg p-2 h-fit">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Actionable Roadmaps</h3>
                  <p className="text-gray-700">
                    Go beyond vague suggestions. Receive detailed, step-by-step action plans with specific courses, 
                    certifications, projects, and milestones to achieve career readiness.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-green-600 text-white rounded-lg p-2 h-fit">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Mentor & Professional Connections</h3>
                  <p className="text-gray-700">
                    Get matched with industry mentors, alumni, and professionals in your target fields. 
                    Build valuable networks that accelerate your career development and open doors to opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Career Journey with Confidence</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stop feeling uncertain about your future. Let AI guide you toward a career that aligns 
            with your strengths, passions, and aspirations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Get Career Assessment
            </Link>
            <Link to="/faq" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-lg">
              View Career Paths
            </Link>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 ConnectBook. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <Link to="/about" className="hover:text-indigo-400 transition">About</Link>
            <Link to="/faq" className="hover:text-indigo-400 transition">FAQ</Link>
            <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
            <Link to="/register" className="hover:text-indigo-400 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareerGuidanceAdvisor;
