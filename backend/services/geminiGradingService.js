import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import mammoth from 'mammoth';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import PDFExtract from 'pdf.js-extract';
import stringSimilarity from 'string-similarity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Gemini AI lazily to ensure env vars are loaded
let genAI = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('🔑 Gemini API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Extract text from PDF file using pdf.js-extract
 */
async function extractTextFromPDF(filePath) {
  try {
    console.log('📄 Starting PDF extraction for:', filePath);
    const pdfExtract = new PDFExtract.PDFExtract();
    const data = await pdfExtract.extract(filePath);
    
    console.log(`📊 PDF has ${data.pages ? data.pages.length : 0} pages`);
    
    // Extract text from all pages
    let text = '';
    for (const page of data.pages) {
      if (page.content) {
        for (const item of page.content) {
          if (item.str) {
            text += item.str + ' ';
          }
        }
        text += '\n'; // Add newline between pages
      }
    }
    
    const extractedText = text.trim();
    console.log(`✅ Extracted ${extractedText.length} characters from PDF`);
    console.log(`📝 First 200 chars: ${extractedText.substring(0, 200)}...`);
    
    return extractedText;
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error);
    console.error('📂 File path:', filePath);
    console.error('🔍 Error details:', error.message);
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

/**
 * Extract text from file based on extension
 */
async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.pdf') {
    return await extractTextFromPDF(filePath);
  } else if (ext === '.docx' || ext === '.doc') {
    return await extractTextFromDOCX(filePath);
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }
}

/**
 * Fallback: Compare student answer with answer key using text similarity
 */
function compareWithAnswerKey(questionPaperText, answerKeyText, studentAnswerText, subject) {
  console.log('🔄 Using fallback text comparison method...');
  
  try {
    // Extract questions from question paper
    const questions = extractQuestions(questionPaperText);
    const answerKeyQuestions = extractQuestions(answerKeyText);
    const studentAnswers = extractQuestions(studentAnswerText);
    
    const marksPerQuestion = [];
    let totalMarksObtained = 0;
    let totalMaxMarks = 0;
    
    // Process each question
    for (let i = 0; i < questions.length; i++) {
      const questionNum = i + 1;
      const maxMarks = extractMarks(questions[i]) || 10; // Default to 10 if not found
      
      // Get corresponding answer key and student answer
      const keyAnswer = answerKeyQuestions[i] || '';
      const studentAns = studentAnswers[i] || '';
      
      // Calculate similarity score
      const similarity = stringSimilarity.compareTwoStrings(
        keyAnswer.toLowerCase().trim(),
        studentAns.toLowerCase().trim()
      );
      
      // Convert similarity to marks (0-1 scale to 0-maxMarks)
      const marksObtained = Math.round(similarity * maxMarks * 100) / 100;
      
      totalMarksObtained += marksObtained;
      totalMaxMarks += maxMarks;
      
      // Generate feedback based on similarity
      let feedback = '';
      if (similarity >= 0.8) {
        feedback = 'Excellent answer! Very close to the model answer.';
      } else if (similarity >= 0.6) {
        feedback = 'Good answer with most key points covered.';
      } else if (similarity >= 0.4) {
        feedback = 'Fair answer but missing some important points.';
      } else {
        feedback = 'Needs improvement. Please refer to the answer key.';
      }
      
      marksPerQuestion.push({
        question_number: questionNum,
        marks_obtained: marksObtained,
        max_marks: maxMarks,
        feedback: feedback,
        highlights: extractKeyPhrases(studentAns, keyAnswer)
      });
    }
    
    const percentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    
    return {
      marks_per_question: marksPerQuestion,
      total_marks_obtained: Math.round(totalMarksObtained * 100) / 100,
      total_max_marks: totalMaxMarks,
      percentage: Math.round(percentage * 100) / 100,
      overall_feedback: `Automated text comparison completed. Overall similarity: ${Math.round(percentage)}%. Review the feedback for each question to identify areas for improvement.`,
      highlighted_phrases: extractKeyPhrases(studentAnswerText, answerKeyText),
      strengths: percentage >= 75 ? ['Good understanding of concepts', 'Clear explanations'] : ['Shows effort in answering'],
      areas_for_improvement: percentage < 75 ? ['Review answer key for missing concepts', 'Improve answer completeness', 'Add more relevant details'] : ['Fine-tune minor details']
    };
  } catch (error) {
    console.error('❌ Error in fallback comparison:', error);
    throw error;
  }
}

/**
 * Extract questions from text (simple heuristic)
 */
function extractQuestions(text) {
  // Split by question markers like Q1, Q2, etc.
  const questionPattern = /Q\d+\.|Question\s+\d+/gi;
  const parts = text.split(questionPattern).filter(p => p.trim().length > 0);
  return parts;
}

/**
 * Extract marks from question text
 */
function extractMarks(questionText) {
  const marksPattern = /(\d+)\s*marks?/i;
  const match = questionText.match(marksPattern);
  return match ? parseInt(match[1]) : null;
}

/**
 * Extract key phrases that match between student answer and answer key
 */
