const PostService = require('../services/posts.service');
const jwt = require("jsonwebtoken")
class PostsController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    try {
      return res.status(201).json({ data: await this.postService.findAllPost() });
    } catch (err) {
      next(err);
    }
  }

  createPost = async (req, res, next) => {
    try {
      if(!req.body.title || !req.body.content){
        return res.status(400).json({errorMessage: '잘못된 형식입니다.'});
      }
      await this.postService.createPost(res.locals.userId, req.body.title, req.body.content);
      return res.status(200).json({message: '게시글작성 성공~!'});
    } catch (err) {
      next(err);
    }
  }

  getLike = async (req, res, next) => {
    try {
      return res.status(200).json({ Data: await this.postService.getLike(res.locals.userId) });
    } catch (err) {
      next(err);
    }
  }

  getPostInfo = async (req, res, next) => {
    try {
      const post = await this.postService.getOnePost(req.params.postId);

      return res.status(200).json({ Data: post });
    } catch (err) {
      next(err);
    }
  }

  updatePost = async (req, res, next) => {
    const userId = res.locals.userId;
    const {title, content} = req.body;

    try {
      const result = await this.postService.updatePost(userId, req.params.postId, title, content);
      return res.status(result.code).json({message: result.message});
    }
    catch {
      return res.status(404).json({ errorMessage: "존재하지 않는 게시글입니다." })
    }
  }

  deletePost = async (req, res, next) => {
    const userId = res.locals.userId;

    try {
      const result = await this.postService.deletePost(userId, req.params.postId);
      
      return res.status(result.code).json({message: result.message});
    }
    catch {
      return res.status(404).json({ errorMessage: "존재하지 않는 게시글입니다." })
    }
  }

  updateLike = async (req, res, next) => {
    try {
      const data = await this.postService.updateLike(req.params.postId, res.locals.userId);
      return res.status(data.code).json({message: data.message})
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = PostsController;