const { json } = require('sequelize');
const PostRepository = require('../repositories/posts.repository');
// const { Post, Like } = require("../models");
const Post = require('../models/post');
const Like = require('../models/like');
const { validatePost } = require('../middlewares/post.validate');

class PostService {
  postRepository = new PostRepository(Post, Like);

  findAllPost = async () => {
    let post = await this.postRepository.findAllPost()
    post.sort((a, b) => {
      return b.createdAt - a.createdAt
    });
    return post;
  }

  createPost = async (userId, title, content) => {

    validatePost(title, content);

    let post = await this.postRepository.createPost(userId, title, content);
    return post
  }

  getLike = async (userId) => {
    return await this.postRepository.getLike(userId);
  }

  getOnePost = async (id) => {
    return await this.postRepository.getOnePost(id);
  }

  updatePost = async (postId, title, content) => {

    validatePost(title, content);

    return await this.postRepository.updatePost(postId, title, content);
  }

  deletePost = async (postId) => {
    let post = await this.postRepository.deletePost(postId);
    if (!post) {
      throw new Error('해당 게시물이 존재하지 않습니다.')
    }
    return post
  }

  updateLike = async (postId, userId) => {
    const likeExists = await this.postRepository.getOneLike(postId, userId);
    const post = await this.postRepository.getOnePost(postId);

    if (likeExists) {
      await this.postRepository.updateLike(postId, post.likes, -1, userId);

      return json({ message: "게시글의 좋아요를 취소하였습니다." });
    } else {
      await this.postRepository.updateLike(postId, post.likes, 1, userId);

      return json({ message: "게시글의 좋아요를 등록하였습니다." });
    }
  }
}

module.exports = PostService;