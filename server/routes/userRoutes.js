const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, updateUserStatus } = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Protect all user management endpoints with authentication and Admin authorization
router.use(verifyToken);
router.use(verifyAdmin);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/status', updateUserStatus);

module.exports = router;
