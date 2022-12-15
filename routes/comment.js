const authMiddleWare = require('../middlewares/index');
const isCommenter = require("../middlewares/isCommenter.js")

const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comments.controller');
const commentController = new CommentController();

router.get('/:postId', commentController.getComments);
router.post('/:postId', authMiddleWare, commentController.createComment);

router.put('/:commentId', authMiddleWare, commentController.updateComment);
router.delete('/:commentId', authMiddleWare, commentController.deleteComment);

module.exports = router;