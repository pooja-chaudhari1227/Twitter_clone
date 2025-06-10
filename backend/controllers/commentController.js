// commentController.js
const { body, validationResult } = require('express-validator');
const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

exports.validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 200 })
    .withMessage('Content must be in between 2 and 200 characters')
    .escape(),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer'),
  body('postId')
    .notEmpty()
    .withMessage('Post ID is required')
    .isInt()
    .withMessage('Post ID must be an integer')
];

exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }
    const { content, userId, postId } = req.body;
    const comment = await Comment.create({
      COMMENT_CONTENT: content,
      COMMENT_USER_ID: userId,
      COMMENT_POST_ID: postId
    });
    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.query;
    const whereCondition = { disabled: 0 };
    if (postId) whereCondition.COMMENT_POST_ID = postId;
    const comments = await Comment.findAll({
      where: whereCondition,
      attributes: ['COMMENT_ID', 'COMMENT_CONTENT', 'COMMENT_CREATED_AT', 'disabled'], 
      include: [
        { model: User, attributes: ['USER_USERNAME'] },
        { model: Post, attributes: ['POST_TITLE'] }
      ]
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      attributes: ['COMMENT_ID', 'COMMENT_CONTENT', 'COMMENT_CREATED_AT'], // Added createdAt
      include: [
        { model: User, attributes: ['USER_USERNAME'] },
        { model: Post, attributes: ['POST_TITLE'] }
      ]
    });
    if (!comment || comment.disabled === 1) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }
    const { content } = req.body;
    const comment = await Comment.findByPk(req.params.id);
    if (!comment || comment.disabled === 1) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    await comment.update({ COMMENT_CONTENT: content });
    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment || comment.disabled === 1) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    await comment.update({ disabled: 1 });
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
