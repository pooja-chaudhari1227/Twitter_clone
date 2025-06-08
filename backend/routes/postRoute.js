const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Route definitions
router.post('/', postController.validatePost, postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.validatePost, postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;