function extractKeyPhrases(studentText, keyText) {
  const studentWords = studentText.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const keyWords = new Set(keyText.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  
  const matchingPhrases = studentWords.filter(word => keyWords.has(word));
  return matchingPhrases.slice(0, 10); // Return top 10 matching words
}

/**
 * Grade student answer using Gemini AI
 */
async function gradeAnswerWithGemini(questionPaperText, answerKeyText, studentAnswerText, subject) {
  try {
    console.log('🚀 Initializing Gemini AI grading...');
    console.log(`📚 Subject: ${subject}`);
    console.log(`📏 Text lengths - Question: ${questionPaperText.length}, Answer Key: ${answerKeyText.length}, Student: ${studentAnswerText.length}`);
    
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const prompt = `
You are an expert educational evaluator and grader for ${subject}. Your task is to evaluate a student's answer by comparing it with the provided question paper and answer key.

**Question Paper:**
${questionPaperText}

**Answer Key (Model Answer):**
${answerKeyText}

**Student's Answer:**
${studentAnswerText}

**Your Task:**
1. Carefully analyze the student's answer against the answer key
2. Perform semantic evaluation - look for conceptual understanding, not just keyword matching
3. Award marks for each question based on:
   - Accuracy of concepts
   - Completeness of answer
   - Clarity of explanation
   - Relevant examples or formulas
4. Identify and highlight key matching points/phrases from the student's answer that deserve credit
5. Provide constructive feedback for each question
6. Calculate total marks and percentage
7. Give overall performance feedback with specific areas for improvement

**IMPORTANT:** Return your evaluation in the following JSON format ONLY (no additional text):

{
  "marks_per_question": [
    {
      "question_number": 1,
      "marks_obtained": <number>,
      "max_marks": <number>,
      "feedback": "Brief feedback on this answer",
      "highlights": ["key phrase 1", "key phrase 2"]
    }
  ],
  "total_marks_obtained": <sum of all marks obtained>,
  "total_max_marks": <sum of all max marks>,
  "percentage": <calculated percentage>,
  "overall_feedback": "Detailed overall performance feedback with specific areas for improvement (e.g., 'Improve concept clarity in Q3 – missed main formula derivation')",
  "highlighted_phrases": ["important matching phrase 1", "important matching phrase 2"],
  "strengths": ["strength 1", "strength 2"],
  "areas_for_improvement": ["area 1", "area 2"]
}

Ensure the JSON is valid and properly formatted.
`;

    console.log('📤 Sending request to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log('📥 Received response from Gemini AI');
    console.log('📝 Raw response length:', text.length);
    
    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('🤖 Cleaned Gemini AI Response:', text.substring(0, 500) + '...');
    
    // Parse the JSON response
    console.log('🔍 Parsing JSON response...');
    const gradingResult = JSON.parse(text);
    
    // Validate the response structure
    if (!gradingResult.marks_per_question || !Array.isArray(gradingResult.marks_per_question)) {
      throw new Error('Invalid response structure from Gemini AI');
    }
    
    return gradingResult;
  } catch (error) {
    console.error('❌ Gemini AI Error:', error.message);
    console.log('🔄 Falling back to text comparison method...');
    // Don't throw - let the caller handle the fallback
    throw error;
  }
}

/**
 * Main function to evaluate student submission
 */
async function evaluateSubmission(questionPaperPath, answerKeyPath, studentAnswerPath, subject) {
  try {
    console.log('📄 Extracting text from files...');
    
    // Convert relative paths to absolute paths
    const absoluteQuestionPath = path.isAbsolute(questionPaperPath) 
      ? questionPaperPath 
      : path.join(process.cwd(), questionPaperPath);
    
    const absoluteAnswerKeyPath = path.isAbsolute(answerKeyPath) 
      ? answerKeyPath 
      : path.join(process.cwd(), answerKeyPath);
    
    const absoluteStudentPath = path.isAbsolute(studentAnswerPath) 
      ? studentAnswerPath 
      : path.join(process.cwd(), studentAnswerPath);
    
    console.log('📂 File paths:');
    console.log('Question Paper:', absoluteQuestionPath);
    console.log('Answer Key:', absoluteAnswerKeyPath);
    console.log('Student Answer:', absoluteStudentPath);
    
    // Extract text from all three documents
    const questionPaperText = await extractTextFromFile(absoluteQuestionPath);
    const answerKeyText = await extractTextFromFile(absoluteAnswerKeyPath);
    const studentAnswerText = await extractTextFromFile(absoluteStudentPath);
    
    console.log('✅ Text extraction complete');
    console.log(`Question Paper: ${questionPaperText.substring(0, 100)}...`);
    console.log(`Answer Key: ${answerKeyText.substring(0, 100)}...`);
    console.log(`Student Answer: ${studentAnswerText.substring(0, 100)}...`);
    
    // Try Gemini AI first, fallback to text comparison if it fails
    let gradingResult;
    try {
      console.log('🤖 Attempting Gemini AI grading...');
      gradingResult = await gradeAnswerWithGemini(
        questionPaperText,
        answerKeyText,
        studentAnswerText,
        subject
      );
      console.log('✅ Gemini AI grading successful!');
    } catch (geminiError) {
      console.warn('⚠️ Gemini AI failed, using fallback comparison:', geminiError.message);
      gradingResult = compareWithAnswerKey(
        questionPaperText,
        answerKeyText,
        studentAnswerText,
        subject
      );
      console.log('✅ Fallback comparison complete!');
    }
    
    console.log('✅ Grading complete:', gradingResult);
    
    return gradingResult;
  } catch (error) {
    console.error('Error in evaluateSubmission:', error);
    throw error;
  }
}

export { evaluateSubmission, extractTextFromFile };
