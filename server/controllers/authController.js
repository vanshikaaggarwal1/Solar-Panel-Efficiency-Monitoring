const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getStore, getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const isConnected = getIsConnected();
    let existingUser = null;

    if (isConnected) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = getStore().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = 'usr-' + Date.now();
    const newUser = {
      _id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'Solar Operator',
      phone: '',
      location: 'Solar Array Station',
      notificationsEnabled: true
    };

    if (isConnected) {
      const dbUser = new User(newUser);
      await dbUser.save();
    } else {
      getStore().users.push(newUser);
    }

    const token = jwt.sign({ id: userId, email: newUser.email, name: newUser.name, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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

    const isConnected = getIsConnected();
    let user = null;

    if (isConnected) {
      user = await User.findOne({ email });
    } else {
      user = getStore().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'Solar Operator',
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
    const isConnected = getIsConnected();
    let user = null;

    if (isConnected) {
      user = await User.findById(userId).select('-password');
    } else {
      user = getStore().users.find(u => u._id === userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'Solar Operator',
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
    const isConnected = getIsConnected();

    if (isConnected) {
      const user = await User.findByIdAndUpdate(
        userId,
        { name, phone, location, notificationsEnabled },
        { new: true }
      ).select('-password');
      return res.json({ success: true, user });
    } else {
      const userIndex = getStore().users.findIndex(u => u._id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      getStore().users[userIndex] = {
        ...getStore().users[userIndex],
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled })
      };
      const updated = getStore().users[userIndex];
      return res.json({
        success: true,
        user: {
          id: updated._id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          phone: updated.phone,
          location: updated.location,
          notificationsEnabled: updated.notificationsEnabled
        }
      });
    }
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

    const isConnected = getIsConnected();
    let user = null;

    if (isConnected) {
      user = await User.findById(userId);
    } else {
      user = getStore().users.find(u => u._id === userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (isConnected) {
      user.password = hashedPassword;
      await user.save();
    } else {
      user.password = hashedPassword;
    }

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to change password: ' + err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
