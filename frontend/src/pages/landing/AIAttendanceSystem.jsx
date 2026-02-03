import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ScanFace, MapPin, Clock, Shield, TrendingUp, Users, Smartphone } from 'lucide-react';

const AIAttendanceSystem = () => {
  useEffect(() => {
    document.title = "AI-Powered Attendance System | ConnectBook - Smart Campus Management";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transform attendance tracking with ConnectBook\'s AI-powered facial recognition system. Real-time attendance, geolocation validation, and automated reporting for educational institutions.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">AI-Powered Attendance System</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Revolutionary facial recognition technology combined with geolocation validation 
              to transform how educational institutions manage student attendance
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Get Started Free
              </Link>
              <Link to="/about" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Transform Attendance Management with Artificial Intelligence</h2>
          <p className="text-lg text-gray-700 mb-4">
            ConnectBook's AI-powered attendance system revolutionizes how educational institutions track student presence. 
            By leveraging cutting-edge facial recognition technology and real-time geolocation validation, we eliminate 
            proxy attendance, reduce administrative overhead, and provide accurate attendance data instantly.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Traditional attendance systems are time-consuming, error-prone, and vulnerable to manipulation. Our AI attendance 
            solution automates the entire process, allowing teachers to focus on teaching while administrators gain real-time 
            insights into student attendance patterns, trends, and analytics.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features of Our AI Attendance System</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <ScanFace className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Facial Recognition Technology</h3>
              <p className="text-gray-700">
                Advanced AI algorithms identify students in seconds with 99.9% accuracy. Our system works in various 
                lighting conditions and can process multiple faces simultaneously, making attendance marking fast and reliable.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <MapPin className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Geolocation Validation</h3>
              <p className="text-gray-700">
                Prevent proxy attendance with real-time location verification. Students must be within campus boundaries 
                to mark attendance, ensuring authenticity and eliminating fraudulent check-ins from remote locations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
              <p className="text-gray-700">
                Instant attendance updates accessible to students, teachers, and parents. Monitor attendance percentages 
                live, receive automatic alerts for low attendance, and generate reports with a single click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Secure & Privacy-Focused</h3>
              <p className="text-gray-700">
                Enterprise-grade encryption protects biometric data. We comply with data protection regulations and 
                ensure that facial recognition data is stored securely with multi-layer security protocols.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benefits for Educational Institutions</h2>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <TrendingUp className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">98% Time Savings</h3>
                <p className="text-gray-700">
                  Reduce attendance marking time from 10-15 minutes to under 30 seconds per class. 
                  Teachers save hours every week that can be redirected to actual teaching.
                </p>
              </div>

              <div>
                <Users className="w-10 h-10 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">100% Accuracy</h3>
                <p className="text-gray-700">
                  Eliminate manual errors, missed entries, and fraudulent attendance. Our AI system 
                  ensures every attendance record is accurate and verifiable.
                </p>
              </div>

              <div>
                <Smartphone className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Mobile-First Design</h3>
                <p className="text-gray-700">
                  Students mark attendance using their smartphones. No expensive hardware required—
                  just a phone camera and internet connection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How ConnectBook's AI Attendance System Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Student Registration</h3>
                <p className="text-gray-700">
                  Students register their faces during onboarding using their smartphone cameras. The AI system 
                  captures multiple angles and creates a unique facial signature stored securely in encrypted form.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Attendance Marking</h3>
                <p className="text-gray-700">
                  When it's time for class, students open the ConnectBook app and take a selfie. The AI instantly 
                  verifies their identity while simultaneously checking their location to ensure they're on campus.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Verification</h3>
                <p className="text-gray-700">
                  Our AI algorithms process the facial recognition and geolocation data in under 2 seconds. 
                  Teachers receive instant confirmation, and the attendance is recorded in the system automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Analytics & Reporting</h3>
                <p className="text-gray-700">
                  Administrators access comprehensive dashboards showing attendance trends, patterns, and insights. 
                  Generate reports instantly, identify at-risk students, and make data-driven decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Use Cases Across Educational Institutions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">Universities & Colleges</h3>
              <p className="text-gray-700 mb-2">
                Manage attendance across hundreds of courses and thousands of students. Track attendance for lectures, 
                labs, seminars, and practical sessions with ease.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Multi-campus support with centralized reporting</li>
                <li>Integration with academic management systems</li>
                <li>Department-wise attendance analytics</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">Schools & K-12 Education</h3>
              <p className="text-gray-700 mb-2">
                Simplify attendance for younger students with teacher-assisted marking. Parents receive daily 
                attendance notifications ensuring child safety and presence.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Parent mobile app with real-time updates</li>
                <li>Automatic absence notifications</li>
                <li>Integration with school management systems</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">Training Institutes & Coaching Centers</h3>
              <p className="text-gray-700 mb-2">
                Track student attendance for batch-based courses, workshops, and certification programs. 
                Ensure compliance with mandatory attendance requirements.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Batch-wise attendance tracking</li>
                <li>Course completion certificates based on attendance</li>
                <li>Flexible scheduling support</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-600 bg-white p-6 rounded-r-xl shadow">
              <h3 className="text-xl font-semibold mb-3">Corporate Training Programs</h3>
              <p className="text-gray-700 mb-2">
                Monitor employee participation in training sessions, workshops, and compliance programs. 
                Generate audit-ready attendance reports instantly.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Session-based attendance tracking</li>
                <li>Automated certificate generation</li>
                <li>Compliance and audit reporting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Attendance System?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions using ConnectBook's AI-powered attendance system. 
            Start your free trial today—no credit card required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Start Free Trial
            </Link>
            <Link to="/faq" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-lg">
              View FAQs
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 ConnectBook. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <Link to="/about" className="hover:text-blue-400 transition">About</Link>
            <Link to="/faq" className="hover:text-blue-400 transition">FAQ</Link>
            <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-400 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIAttendanceSystem;
