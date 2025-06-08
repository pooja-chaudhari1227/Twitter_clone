const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registration and user management
router.post('/', userController.validateUser, userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.validateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Login route
router.post('/login', userController.loginUser);

module.exports = router;
