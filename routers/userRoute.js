const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.register);

// Login a user
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Get user details by ID
router.get('/:user_id', userController.getUser);
router.get('/', userController.getAllUser);

// Update user information
router.patch('/:user_id', userController.updateUser);

// Delete user account
router.delete('/:user_id', userController.deleteUser);

module.exports = router;
