import cron from 'node-cron';
import RealTimeUpdate from '../models/RealTimeUpdate.js';
import UpdateGeneratorService from '../services/updateGeneratorService.js';

/**
 * Initialize cron jobs for real-time updates
 */
export function initializeUpdateCronJobs() {
  console.log('📅 Initializing Real-Time Updates cron jobs...');

  // Run every 6 hours to generate new updates
  // Cron expression: '0 */6 * * *' = At minute 0 past every 6th hour
  cron.schedule('0 */6 * * *', async () => {
    console.log('\n🤖 [CRON] Starting scheduled update generation...');
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
    try {
      // Generate new updates
      const newUpdates = await UpdateGeneratorService.generateAllUpdates();
      
      // Filter AI-generated updates only
      const aiUpdates = newUpdates.filter(u => u.aiGenerated === true);
      
      if (aiUpdates.length > 0) {
        try {
          // Save to database with boosted priority and recent timestamp
          const updatesWithBoost = aiUpdates.map(update => ({
            ...update,
            postedAt: new Date(), // Fresh timestamp
            priority: Math.min(update.priority + 1, 10) // Boost priority (max 10)
          }));
          
          const savedUpdates = await RealTimeUpdate.insertMany(updatesWithBoost);
          console.log(`✅ [CRON] Saved ${savedUpdates.length} new AI updates`);
          
          // Log category breakdown
          const breakdown = savedUpdates.reduce((acc, update) => {
            acc[update.category] = (acc[update.category] || 0) + 1;
            return acc;
          }, {});
          console.log('📊 [CRON] Category breakdown:', breakdown);
        } catch (saveError) {
          console.error('❌ [CRON] Error saving updates:', saveError.message);
          console.log('💡 [CRON] Tip: Check for validation errors in update data');
        }
      } else {
        console.log('⚠️ [CRON] No AI updates generated, dummy data remains available');
      }
    } catch (error) {
      console.error('❌ [CRON] Error generating updates:', error.message);
      console.log('✅ [CRON] Existing dummy updates still available for students');
    }
  });

  // Run daily at midnight to clean old updates (30+ days old)
  // Cron expression: '0 0 * * *' = At 00:00 every day
  cron.schedule('0 0 * * *', async () => {
    console.log('\n🧹 [CRON] Starting daily cleanup of old updates...');
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
    try {
      const result = await RealTimeUpdate.cleanOldUpdates(30);
      console.log(`✅ [CRON] Deleted ${result.deletedCount} old updates`);
    } catch (error) {
      console.error('❌ [CRON] Error cleaning old updates:', error);
    }
  });

  // Optional: Run once at startup to ensure we have some updates
  setTimeout(async () => {
    console.log('\n🚀 [STARTUP] Checking for existing updates...');
    
    try {
      const count = await RealTimeUpdate.countDocuments({ isActive: true });
      console.log(`📊 [STARTUP] Found ${count} active updates`);
      
      if (count < 5) {
        console.log('⚡ [STARTUP] Few updates found, generating initial set...');
        
        // Step 1: Insert dummy data first (as fallback)
        console.log('📝 [STARTUP] Inserting dummy updates as fallback...');
        const dummyUpdates = UpdateGeneratorService.getDummyUpdates();
        
        try {
          // Ensure data is properly formatted before insertion
          const normalizedDummy = dummyUpdates.map(update => 
            UpdateGeneratorService.normalizeUpdateData(update)
          );
          
          const savedDummy = await RealTimeUpdate.insertMany(normalizedDummy, { 
            ordered: false, // Continue even if some fail
            rawResult: true 
          });
          console.log(`✅ [STARTUP] Saved ${savedDummy.length || normalizedDummy.length} dummy updates`);
        } catch (dummyError) {
          console.error('❌ [STARTUP] Error saving dummy updates:', dummyError.message);
          if (dummyError.writeErrors) {
            console.error('Validation errors:', dummyError.writeErrors.map(e => e.err.message));
          }
        }
        
        // Step 2: Try to generate AI updates (will appear on top due to newer postedAt)
        console.log('🤖 [STARTUP] Attempting AI update generation...');
        try {
          const aiUpdates = await UpdateGeneratorService.generateAllUpdates();
          
          if (aiUpdates.length > 0) {
            // Filter out dummy updates from AI response (if any)
            const realAIUpdates = aiUpdates.filter(u => u.aiGenerated === true);
            
            if (realAIUpdates.length > 0) {
              // Set postedAt to be newer than dummy data and normalize
              const aiUpdatesWithTime = realAIUpdates.map(update => 
                UpdateGeneratorService.normalizeUpdateData({
                  ...update,
                  postedAt: new Date(Date.now() + 1000), // 1 second newer
                  priority: Math.min((update.priority || 5) + 1, 10) // Boost priority (max 10)
                })
              );
              
              const savedAI = await RealTimeUpdate.insertMany(aiUpdatesWithTime, {
                ordered: false, // Continue even if some fail
                rawResult: true
              });
              console.log(`✅ [STARTUP] Generated ${savedAI.length || aiUpdatesWithTime.length} AI updates (will show first)`);
            } else {
              console.log('⚠️ [STARTUP] AI generation returned only dummy data');
              console.log('💡 [STARTUP] Tip: This usually means API quota is exceeded');
            }
          } else {
            console.log('⚠️ [STARTUP] AI generation produced no updates, using dummy data only');
            console.log('💡 [STARTUP] Gemini API quotas reset at midnight Pacific Time');
          }
        } catch (aiError) {
          console.error('❌ [STARTUP] AI generation failed:', aiError.message);
          if (aiError.message.includes('API key') || aiError.message.includes('quota') || aiError.message.includes('INVALID')) {
            console.log('💡 [STARTUP] API Quota Issue Detected');
            console.log('📊 [STARTUP] Gemini Free Tier: 15 requests/min, 1,500 requests/day');
            console.log('📅 [STARTUP] Quota resets: Midnight Pacific Time');
            console.log('⏰ [STARTUP] Current time:', new Date().toLocaleString());
          }
          console.log('✅ [STARTUP] Dummy updates are available as fallback');
          console.log('👥 [STARTUP] Students can use Real-Time Updates feature now');
        }
        
        // Final count
        const finalCount = await RealTimeUpdate.countDocuments({ isActive: true });
        console.log(`📊 [STARTUP] Total active updates: ${finalCount}`);
      }
    } catch (error) {
      console.error('❌ [STARTUP] Error in startup process:', error);
    }
  }, 5000); // Wait 5 seconds after server starts

  console.log('✅ Cron jobs initialized:');
  console.log('   - Update generation: Every 6 hours');
  console.log('   - Cleanup old updates: Daily at midnight');
  console.log('   - Startup check: 5 seconds after server start');
}

/**
 * Manual trigger for update generation (for testing)
 */
export async function triggerUpdateGeneration() {
  console.log('🎯 Manual update generation triggered...');
  
  try {
    const newUpdates = await UpdateGeneratorService.generateAllUpdates();
    
    if (newUpdates.length > 0) {
      const savedUpdates = await RealTimeUpdate.insertMany(newUpdates);
      console.log(`✅ Generated ${savedUpdates.length} updates manually`);
      return savedUpdates;
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error in manual generation:', error);
    throw error;
  }
}
