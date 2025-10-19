import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Internship from './models/Internship.js';
import HackathonChallenge from './models/HackathonChallenge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Import data from separate files
import { internshipsData } from './data/internshipsData.js';
import { hackathonsData } from './data/hackathonsData.js';

const seedAll = async () => {
  try {
    console.log('🚀 Starting seed process...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Seed Internships
    console.log('📝 Seeding internships...');
    await Internship.deleteMany({});
    const internships = await Internship.insertMany(internshipsData);
    console.log(`✅ Seeded ${internships.length} internships`);

    const internshipDomains = {};
    internships.forEach(i => {
      internshipDomains[i.domain] = (internshipDomains[i.domain] || 0) + 1;
    });
    console.log('   By domain:', internshipDomains);

    // Seed Hackathons
    console.log('\n🏆 Seeding hackathons...');
    await HackathonChallenge.deleteMany({});
    const hackathons = await HackathonChallenge.insertMany(hackathonsData);
    console.log(`✅ Seeded ${hackathons.length} hackathons`);

    const hackathonStatuses = {};
    hackathons.forEach(h => {
      hackathonStatuses[h.status] = (hackathonStatuses[h.status] || 0) + 1;
    });
    console.log('   By status:', hackathonStatuses);

    const totalPrize = hackathons.reduce((sum, h) => 
      sum + h.prizes.reduce((s, p) => s + p.amount, 0), 0
    );
    console.log('   Total prize money: ₹' + totalPrize.toLocaleString());

    console.log('\n🎉 All seed data has been successfully created!');
    console.log('\n📊 Summary:');
    console.log(`   - ${internships.length} internships from top companies`);
    console.log(`   - ${hackathons.length} hackathon challenges`);
    console.log(`   - ${internships.reduce((sum, i) => sum + i.tasksCount, 0)} total internship tasks will be generated`);
    console.log(`   - ${hackathons.filter(h => h.status === 'active').length} active hackathons right now`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();
