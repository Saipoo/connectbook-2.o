import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testApiKey() {
  console.log('🔑 Testing Gemini API Key...\n');
  console.log('API Key (first 20 chars):', process.env.GEMINI_API_KEY?.substring(0, 20) + '...\n');
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Test 1: Try gemini-1.5-flash (older, stable model)
  console.log('📝 Test 1: Trying gemini-1.5-flash...');
  try {
    const model15 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model15.generateContent('Say "Hello"');
    const response = await result.response;
    console.log('✅ gemini-1.5-flash works!');
    console.log('Response:', response.text());
  } catch (error) {
    console.error('❌ gemini-1.5-flash failed:', error.message);
  }
  
  console.log('\n📝 Test 2: Trying gemini-2.5-flash...');
  // Test 2: Try gemini-2.5-flash (newer model)
  try {
    const model25 = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model25.generateContent('Say "Hello"');
    const response = await result.response;
    console.log('✅ gemini-2.5-flash works!');
    console.log('Response:', response.text());
  } catch (error) {
    console.error('❌ gemini-2.5-flash failed:', error.message);
    if (error.message.includes('quota')) {
      console.log('\n💡 This is a QUOTA issue. Your API key has hit the rate limit.');
      console.log('📅 Quota typically resets at midnight Pacific Time.');
      console.log('⏰ You may need to wait or use a different API key.');
    } else if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 API Key Issues:');
      console.log('   1. New key might need 5-15 minutes to activate');
      console.log('   2. Check if Early Access APIs are enabled in Google AI Studio');
      console.log('   3. Make sure the key was copied correctly (no extra spaces)');
    }
  }
  
  process.exit(0);
}

testApiKey();
