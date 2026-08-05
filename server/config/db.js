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

    const [userCount, panelCount, sensorCount, maintCount, alertCount, reportCount] = await Promise.all([
      User.countDocuments(),
      SolarPanel.countDocuments(),
      SensorData.countDocuments(),
      Maintenance.countDocuments(),
      Alert.countDocuments(),
      Report.countDocuments()
    ]);

    if (userCount === 0) {
      await User.insertMany(seed.users);
      console.log('🌱 Seeded User collection.');
    }
    if (panelCount === 0) {
      await SolarPanel.insertMany(seed.solarPanels);
      console.log('🌱 Seeded SolarPanel collection.');
    }
    if (sensorCount === 0) {
      await SensorData.insertMany(seed.sensorData);
      console.log('🌱 Seeded SensorData collection.');
    }
    if (maintCount === 0) {
      await Maintenance.insertMany(seed.maintenanceRecords);
      console.log('🌱 Seeded Maintenance collection.');
    }
    if (alertCount === 0) {
      await Alert.insertMany(seed.alerts);
      console.log('🌱 Seeded Alert collection.');
    }
    if (reportCount === 0) {
      await Report.insertMany(seed.reports);
      console.log('🌱 Seeded Report collection.');
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
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully to:', mongoURI);
    await seedDatabaseIfEmpty();
  } catch (err) {
    isConnected = false;
    console.log('⚠️ MongoDB connection unavailable. Operating in fallback mode.');
  }
};

const getStore = () => memoryStore;
const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getStore,
  getIsConnected
};
