const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {isAdmin, verifyToken } = require('../middlewares/authMiddleware');

// User login
router.post('/login', UserController.login);

// Register a new user
router.post('/register', UserController.register);

// Get user profile (protected route)
router.get('/profile', verifyToken, UserController.getProfile);

// Update user profile (protected route)
router.put('/profile', verifyToken, UserController.updateProfile);

// Delete user profile (protected route)
router.delete('/profile', verifyToken, UserController.deleteProfile);


router.get('/admin', verifyToken, isAdmin, UserController.getAllUsers);
module.exports = router;