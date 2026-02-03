import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Brain, Target, Clock, BookOpen, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

const SmartStudyPlanner = () => {
  useEffect(() => {
    document.title = "Smart Study Planner with AI | ConnectBook - Optimize Your Learning Schedule";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI-powered study planner that creates personalized schedules, tracks progress, and optimizes learning efficiency for better academic performance.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Smart Study Planner with AI</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Maximize your academic success with AI-powered study planning. Personalized schedules, 
            progress tracking, and intelligent recommendations for optimal learning efficiency.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Create Study Plan
            </Link>
            <Link to="/about" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition">
              Learn How
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Study Planning for Academic Excellence</h2>
          <p className="text-lg text-gray-700 mb-4">
            ConnectBook's Smart Study Planner uses artificial intelligence to create personalized, optimized study schedules 
            that adapt to your learning style, available time, and academic goals. Our AI analyzes your course requirements, 
            exam dates, assignment deadlines, and personal commitments to generate a realistic, achievable study plan that 
            maximizes your learning efficiency and academic performance.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Traditional study planning often fails because students overestimate available time, underestimate task complexity, 
            or lack strategies for effective time management. Our AI eliminates these problems by considering hundreds of factors—
            from your peak productivity hours to subject difficulty levels—creating schedules that are both ambitious and 
            realistic. The system continuously learns from your study patterns and adjusts recommendations to help you achieve 
            your academic goals without burnout.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Intelligent Study Planning Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Brain className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Schedule Generation</h3>
              <p className="text-gray-700">
                Input your courses, exam dates, and available study time. Our AI instantly generates an optimized 
                study schedule that balances all subjects, prioritizes difficult topics, and respects your preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Target className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Goal-Based Planning</h3>
              <p className="text-gray-700">
                Set specific academic goals (target GPA, exam scores, skill mastery) and the AI creates milestone-based 
                plans with actionable daily tasks that lead you toward your objectives.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Adaptive Time Management</h3>
              <p className="text-gray-700">
                AI learns your productivity patterns and adjusts schedules dynamically. If you fall behind or surge ahead, 
                the planner automatically rebalances your study load for optimal results.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-700">
                Track completed topics, study hours logged, and concept mastery levels. Visual progress indicators 
                keep you motivated and show exactly where you stand on your academic journey.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Smart Study Planning Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Input Academic Information</h3>
                <p className="text-gray-700">
                  Enter your courses, syllabi, exam schedules, assignment deadlines, and any other academic commitments. 
                  Include personal preferences like preferred study times, subject priorities, and learning style.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Generates Optimized Schedule</h3>
                <p className="text-gray-700">
                  Our machine learning algorithms analyze all inputs and create a comprehensive study plan. The AI considers 
                  topic difficulty, your past performance, time until exams, and cognitive load to schedule optimal study sessions.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Follow Personalized Study Plan</h3>
                <p className="text-gray-700">
                  Receive daily study tasks with estimated time requirements. The planner includes specific topics to cover, 
                  recommended resources, practice problems, and review sessions at optimal intervals for memory retention.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Continuous Optimization</h3>
                <p className="text-gray-700">
                  As you log study sessions and complete tasks, the AI learns your actual pace and adjusts future schedules. 
                  The planner becomes more accurate and personalized with continued use.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Benefits of AI Study Planning</h2>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <BookOpen className="w-10 h-10 text-orange-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Comprehensive Coverage</h3>
                <p className="text-gray-700 text-sm">
                  Ensure all topics are covered before exams. AI tracks syllabus completion and prioritizes uncovered 
                  material to prevent last-minute cramming.
                </p>
              </div>

              <div>
                <TrendingUp className="w-10 h-10 text-red-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Improved Performance</h3>
                <p className="text-gray-700 text-sm">
                  Students using AI study planners report 25-35% higher grades. Consistent, optimized study schedules 
                  lead to better understanding and retention.
                </p>
              </div>

              <div>
                <Sparkles className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Reduced Stress</h3>
                <p className="text-gray-700 text-sm">
                  Know exactly what to study when. Eliminate anxiety about falling behind or missing important topics. 
                  Confidence comes from following a proven plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Study Habits with AI</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stop wasting time on ineffective study methods. Let AI create the perfect study plan 
            tailored to your needs, goals, and schedule.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Start Planning
            </Link>
            <Link to="/faq" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition text-lg">
              View Examples
            </Link>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 ConnectBook. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <Link to="/about" className="hover:text-orange-400 transition">About</Link>
            <Link to="/faq" className="hover:text-orange-400 transition">FAQ</Link>
            <Link to="/login" className="hover:text-orange-400 transition">Login</Link>
            <Link to="/register" className="hover:text-orange-400 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartStudyPlanner;
