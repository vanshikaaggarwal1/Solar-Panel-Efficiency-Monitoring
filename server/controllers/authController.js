const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Organization = require('../models/Organization');

// Helper to normalize account type string
const normalizeAccountType = (type) => {
  if (!type) return 'personal';
  const lower = type.toLowerCase();
  if (lower === 'enterprise' || lower === 'organisation' || lower === 'organization') return 'organisation';
  if (lower === 'business') return 'business';
  return 'personal';
};

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, accountType: rawAccountType, organizationName, industry, solarSites, totalCapacity, users } = req.body;
    if (!name || !email || !password || !rawAccountType) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password, accountType).' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const accountType = normalizeAccountType(rawAccountType);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = 'usr-' + Date.now();

    let organizationId = null;
    let role = 'Admin';

    if (accountType === 'business' || accountType === 'organisation') {
      const orgName = (organizationName && organizationName.trim()) || `${name.trim()}'s Organization`;
      const newOrg = new Organization({
        _id: 'org-' + Date.now() + Math.random().toString(36).substring(2, 6),
        name: orgName,
        type: accountType,
        industry: industry || '',
        solarSites: solarSites || '1',
        totalCapacity: totalCapacity || '',
        usersCount: users || '1-5',
        createdBy: userId
      });
      await newOrg.save();
      organizationId = newOrg._id;
      role = 'Admin';
    } else {
      // Personal user account
      organizationId = null;
      role = 'Personal';
    }

    const newUser = new User({
      _id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
      accountType,
      organizationId,
      status: 'Active',
      organizationName: organizationName || '',
      phone: req.body.phone || '',
      location: req.body.location || 'Solar Array Station',
      notificationsEnabled: true
    });

    await newUser.save();

    const tokenPayload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      accountType: newUser.accountType,
      organizationId: newUser.organizationId,
      status: newUser.status
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

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
        organizationId: newUser.organizationId,
        status: newUser.status,
        phone: newUser.phone,
        location: newUser.location,
        organizationName: newUser.organizationName,
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

    const userAccountType = normalizeAccountType(user.accountType);
    const userRole = user.role || (userAccountType === 'personal' ? 'Personal' : 'Admin');
    const userOrgId = user.organizationId || null;

    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: userRole,
      accountType: userAccountType,
      organizationId: userOrgId,
      status: user.status || 'Active'
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

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
        organizationId: userOrgId,
        status: user.status || 'Active',
        phone: user.phone || '',
        location: user.location || 'Solar Array Station',
        organizationName: user.organizationName || '',
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

    const userAccountType = normalizeAccountType(user.accountType);
    const userRole = user.role || (userAccountType === 'personal' ? 'Personal' : 'Admin');
    const userOrgId = user.organizationId || null;

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        accountType: userAccountType,
        organizationId: userOrgId,
        status: user.status || 'Active',
        phone: user.phone || '',
        location: user.location || 'Solar Array Station',
        organizationName: user.organizationName || '',
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
        organizationId: user.organizationId,
        status: user.status,
        phone: user.phone,
        location: user.location,
        organizationName: user.organizationName,
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
