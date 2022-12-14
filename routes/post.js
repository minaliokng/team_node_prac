const express = require('express');
const isPoster = require("../middlewares/isPoster.js")

const authMiddleWare = require('../middlewares/index');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

const router = express.Router();

router.get('/', authMiddleWare, postsController.getPosts);
router.post('/', authMiddleWare, postsController.createPost);

router.get('/like', authMiddleWare, postsController.getLike);

router.get('/:postId', postsController.getPostInfo);
router.put('/:postId', authMiddleWare, isPoster, postsController.updatePost);
router.delete('/:postId', authMiddleWare, isPoster, postsController.deletePost);

router.put('/:postId/like', authMiddleWare, postsController.updateLike);

module.exports = router;