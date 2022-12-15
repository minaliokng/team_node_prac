const PostService = require('../services/posts.service');

const { Post, Like } = require('../models');
const jwt = require("jsonwebtoken")
class PostsController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    try {
      return res.status(201).json({ Data: await this.postService.findAllPost() });
    } catch (err) {
      next(err);
    }
  }

  createPost = async (req, res) => {
    console.log('reszzz', res.locals.user.dataValues)
    try {
      await this.postService.createPost(res.locals.user.dataValues.userId, req.body.title, req.body.content);
      res.status(200).json({ message: '게시글작성 성공~!' });
    } catch (err) {
      res.status(400).json({ errorMessage: 'errorMessage' })
    }
  }

  getLike = async (req, res, next) => {
    try {
      return res.status(200).json({ Data: await this.postService.getLike(res.locals.user.dataValues.userId) });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  getPostInfo = async (req, res, next) => {
    console.log('req.paramsz', req.params)
    try {
      const post = await this.postService.getOnePost(req.params.postId);
      res.status(200).json({ Data: post });
    } catch (err) {
      console.error(err);
      res.status(400).json({ errorMessage: 'errorMessage' })
    }
  }

  updatePost = async (req, res, next) => {
    try {
      await this.postService.updatePost(req.params.postId, req.body.title, req.body.content);
      res.status(200).json({ 'message': '수정 성공~!' });
    } catch (err) {
      next(err);
    }
  }

  deletePost = async (req, res, next) => {
    try {
      await this.postService.deletePost(req.params.postId);
      res.status(200).json('삭제 성공');
    }
    catch (err) {
      console.error(err);
      next(err);
    }
  }

  updateLike = async (req, res, next) => {
    try {
      const data = await this.postService.updateLike(req.params.postId, res.locals.user.dataValues.userId);
      return res.status(200).json(data)
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = PostsController;