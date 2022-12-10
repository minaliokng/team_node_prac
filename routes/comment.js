const authMiddleWare = require('../middlewares/index');
const isUser = require("../middlewares/isUser.js")

const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comments.controller');
const commentController = new CommentController();

router.get('/:postId', commentController.getComments);
router.post('/:postId', authMiddleWare, commentController.createComment);

router.put('/:commentId', authMiddleWare, commentController.updateComment);
router.delete('/:commentId', authMiddleWare, isUser, commentController.deteleComment);

module.exports = router;