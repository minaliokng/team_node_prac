const authMiddleWare = require('../middlewares/index');
const isCommenter = require("../middlewares/isCommenter.js")

const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comments.controller');
const commentController = new CommentController();

router.get('/:postId', commentController.getComments);
router.post('/:postId', authMiddleWare, commentController.createComment);

router.put('/:commentId', authMiddleWare, isCommenter, commentController.updateComment);
router.delete('/:commentId', authMiddleWare, isCommenter, commentController.deteleComment);

module.exports = router;