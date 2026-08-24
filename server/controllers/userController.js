const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to format date string
const formatDate = (date) => {
  if (!date) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Helper to transform MongoDB user doc to API response shape
const sanitizeUser = (userDoc) => {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, ...rest } = obj;
  return {
    ...rest,
    id: obj._id,
    joined: formatDate(obj.createdAt)
  };
};

// GET /api/users - Fetch all users from MongoDB
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const formattedUsers = users.map(user => sanitizeUser(user));
    res.json({
      success: true,
      users: formattedUsers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users: ' + err.message });
  }
};

// POST /api/users - Create new user in MongoDB
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, accountType, status } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role || 'User';
    const assignedAccountType = accountType || 'personal';

    const newUser = new User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: assignedRole,
      accountType: assignedAccountType,
      status: status || 'Active'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create user: ' + err.message });
  }
};

// PUT /api/users/:id - Update user in MongoDB
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, accountType, status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
      if (emailExists) {
        return res.status(409).json({ success: false, message: 'This email is already in use by another user.' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) user.name = name.trim();
    if (role) user.role = role;
    if (accountType) user.accountType = accountType;
    if (status) user.status = status;

    if (password && password.trim().length > 0) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update user: ' + err.message });
  }
};

// DELETE /api/users/:id - Delete user in MongoDB
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent deleting the last Admin account
    if (user.role === 'Admin' || user.role === 'Administrator' || user.accountType === 'Admin') {
      const adminCount = await User.countDocuments({
        $or: [
          { role: 'Admin' },
          { role: 'Administrator' },
          { accountType: 'Admin' }
        ]
      });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'At least one Admin account must remain in the database.' });
      }
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully from MongoDB.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user: ' + err.message });
  }
};

// PUT /api/users/:id/status - Toggle or update user status in MongoDB
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newStatus = status ? status : (user.status === 'Active' ? 'Inactive' : 'Active');
    user.status = newStatus;
    await user.save();

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update user status: ' + err.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus
};
