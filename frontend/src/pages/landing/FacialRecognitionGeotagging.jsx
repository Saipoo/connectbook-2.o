import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScanFace, MapPin, Shield, Clock, CheckCircle, AlertCircle, Lock, Smartphone } from 'lucide-react';

const FacialRecognitionGeotagging = () => {
  useEffect(() => {
    document.title = "Facial Recognition Attendance with Geo-tagging | ConnectBook - Secure & Accurate Attendance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Advanced facial recognition attendance system with geo-location validation. Prevent proxy attendance, ensure security, and automate tracking with AI-powered biometric technology.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-cyan-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Facial Recognition with Geo-tagging</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Next-generation attendance security combining AI facial recognition with GPS verification. 
            Eliminate proxy attendance, ensure authenticity, and maintain foolproof attendance records.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Deploy System
            </Link>
            <Link to="/about" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition">
              See Technology
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Military-Grade Security for Attendance Verification</h2>
          <p className="text-lg text-gray-700 mb-4">
            ConnectBook's Facial Recognition with Geo-tagging combines two powerful security layers to create an 
            unbreakable attendance verification system. Our AI-powered facial recognition technology achieves 99.9% 
            accuracy in identifying students, even in challenging lighting conditions, different angles, or with 
            accessories like glasses and masks. Simultaneously, GPS geo-tagging validates that students are physically 
            present at the designated location, preventing any form of remote or proxy attendance fraud.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Traditional attendance systems are vulnerable to buddy punching, photo spoofing, and location fraud. Our 
            dual-layer security architecture eliminates these vulnerabilities completely. The facial recognition engine 
            uses advanced liveness detection to ensure the person is physically present (not a photo or video), while 
            GPS coordinates are verified in real-time against pre-defined geofences around campuses, classrooms, or 
            designated attendance zones. This creates an audit trail that's legally defensible and impossible to manipulate.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Advanced Security Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-cyan-600">
              <ScanFace className="w-12 h-12 text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Facial Recognition</h3>
              <p className="text-gray-700 mb-3">
                State-of-the-art deep learning models trained on millions of faces achieve 99.9% accuracy. 
                Recognizes individuals in 0.3 seconds across varying lighting, angles, and conditions.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Liveness detection prevents photo/video spoofing</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Works with glasses, masks, and facial accessories</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Multi-angle face detection for convenience</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Continuous learning improves accuracy over time</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
              <MapPin className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">GPS Geo-tagging Verification</h3>
              <p className="text-gray-700 mb-3">
                Real-time GPS validation ensures students mark attendance only from authorized locations. 
                Customizable geofences prevent location spoofing and remote attendance fraud.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Define multiple geofences per campus/venue</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Accuracy within 5-10 meters using GPS + WiFi</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Detects GPS spoofing and VPN usage attempts</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Automatic alerts for out-of-zone attendance</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Enterprise-Grade Security</h3>
              <p className="text-gray-700 mb-3">
                Military-grade encryption protects all biometric data. Compliant with GDPR, CCPA, and international 
                privacy regulations. Your data is never shared or sold.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> AES-256 encryption for data at rest and in transit</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Biometric templates, not photos, stored securely</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Role-based access controls for administrators</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Regular security audits and penetration testing</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
              <Clock className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-Time Processing</h3>
              <p className="text-gray-700 mb-3">
                Instant attendance marking with zero latency. Students receive immediate confirmation, and 
                administrators see live attendance dashboards updated in real-time.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> 0.3-second face recognition speed</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Instant attendance confirmation notifications</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Live dashboards for teachers and administrators</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Bulk processing: 500+ students per minute</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Dual-Layer Security Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Student Initiates Attendance</h3>
                <p className="text-gray-700">
                  Student opens the ConnectBook mobile app or accesses a dedicated attendance kiosk. The system 
                  immediately activates the front camera and begins GPS location acquisition in the background.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Facial Recognition Verification</h3>
                <p className="text-gray-700">
                  AI analyzes the live camera feed, detects faces, and matches against the enrolled biometric template. 
                  Liveness detection algorithms ensure the person is physically present (blink detection, micro-movements). 
                  Recognition happens in 0.3 seconds with 99.9% accuracy.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">GPS Location Validation</h3>
                <p className="text-gray-700">
                  Simultaneously, the system captures GPS coordinates and compares them against pre-defined geofences 
                  for the specific class/event. Advanced anti-spoofing checks detect fake GPS apps, VPNs, and location 
                  manipulation attempts. WiFi-based positioning adds additional accuracy.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Attendance Recorded & Verified</h3>
                <p className="text-gray-700">
                  Only when BOTH verifications pass (correct face AND correct location) is attendance marked. The system 
                  logs a detailed audit trail including timestamp, GPS coordinates, face match confidence score, and 
                  device information. Student and teacher receive instant confirmation notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Privacy & Compliance Guarantees</h2>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Lock className="w-10 h-10 text-cyan-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Data Privacy Protection</h3>
                <p className="text-gray-700 mb-3">
                  Your biometric data is sacred. We store mathematical templates, not actual photos. 
                  Templates are encrypted and cannot be reverse-engineered into facial images.
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> GDPR & CCPA compliant data handling</li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Right to deletion and data portability</li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Explicit consent required for enrollment</li>
                </ul>
              </div>

              <div>
                <Shield className="w-10 h-10 text-blue-700 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Security Standards</h3>
                <p className="text-gray-700 mb-3">
                  Enterprise-grade security infrastructure audited by third-party security firms. 
                  Regular penetration testing and compliance certifications.
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> ISO 27001 certified data centers</li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> SOC 2 Type II compliance</li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> Annual security audits and reports</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benefits for Institutions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <AlertCircle className="w-10 h-10 text-cyan-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Zero Proxy Attendance</h3>
              <p className="text-gray-700 text-sm">
                Completely eliminate buddy punching and proxy attendance. Dual verification ensures only the 
                authorized person can mark attendance from the correct location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Clock className="w-10 h-10 text-blue-700 mb-3" />
              <h3 className="text-lg font-semibold mb-2">95% Time Savings</h3>
              <p className="text-gray-700 text-sm">
                Teachers save 10-15 minutes per class previously spent on manual attendance. Automated reports 
                eliminate hours of administrative work each week.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Smartphone className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Mobile-First Design</h3>
              <p className="text-gray-700 text-sm">
                Students use their own smartphones—no expensive hardware required. Works on Android and iOS 
                with offline capability and cloud sync.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600 to-blue-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Deploy Unbreakable Attendance Security Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of institutions using facial recognition with geo-tagging to maintain accurate, 
            fraud-proof attendance records. Experience the future of attendance management.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Get Started
            </Link>
            <Link to="/faq" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition text-lg">
              View Security Details
            </Link>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2026 ConnectBook. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <Link to="/about" className="hover:text-cyan-400 transition">About</Link>
            <Link to="/faq" className="hover:text-cyan-400 transition">FAQ</Link>
            <Link to="/login" className="hover:text-cyan-400 transition">Login</Link>
            <Link to="/register" className="hover:text-cyan-400 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FacialRecognitionGeotagging;
