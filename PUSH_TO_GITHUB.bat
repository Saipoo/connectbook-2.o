@echo off
echo ============================================
echo  PUSH TO GITHUB REPOSITORY
echo ============================================
echo.
echo Repository: https://github.com/Saipoo/connectbook-2.o.git
echo.
echo Step 1: Checking Git status...
cd /d "c:\Users\Dell\Desktop\crap cb major"
git status
echo.
echo ============================================
echo Step 2: Adding all files...
git add .
echo.
echo ============================================
echo Step 3: Committing changes...
git commit -m "Fix: Multiple bug fixes and improvements

- Fixed GradeMaster and GradeEvaluator API routes (/api/grade to /api/grades)
- Fixed parent dashboard: added certificates section and course enrollments
- Fixed parent profile endpoint (404 error)
- Fixed student enrollments and certificates endpoints (500 errors)
- Added USN support for parent-related course queries
- Fixed Mentor Connect meeting links in chat (404 error and overflow issues)
- Improved ChatMessage component with proper URL extraction
- Fixed certificate field names (issueDate, pdfUrl)
- Added defensive programming for all data fetching (prevent undefined errors)
- Consistent API response format (all use 'data' key)
- Backend route fixes for grade routes consistency
- All parent dashboard sections now functional
- Meeting links now work correctly from both schedules and chat"

echo.
echo ============================================
echo Step 4: Pushing to GitHub...
git push origin main
echo.
echo ============================================
echo.
echo If push fails, you may need to:
echo 1. Set up remote: git remote add origin https://github.com/Saipoo/connectbook-2.o.git
echo 2. Or force push: git push -f origin main
echo 3. Or pull first: git pull origin main --allow-unrelated-histories
echo.
echo ============================================
pause
