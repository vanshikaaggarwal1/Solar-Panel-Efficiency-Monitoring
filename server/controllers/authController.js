const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;
    if (!name || !email || !password || !accountType) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = 'usr-' + Date.now();
    const newUser = new User({
      _id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'Admin',
      accountType,
      status: 'Active',
      phone: '',
      location: 'Solar Array Station',
      notificationsEnabled: true
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role, accountType: newUser.accountType, status: newUser.status },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        accountType: newUser.accountType,
        status: newUser.status,
        phone: newUser.phone,
        location: newUser.location,
        notificationsEnabled: newUser.notificationsEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact an administrator.' });
    }

    const userRole = user.role || 'Admin';
    const userAccountType = user.accountType || 'personal';

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: userRole, accountType: userAccountType, status: user.status || 'Active' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        accountType: userAccountType,
        status: user.status || 'Active',
        phone: user.phone || '',
        location: user.location || 'Solar Array Station',
        notificationsEnabled: user.notificationsEnabled !== undefined ? user.notificationsEnabled : true
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'Admin',
        accountType: user.accountType || 'personal',
        status: user.status || 'Active',
        phone: user.phone || '',
        location: user.location || 'Solar Array Station',
        notificationsEnabled: user.notificationsEnabled !== undefined ? user.notificationsEnabled : true
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile: ' + err.message });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, location, notificationsEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, location, notificationsEnabled },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        status: user.status,
        phone: user.phone,
        location: user.location,
        notificationsEnabled: user.notificationsEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile: ' + err.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to change password: ' + err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };

