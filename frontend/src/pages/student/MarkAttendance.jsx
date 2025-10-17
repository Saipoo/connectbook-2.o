import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as faceapi from 'face-api.js';
import {
  Camera,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MarkAttendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [marking, setMarking] = useState(false);
  const [stream, setStream] = useState(null);
  const [subject, setSubject] = useState('');
  const [subjects] = useState([
    'Data Structures',
    'Algorithms',
    'Database Management',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Web Technologies',
    'Machine Learning'
  ]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadModels();
    
    return () => {
      stopCamera();
    };
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
      toast.success('Face detection ready!');
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('Face detection models unavailable. Using fallback mode.');
      setModelsLoaded(true);
    }
  };

  const startCamera = async () => {
    if (!subject) {
      toast.error('Please select a subject first!');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        toast.success('Camera started! Position your face clearly.');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const markAttendance = async () => {
    if (!videoRef.current || marking || !subject) return;

    setMarking(true);
    toast.loading('Detecting and matching face...');

    try {
      let embedding;

      // If models are loaded, use face-api.js
      if (modelsLoaded && faceapi.nets.tinyFaceDetector.isLoaded) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          toast.dismiss();
          toast.error('No face detected! Please position your face clearly.');
          setMarking(false);
          return;
        }

        embedding = Array.from(detection.descriptor);

        // Draw detection on canvas
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const displaySize = {
            width: videoRef.current.width,
            height: videoRef.current.height
          };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetection = faceapi.resizeResults(detection, displaySize);
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw green box for detected face
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 3;
          const box = resizedDetection.detection.box;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        }
      } else {
        // Models not loaded - cannot proceed with face recognition
        toast.dismiss();
        toast.error('Face detection models not loaded. Please download the models first.');
        setMarking(false);
        return;
      }

      // Send to backend
      console.log('Sending embedding to backend:', {
        embeddingLength: embedding.length,
        firstFewValues: embedding.slice(0, 5),
        subject
      });

      const response = await api.post('/face/mark', {
        embedding,
        subject
      });

      toast.dismiss();
      
      if (response.data.success) {
        toast.success(`✅ ${response.data.message}`);
        setSuccess(true);
        stopCamera();
        
        setTimeout(() => {
          navigate('/dashboard/student');
        }, 3000);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.dismiss();
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      toast.error(errorMessage);
      
      if (errorMessage.includes('not recognized') || errorMessage.includes('not registered')) {
        setTimeout(() => {
          if (window.confirm('Face not registered. Would you like to register now?')) {
            navigate('/dashboard/student/face-register');
          }
        }, 1000);
      }
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/student')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            Mark Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Use facial recognition to mark your attendance
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 mb-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-300 text-lg">
                  Attendance Marked Successfully! 🎉
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your attendance has been recorded for {subject}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subject Selection */}
        {!success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6"
          >
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Select Subject *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              disabled={cameraActive}
            >
              <option value="">-- Choose a subject --</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Instructions */}
        {!success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6"
          >
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Select the subject for which you want to mark attendance</li>
              <li>Click "Start Camera" to begin</li>
              <li>Position your face clearly in the camera frame</li>
              <li>Click "Mark Attendance" to recognize your face</li>
              <li>Wait for the system to match your face with registered data</li>
            </ol>
          </motion.div>
        )}

        {/* Camera Section */}
        {!success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '480px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="640"
                height="480"
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="absolute top-0 left-0 w-full h-full"
              />
              
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Camera is off</p>
                    <p className="text-sm opacity-75 mt-2">Select a subject and start the camera</p>
                  </div>
                </div>
              )}

              {/* Status Overlay */}
              {marking && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <Loader className="w-16 h-16 mx-auto mb-4 animate-spin" />
                    <p className="text-xl font-bold">Matching face...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    disabled={!modelsLoaded || !subject}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    {modelsLoaded ? 'Start Camera' : 'Loading Models...'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={markAttendance}
                      disabled={marking}
                      className="btn-primary bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 flex items-center gap-2 disabled:opacity-50"
                    >
                      {marking ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Mark Attendance
                        </>
                      )}
                    </button>

                    <button
                      onClick={stopCamera}
                      disabled={marking}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Stop Camera
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tips */}
            {cameraActive && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">
                  💡 Tips for Better Detection
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Ensure your face is well-lit</li>
                  <li>• Look directly at the camera</li>
                  <li>• Remove glasses or masks if possible</li>
                  <li>• Keep your face centered in the frame</li>
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Model Status */}
        {!modelsLoaded && !success && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-300 text-sm">
              ⚠️ Note: Face detection models are loading or unavailable. The system will work in demo mode.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
