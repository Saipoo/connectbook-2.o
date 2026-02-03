import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Calendar, BarChart3, MessageSquare, Award, BookOpen, Shield } from 'lucide-react';

const SmartCampusManagement = () => {
  useEffect(() => {
    document.title = "Smart Campus Management Platform | ConnectBook - Complete Education Solution";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive smart campus management platform for educational institutions. Streamline operations, enhance collaboration, and improve student outcomes with ConnectBook.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Smart Campus Management Platform</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              All-in-one digital solution to manage, monitor, and optimize every aspect of your educational institution 
              from admissions to alumni relations
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Request Demo
              </Link>
              <Link to="/about" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Digital Transformation for Educational Institutions</h2>
          <p className="text-lg text-gray-700 mb-4">
            ConnectBook's Smart Campus Management Platform is a comprehensive digital ecosystem designed to transform 
            how educational institutions operate. From student admissions to faculty management, course scheduling to 
            performance analytics, our platform integrates every aspect of campus operations into a single, unified system.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Educational institutions face numerous challenges: managing student data across departments, coordinating 
            between faculty and administration, tracking academic progress, maintaining parent communication, and generating 
            compliance reports. ConnectBook eliminates these pain points by providing an intelligent, cloud-based platform 
            that automates routine tasks, enhances collaboration, and provides actionable insights through advanced analytics.
          </p>
          <p className="text-lg text-gray-700">
            Whether you're managing a small college or a multi-campus university, ConnectBook scales to meet your needs 
            while maintaining security, reliability, and ease of use. Our platform is trusted by thousands of institutions 
            worldwide to manage millions of students, faculty, and administrative operations daily.
          </p>
        </section>

        {/* Core Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Comprehensive Campus Management Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Student Information System</h3>
              <p className="text-gray-700">
                Centralized student database with complete academic history, personal information, enrollment details, 
                and performance records. Access 360-degree student profiles instantly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <Calendar className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Academic Scheduling</h3>
              <p className="text-gray-700">
                Intelligent timetable generation with conflict resolution, room allocation, and faculty assignment. 
                Automated schedule optimization based on constraints and preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <BookOpen className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Course Management</h3>
              <p className="text-gray-700">
                Complete course lifecycle management from creation to completion. Manage curriculum, syllabi, 
                learning materials, assignments, and assessments in one place.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Analytics & Reporting</h3>
              <p className="text-gray-700">
                Real-time dashboards and comprehensive reports for administrators, faculty, and students. 
                Track performance metrics, attendance trends, and institutional KPIs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <MessageSquare className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Communication Hub</h3>
              <p className="text-gray-700">
                Seamless communication between students, faculty, parents, and administration. Announcements, 
                messaging, notifications, and parent-teacher coordination.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <Award className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Assessment & Grading</h3>
              <p className="text-gray-700">
                Automated grading systems, online examinations, assignment submissions, and performance tracking. 
                AI-powered evaluation for objective and subjective assessments.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose ConnectBook for Campus Management</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building className="w-6 h-6 text-indigo-600" />
                  Multi-Campus Support
                </h3>
                <p className="text-gray-700 mb-4">
                  Manage multiple campuses, departments, and branches from a single unified platform. Centralized 
                  administration with campus-specific customization and local autonomy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  Enterprise Security
                </h3>
                <p className="text-gray-700 mb-4">
                  Bank-grade encryption, role-based access control, and compliance with educational data protection 
                  regulations. Your data is secure with regular backups and disaster recovery.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Unlimited Users
                </h3>
                <p className="text-gray-700 mb-4">
                  No per-user licensing fees. Add unlimited students, faculty, and administrative staff. 
                  Scale your institution without worrying about additional software costs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                  AI-Powered Insights
                </h3>
                <p className="text-gray-700 mb-4">
                  Predictive analytics to identify at-risk students, optimize resource allocation, and improve 
                  academic outcomes. Machine learning models provide actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Modules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Integrated Platform Modules</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600">
              <h3 className="text-2xl font-semibold mb-3">Admissions & Enrollment Management</h3>
              <p className="text-gray-700 mb-3">
                Streamline the entire admissions process from application to enrollment. Online application forms, 
                document verification, merit list generation, fee collection, and seat allocation—all automated.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Online application portal with document upload</li>
                <li>Automated eligibility checking and merit list generation</li>
                <li>Integrated payment gateway for application and enrollment fees</li>
                <li>Digital onboarding for new students with automated provisioning</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-semibold mb-3">Faculty Management & HR</h3>
              <p className="text-gray-700 mb-3">
                Complete faculty lifecycle management including recruitment, onboarding, workload allocation, 
                performance evaluation, and professional development tracking.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Faculty profile management with qualifications and experience</li>
                <li>Automated workload calculation and course assignment</li>
                <li>Performance evaluation with student feedback integration</li>
                <li>Leave management and attendance tracking for staff</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
              <h3 className="text-2xl font-semibold mb-3">Financial Management & Fee Collection</h3>
              <p className="text-gray-700 mb-3">
                Comprehensive financial operations including fee management, payment tracking, invoicing, 
                expense management, and financial reporting with full audit trail.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Flexible fee structure configuration with installment support</li>
                <li>Multiple payment methods: online, cash, cheque, demand draft</li>
                <li>Automated fee reminders and penalty calculation for late payments</li>
                <li>Real-time financial dashboards and accounting integration</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
              <h3 className="text-2xl font-semibold mb-3">Library & Resource Management</h3>
              <p className="text-gray-700 mb-3">
                Digital library management with book cataloging, issue/return tracking, digital resources, 
                and integration with online learning materials.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Complete book inventory with barcode/RFID support</li>
                <li>Online book search and reservation system</li>
                <li>Automated fine calculation for overdue books</li>
                <li>Digital library with e-books and research papers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Implementation Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Seamless Implementation Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Consultation & Planning</h3>
              <p className="text-gray-700 text-sm">
                Understanding your institution's unique requirements and creating a customized implementation roadmap.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Data Migration</h3>
              <p className="text-gray-700 text-sm">
                Secure import of existing student, faculty, and institutional data from legacy systems.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Training & Onboarding</h3>
              <p className="text-gray-700 text-sm">
                Comprehensive training for administrators, faculty, and staff with ongoing support.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Go Live & Support</h3>
              <p className="text-gray-700 text-sm">
                Smooth transition to the new system with 24/7 technical support during the initial period.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Campus into a Smart Institution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of institutions that have digitized their operations with ConnectBook. 
            Schedule a personalized demo to see how we can help your institution.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Schedule Demo
            </Link>
            <Link to="/about" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-lg">
              Learn More
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
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

export default SmartCampusManagement;
