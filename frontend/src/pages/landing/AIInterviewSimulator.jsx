import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mic, Video, MessageSquare, Award, Target, TrendingUp, Zap } from 'lucide-react';

const AIInterviewSimulator = () => {
  useEffect(() => {
    document.title = "AI Interview Simulator for Students | ConnectBook - Practice & Perfect Your Interview Skills";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Master job interviews with AI-powered simulation. Real-time feedback, personalized coaching, and unlimited practice for technical and behavioral interviews.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-600 to-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">AI Interview Simulator for Students</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Practice and perfect your interview skills with AI-powered simulation technology. 
            Get real-time feedback, personalized coaching, and build confidence for your dream job.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Practicing
            </Link>
            <Link to="/about" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
              Watch Demo
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Master Interview Skills with AI-Powered Practice</h2>
          <p className="text-lg text-gray-700 mb-4">
            ConnectBook's AI Interview Simulator provides students with unlimited, realistic interview practice in a safe, 
            judgment-free environment. Our advanced artificial intelligence conducts both technical and behavioral interviews, 
            asking relevant questions based on your field of study, evaluating your responses in real-time, and providing 
            detailed feedback to help you improve.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Job interviews are stressful, and lack of practice often leads to poor performance. Our simulator removes this 
            barrier by offering unlimited practice sessions with AI interviewers who adapt to your skill level, provide 
            constructive feedback, and help you develop the confidence needed to excel in real interviews. Whether you're 
            preparing for technical coding interviews, behavioral assessments, or industry-specific scenarios, our AI has you covered.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Comprehensive Interview Preparation Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Video className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Video Interview Simulation</h3>
              <p className="text-gray-700">
                Face-to-face video interviews with AI that analyzes your body language, eye contact, speech patterns, 
                and confidence level. Get feedback on both content and presentation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <MessageSquare className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Behavioral Question Bank</h3>
              <p className="text-gray-700">
                Thousands of real behavioral interview questions from top companies. Practice STAR method responses 
                and receive AI evaluation on structure, relevance, and impact.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Technical Skill Assessment</h3>
              <p className="text-gray-700">
                Domain-specific technical questions for engineering, computer science, business, and more. 
                Coding challenges, case studies, and problem-solving scenarios tailored to your field.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Performance Analytics</h3>
              <p className="text-gray-700">
                Track your improvement over time with detailed analytics. See which areas you're excelling in 
                and where you need more practice. Compare your performance with peers.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How AI Interview Simulation Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Interview Type & Role</h3>
                <p className="text-gray-700">
                  Select from technical interviews, behavioral rounds, HR discussions, or industry-specific scenarios. 
                  Specify the role you're applying for (software engineer, data analyst, marketing manager, etc.) and 
                  the AI customizes questions accordingly.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Conducts Interview</h3>
                <p className="text-gray-700">
                  The AI interviewer asks relevant questions, listens to your responses, and adapts follow-up questions 
                  based on your answers. Experience realistic interview flow with appropriate difficulty progression.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-Time AI Evaluation</h3>
                <p className="text-gray-700">
                  Our AI analyzes your responses for content quality, structure, relevance, confidence, communication 
                  clarity, and technical accuracy. Video analysis evaluates body language and presentation skills.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Detailed Feedback & Coaching</h3>
                <p className="text-gray-700">
                  Receive comprehensive feedback on every response including what you did well, areas for improvement, 
                  suggested answer frameworks, and specific tips for enhancement. Review recordings to self-evaluate.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Interview Preparation for All Industries</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
              <Award className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Software Engineering</h3>
              <p className="text-gray-700 text-sm mb-3">
                Coding challenges, system design questions, algorithm problems, and behavioral questions 
                specific to software development roles at top tech companies.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <Target className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Data Science & Analytics</h3>
              <p className="text-gray-700 text-sm mb-3">
                Statistical analysis, machine learning concepts, SQL queries, data interpretation, 
                and case study discussions for data science positions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <Mic className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Business & Management</h3>
              <p className="text-gray-700 text-sm mb-3">
                Case studies, market analysis, strategic thinking, leadership scenarios, and 
                consulting-style interviews for business roles.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benefits of AI Interview Practice</h2>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Zap className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Unlimited Practice Sessions</h3>
                <p className="text-gray-700">
                  Practice as many times as you need without fear of judgment. Each session helps you improve, 
                  building confidence and competence progressively.
                </p>
              </div>

              <div>
                <TrendingUp className="w-8 h-8 text-teal-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Personalized Learning Path</h3>
                <p className="text-gray-700">
                  AI adapts difficulty based on your performance, focusing on areas needing improvement while 
                  reinforcing your strengths for balanced development.
                </p>
              </div>

              <div>
                <Video className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Realistic Interview Experience</h3>
                <p className="text-gray-700">
                  Experience authentic interview pressure, timing, and flow. Our AI creates realistic scenarios 
                  that mirror actual corporate interviews.
                </p>
              </div>

              <div>
                <Award className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Instant, Actionable Feedback</h3>
                <p className="text-gray-700">
                  No waiting for days to know how you did. Receive detailed feedback immediately after each 
                  interview with specific improvement recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ace Your Next Interview with Confidence</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully landed their dream jobs after practicing 
            with ConnectBook's AI Interview Simulator. Start your journey today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Begin Practice Now
            </Link>
            <Link to="/faq" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition text-lg">
              See Success Stories
            </Link>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 ConnectBook. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <Link to="/about" className="hover:text-green-400 transition">About</Link>
            <Link to="/faq" className="hover:text-green-400 transition">FAQ</Link>
            <Link to="/login" className="hover:text-green-400 transition">Login</Link>
            <Link to="/register" className="hover:text-green-400 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIInterviewSimulator;
