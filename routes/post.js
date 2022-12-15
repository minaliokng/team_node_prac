const express = require('express');

const authMiddleWare = require('../middlewares/index');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

const router = express.Router();

router.get('/', postsController.getPosts);
router.post('/', authMiddleWare, postsController.createPost);

router.get('/like', authMiddleWare, postsController.getLike);

router.get('/:postId', postsController.getPostInfo);
router.put('/:postId', authMiddleWare, postsController.updatePost);
router.delete('/:postId', authMiddleWare, postsController.deletePost);

router.put('/:postId/like', authMiddleWare, postsController.updateLike);

module.exports = router;