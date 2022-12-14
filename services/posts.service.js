const { json } = require('sequelize');
const PostRepository = require('../repositories/posts.repository');
const { Post, Like } = require("../models");

class PostService {
  postRepository = new PostRepository(Post, Like);

  findAllPost = async () => {
    return await this.postRepository.findAllPost();
  }

  createPost = async (userId, title, content) => {
    return await this.postRepository.createPost(userId, title, content);
  }

  getLike = async (userId) => {
    return await this.postRepository.getLike(userId);
  }

  getOnePost = async (id) => {
    return await this.postRepository.getOnePost(id);
  }

  updatePost = async (postId, title, content) => {
    return await this.postRepository.updatePost(postId, title, content);
  }

  deletePost = async (postId) => {
    return await this.postRepository.deletePost(postId);
  }

  updateLike = async (postId, userId) => {
    const likeExists = await this.postRepository.getOneLike(postId, userId);
    const post = await this.postRepository.getOnePost(postId);    

    if (likeExists) {
      await this.postRepository.updateLike(postId, post.likes, -1, userId);

      return json({message: "게시글의 좋아요를 취소하였습니다."});
    } else {
      await this.postRepository.updateLike(postId, post.likes, 1, userId);

      return json({message: "게시글의 좋아요를 등록하였습니다."});
    }
  }
}

module.exports = PostService;