const express = require('express');

const authMiddleWare = require('../middlewares/index');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

const router = express.Router();

router.get('/', postsController.getPosts);
router.post('/', authMiddleWare, postsController.createPost);

router.get('/like', authMiddleWare, postsController.getLike);

router.get('/:postId', postsController.getPostInfo);
router.put('/:postId', postsController.updatePost);
router.delete('/:postId', postsController.deletePost);

router.put('/:postId/like', authMiddleWare, postsController.putLike);

module.exports = router;