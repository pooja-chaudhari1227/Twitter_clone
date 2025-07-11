
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', commentController.validateComment, commentController.createComment);
router.get('/', commentController.getComments);
router.get('/:id', commentController.getCommentById);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
