@echo off
echo Downloading face-api.js models...
echo.

echo [1/7] Downloading tiny_face_detector_model-weights_manifest.json...
curl -o tiny_face_detector_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

echo [2/7] Downloading tiny_face_detector_model-shard1...
curl -o tiny_face_detector_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

echo [3/7] Downloading face_landmark_68_model-weights_manifest.json...
curl -o face_landmark_68_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json

echo [4/7] Downloading face_landmark_68_model-shard1...
curl -o face_landmark_68_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

echo [5/7] Downloading face_recognition_model-weights_manifest.json...
curl -o face_recognition_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json

echo [6/7] Downloading face_recognition_model-shard1...
curl -o face_recognition_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1

echo [7/7] Downloading face_recognition_model-shard2...
curl -o face_recognition_model-shard2 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2

echo.
echo ========================================
echo All models downloaded successfully!
echo ========================================
echo.
dir
pause
