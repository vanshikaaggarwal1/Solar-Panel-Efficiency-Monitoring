const mongoose = require('mongoose');
const seed = require('../data/seedData');

let isConnected = false;

// In-Memory state fallback when MongoDB is not connected
let memoryStore = {
  users: [...seed.users],
  solarPanels: [...seed.solarPanels],
  sensorData: [...seed.sensorData],
  maintenanceRecords: [...seed.maintenanceRecords],
  alerts: [...seed.alerts],
  reports: [...seed.reports]
};

const seedDatabaseIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const SolarPanel = require('../models/SolarPanel');
    const SensorData = require('../models/SensorData');
    const Maintenance = require('../models/Maintenance');
    const Alert = require('../models/Alert');
    const Report = require('../models/Report');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding MongoDB database with initial datasets...');
      await User.insertMany(seed.users);
      await SolarPanel.insertMany(seed.solarPanels);
      await SensorData.insertMany(seed.sensorData);
      await Maintenance.insertMany(seed.maintenanceRecords);
      await Alert.insertMany(seed.alerts);
      await Report.insertMany(seed.reports);
      console.log('✅ MongoDB database seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding warning:', err.message);
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solar_monitoring';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully to:', mongoURI);
    await seedDatabaseIfEmpty();
  } catch (err) {
    isConnected = false;
    console.log('⚠️ MongoDB connection unavailable. Operating in high-performance seed state mode.');
  }
};

const getStore = () => memoryStore;
const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getStore,
  getIsConnected
};
