const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edushield_db';

const Student = require('./models/Student');
const Intervention = require('./models/Intervention');
const Prediction = require('./models/Prediction');
const User = require('./models/User');

async function clearCollections() {
  try {
    console.log('Connecting to MongoDB to clear demo data...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const deletedStudents = await Student.deleteMany({});
    const deletedInterventions = await Intervention.deleteMany({});
    const deletedPredictions = await Prediction.deleteMany({});
    const deletedUsers = await User.deleteMany({});

    console.log(`Cleared ${deletedStudents.deletedCount} students, ${deletedInterventions.deletedCount} interventions, ${deletedPredictions.deletedCount} predictions, and ${deletedUsers.deletedCount} users.`);
    console.log('✅ Database is now completely empty.');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err.message);
    process.exit(1);
  }
}

clearCollections();
