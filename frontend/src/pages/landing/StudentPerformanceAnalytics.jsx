import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Brain, Target, AlertCircle, Award, Users, LineChart, Sparkles } from 'lucide-react';

const StudentPerformanceAnalytics = () => {
  useEffect(() => {
    document.title = "AI-Powered Student Performance Analytics | ConnectBook - Data-Driven Education";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transform student outcomes with AI-powered performance analytics. Real-time insights, predictive models, and personalized recommendations for academic success.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-600 to-pink-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Student Performance Analytics Using AI</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Harness the power of artificial intelligence to track, analyze, and improve student performance 
              with actionable insights and predictive analytics
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Get Started
              </Link>
              <Link to="/about" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Data-Driven Insights for Better Academic Outcomes</h2>
          <p className="text-lg text-gray-700 mb-4">
            ConnectBook's AI-powered performance analytics platform transforms raw academic data into meaningful insights 
            that drive student success. By analyzing attendance patterns, assessment scores, engagement metrics, and behavioral 
            indicators, our system identifies at-risk students early and provides personalized recommendations for intervention.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Traditional performance tracking relies on periodic assessments and manual reporting, often missing critical warning 
            signs until it's too late. Our AI analytics engine continuously monitors hundreds of data points, detecting patterns 
            and trends that human analysis might miss. Teachers, administrators, and parents receive real-time alerts when 
            students need support, enabling timely intervention that can make the difference between success and failure.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">AI-Powered Analytics Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Brain className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Predictive Performance Models</h3>
              <p className="text-gray-700">
                Machine learning algorithms predict student outcomes based on historical data, current performance trends, 
                and behavioral patterns. Identify students at risk of underperformance before grades drop.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Target className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Personalized Learning Paths</h3>
              <p className="text-gray-700">
                AI analyzes individual learning styles, strengths, and weaknesses to recommend customized study plans. 
                Adaptive learning suggestions help each student reach their full potential.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <AlertCircle className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Early Warning System</h3>
              <p className="text-gray-700">
                Automatic alerts when students show signs of academic struggle, attendance issues, or disengagement. 
                Proactive notifications enable timely teacher intervention and student support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <LineChart className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-Time Dashboards</h3>
              <p className="text-gray-700">
                Interactive visualizations show performance trends, comparative analytics, and progress tracking. 
                Students, teachers, and parents access role-specific dashboards with relevant insights.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Comprehensive Performance Metrics</h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Award className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Academic Performance</h3>
                <p className="text-gray-700 text-sm">
                  Track grades, assignment scores, test results, and overall GPA. Subject-wise analysis with 
                  strength and improvement area identification.
                </p>
              </div>

              <div>
                <Users className="w-10 h-10 text-pink-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Engagement Analysis</h3>
                <p className="text-gray-700 text-sm">
                  Monitor class participation, discussion forum activity, resource usage, and learning material 
                  interaction to gauge student engagement levels.
                </p>
              </div>

              <div>
                <Sparkles className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Behavioral Insights</h3>
                <p className="text-gray-700 text-sm">
                  Analyze study patterns, submission timeliness, attendance consistency, and peer collaboration 
                  to understand learning behaviors and habits.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How AI Analytics Improves Student Outcomes</h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Continuous Data Collection</h3>
                <p className="text-gray-700">
                  Our system automatically collects data from attendance records, assessment scores, assignment submissions, 
                  quiz results, and classroom interactions. Every student action contributes to their performance profile.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-700">
                  Machine learning models process thousands of data points to identify patterns, correlations, and anomalies. 
                  The AI recognizes which factors most strongly predict success or struggle for each individual student.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Actionable Recommendations</h3>
                <p className="text-gray-700">
                  Based on the analysis, the system generates specific, actionable recommendations. Teachers receive suggested 
                  interventions, students get personalized study tips, and administrators see institutional trends requiring attention.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Outcome Measurement</h3>
                <p className="text-gray-700">
                  Track the effectiveness of interventions and see measurable improvements in student performance. 
                  The AI continuously learns from outcomes to refine its predictions and recommendations over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Use Cases for Different Stakeholders</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-purple-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">For Teachers & Faculty</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Identify struggling students before they fail</li>
                <li>Personalize teaching strategies based on class analytics</li>
                <li>Track effectiveness of teaching methods</li>
                <li>Generate detailed progress reports instantly</li>
                <li>Receive intervention recommendations for at-risk students</li>
              </ul>
            </div>

            <div className="border-l-4 border-pink-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">For Students</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>View real-time performance dashboards</li>
                <li>Get personalized study recommendations</li>
                <li>Compare progress with class averages</li>
                <li>Receive alerts on areas needing improvement</li>
                <li>Track progress toward academic goals</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">For Parents</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Monitor child's academic progress remotely</li>
                <li>Receive alerts for attendance or performance issues</li>
                <li>View comprehensive performance reports</li>
                <li>Understand strengths and improvement areas</li>
                <li>Collaborate with teachers on student support</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">For Administrators</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Institution-wide performance analytics</li>
                <li>Department and program effectiveness analysis</li>
                <li>Faculty performance metrics and comparisons</li>
                <li>Accreditation and compliance reporting</li>
                <li>Data-driven decision making for resource allocation</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Unlock the Power of Data-Driven Education</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transform student outcomes with AI-powered analytics. Start making data-driven decisions 
            that improve academic performance across your institution.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Start Free Trial
            </Link>
            <Link to="/faq" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition text-lg">
              Learn More
            </Link>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 ConnectBook. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <Link to="/about" className="hover:text-purple-400 transition">About</Link>
            <Link to="/faq" className="hover:text-purple-400 transition">FAQ</Link>
            <Link to="/login" className="hover:text-purple-400 transition">Login</Link>
            <Link to="/register" className="hover:text-purple-400 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentPerformanceAnalytics;
