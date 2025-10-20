import UpdateGeneratorService from './services/updateGeneratorService.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testGeneration() {
  try {
    console.log('🧪 Testing AI Update Generation...\n');
    console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY?.substring(0, 20) + '...\n');
    
    const updates = await UpdateGeneratorService.generateAllUpdates();
    
    console.log('\n✅ Generation successful!');
    console.log(`📊 Generated ${updates.length} updates`);
    
    // Show breakdown by category
    const breakdown = updates.reduce((acc, update) => {
      acc[update.category] = (acc[update.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📂 Category breakdown:');
    Object.entries(breakdown).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} updates`);
    });
    
    // Show first update as sample
    if (updates.length > 0) {
      console.log('\n📝 Sample update:');
      console.log(`   Title: ${updates[0].title}`);
      console.log(`   Category: ${updates[0].category}`);
      console.log(`   AI Generated: ${updates[0].aiGenerated}`);
      console.log(`   Has relatedResources: ${updates[0].relatedResources?.length > 0}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during generation:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('API Response:', error.response);
    }
    process.exit(1);
  }
}

testGeneration();
