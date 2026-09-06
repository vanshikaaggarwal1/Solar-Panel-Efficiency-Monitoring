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

// GET /api/users - Fetch users belonging to Admin's Organization
const getUsers = async (req, res) => {
  try {
    const adminUser = req.user;
    if (adminUser.accountType === 'personal' || !adminUser.organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Personal accounts do not have access to Organization User Management.'
      });
    }

    const users = await User.find({ organizationId: adminUser.organizationId })
      .select('-password')
      .sort({ createdAt: -1 });

    const formattedUsers = users.map(user => sanitizeUser(user));
    res.json({
      success: true,
      users: formattedUsers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users: ' + err.message });
  }
};

// POST /api/users - Create new organization user (Admin only)
const createUser = async (req, res) => {
  try {
    const adminUser = req.user;
    if (adminUser.accountType === 'personal' || !adminUser.organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Personal accounts cannot create organization members.'
      });
    }

    const { name, email, password, role, status } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const validRoles = ['Admin', 'Manager', 'Operator', 'Technician', 'Viewer'];
    const assignedRole = validRoles.includes(role) ? role : 'Operator';

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'usr-' + Date.now() + Math.random().toString(36).substring(2, 5);

    const newUser = new User({
      _id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: assignedRole,
      accountType: adminUser.accountType,
      organizationId: adminUser.organizationId,
      organizationName: adminUser.organizationName || '',
      status: status || 'Active',
      createdBy: adminUser.id,
      createdVia: 'admin'
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

// PUT /api/users/:id - Update user within Admin's Organization
const updateUser = async (req, res) => {
  try {
    const adminUser = req.user;
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    const user = await User.findOne({ _id: id, organizationId: adminUser.organizationId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in your organization.' });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
      if (emailExists) {
        return res.status(409).json({ success: false, message: 'This email is already in use by another user.' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) user.name = name.trim();
    if (role && ['Admin', 'Manager', 'Operator', 'Technician', 'Viewer'].includes(role)) {
      user.role = role;
    }
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

// DELETE /api/users/:id - Delete user within Admin's Organization
const deleteUser = async (req, res) => {
  try {
    const adminUser = req.user;
    const { id } = req.params;

    const user = await User.findOne({ _id: id, organizationId: adminUser.organizationId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in your organization.' });
    }

    // Prevent Admin from deleting themselves
    if (user._id === adminUser.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own active Admin account.' });
    }

    // Prevent deleting the last Admin account in organization
    if (user.role === 'Admin' || user.role === 'Administrator') {
      const adminCount = await User.countDocuments({
        organizationId: adminUser.organizationId,
        $or: [{ role: 'Admin' }, { role: 'Administrator' }]
      });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'At least one Admin account must remain in the organization.' });
      }
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully from organization.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user: ' + err.message });
  }
};

// PUT /api/users/:id/status - Toggle or update user status within Admin's Organization
const updateUserStatus = async (req, res) => {
  try {
    const adminUser = req.user;
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findOne({ _id: id, organizationId: adminUser.organizationId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in your organization.' });
    }

    if (user._id === adminUser.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own active Admin account.' });
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
