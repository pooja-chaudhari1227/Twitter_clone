const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.validatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .escape(),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .escape(),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer')
];

exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: `Validation failed: ${errors.array().map(e => e.msg).join(', ')}` });
    }

    const { title, content, userId } = req.body;
    const post = await Post.create({
      POST_TITLE: title,
      POST_CONTENT: content,
      POST_USER_ID: userId
    });
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const whereCondition = {
      disabled: 0
    };
    if (userId) {
      whereCondition.POST_USER_ID = userId;
    }

    const posts = await Post.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ['USER_USERNAME'],
          required: false
        },
        {
          model: Comment,
          where: {disabled : 0},
          attributes: ['COMMENT_ID', 'COMMENT_CONTENT', 'COMMENT_CREATED_AT', 'COMMENT_UPDATED_AT'],
          required: false,
          include: [
            {
              model: User,
              attributes: ['USER_USERNAME'],
              required: false
            }
          ]
        }
      ]
    });
    console.log('Posts with users and comments:', JSON.stringify(posts, null, 2));
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message, error.stack);
    res.status(400).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: `Validation failed: ${errors.array().map(e => e.msg).join(', ')}` });
    }

    const { title, content } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.update({
      POST_TITLE: title,
      POST_CONTENT: content
    });
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.update({
      disabled: 1
    });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
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
    console.log('Comment request body:', JSON.stringify(req.body, null, 2));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ error: `Validation failed: ${errors.array().map(e => e.msg).join(', ')}` });
    }

    const { content, userId, postId } = req.body;
    const comment = await Comment.create({
      COMMENT_CONTENT: content,
      COMMENT_USER_ID: userId,
      COMMENT_POST_ID: postId
    });
    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    console.error('Error creating comment:', error.message, error.stack);
    res.status(400).json({ error: error.message });
  }
};