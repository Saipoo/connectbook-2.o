# CourseMaster Route Ordering Fix

## Issue
When trying to upload files (thumbnail, video, resource), the API returned a 500 error:

```
Error: CastError: Cast to ObjectId failed for value "upload" (type string) at path "_id"
```

## Root Cause
In Express.js, routes are matched in the order they are defined. The parameterized route `/:courseId` was defined **before** the specific routes like `/upload/thumbnail`, causing "upload" to be interpreted as a courseId parameter.

## Solution
Reordered routes to follow Express.js best practices: **specific routes must come before parameterized routes**.

### Correct Route Order:

1. **File Upload Routes** (most specific with `/upload/*` path)
   - POST `/api/courses/upload/thumbnail`
   - POST `/api/courses/upload/video`
   - POST `/api/courses/upload/resource`

2. **Named Routes** (specific paths)
   - GET `/api/courses/all`
   - POST `/api/courses/progress/update`
   - GET `/api/courses/progress/:studentId`
   - POST `/api/courses/create`
   - GET `/api/courses/teacher/my-courses`

3. **Parameterized Routes** (generic `:courseId` paths - must be last)
   - GET `/api/courses/:courseId`
   - POST `/api/courses/enroll/:courseId`
   - POST `/api/courses/quiz/:courseId/submit`
   - POST `/api/courses/generateCertificate/:courseId`
   - PATCH `/api/courses/update/:courseId`
   - POST `/api/courses/:courseId/video`
   - POST `/api/courses/:courseId/resource`
   - POST `/api/courses/:courseId/quiz`
   - PATCH `/api/courses/publish/:courseId`
   - GET `/api/courses/:courseId/enrollments`
   - GET `/api/courses/:courseId/certificates`

## Changes Made

**File:** `backend/routes/courseRoutes.js`

1. ✅ Moved upload routes to the top (lines 81-169)
2. ✅ Moved `/create` route before `/:courseId` (line 320)
3. ✅ Moved `/teacher/my-courses` before `/:courseId` (line 365)
4. ✅ Removed duplicate route definitions (lines 529-1161 deleted)
5. ✅ Trimmed file from 1162 lines to 745 lines

## Testing
After fix, file uploads should work correctly:
- Thumbnail upload: POST `/api/courses/upload/thumbnail`
- Video upload: POST `/api/courses/upload/video`
- Resource upload: POST `/api/courses/upload/resource`

## Express Route Matching Rules

**Key Principle:** More specific routes ALWAYS come before less specific routes.

### Examples:
```javascript
// ✅ CORRECT ORDER
router.get('/all', handler);              // Specific
router.get('/teacher/my-courses', handler); // Specific
router.get('/:courseId', handler);        // Generic (catches everything)

// ❌ WRONG ORDER
router.get('/:courseId', handler);        // Will catch "all" and "teacher"
router.get('/all', handler);              // Never reached!
router.get('/teacher/my-courses', handler); // Never reached!
```

### Route Specificity Hierarchy:
1. Static paths: `/upload/thumbnail` (most specific)
2. Multi-segment: `/teacher/my-courses`
3. Single-segment: `/all`, `/create`
4. Parameterized: `/:courseId` (least specific, catches everything)

## Prevention
When adding new routes to `courseRoutes.js`:
1. Add static/specific routes at the top
2. Add parameterized routes at the bottom
3. Test immediately after adding routes
4. Never place parameterized routes before specific ones

---

**Status:** ✅ FIXED  
**Date:** October 17, 2025  
**Lines Changed:** Deleted 417 duplicate lines, reordered 25+ routes
