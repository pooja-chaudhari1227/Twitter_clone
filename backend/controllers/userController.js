// userController.js
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.validateUser = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be in between 1 and 255 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .escape(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/(?=.*[A-Z])/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/(\d.*){3,}/)
    .withMessage('Password must contain at least three digits')
    .matches(/[\W_]/)
    .withMessage('Password must contain at least one special character')
    .escape(),
];

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }
    const { username, email, password } = req.body;
    const user = await User.create({
      USER_USERNAME: username,
      USER_EMAIL: email,
      USER_PASSWORD: password
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { disabled: 0 } });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.disabled === 1) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }
    const { username, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user || user.disabled === 1) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({
      USER_USERNAME: username,
      USER_EMAIL: email,
      USER_PASSWORD: password
    });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.disabled === 1) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({ disabled: 1 });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { USER_EMAIL: email, disabled: 0 } });
    if (!user) {
      return res.status(404).json({ error: 'User not found or disabled' });
    }
    if (user.USER_PASSWORD !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};