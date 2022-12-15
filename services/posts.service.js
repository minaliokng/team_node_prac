const { json } = require('sequelize');
const PostRepository = require('../repositories/posts.repository');
const { Post, Like } = require("../models");

class PostService {
  postRepository = new PostRepository(Post, Like);

  isMine = async (userId, postId) => {
    const post = await this.postRepository.getOnePost(postId);
    
    if(post.userId === userId) return true;
    else return false;
  }

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

  updatePost = async (userId, postId, title, content) => {
    if(!title || !content) return{message: "잘못된 형식입니다.", code: 400}

    if(!(await this.getOnePost(postId))) throw null;

    if(await this.isMine(userId, postId)){
      await this.postRepository.updatePost(postId, title, content);
      return {message: "수정 성공", code: 200};
    }
    else return {message: "본인 소유의 게시글이 아닙니다", code: 400};
  }

  deletePost = async (userId, postId) => {
    if(await this.isMine(userId, postId)){
      await this.postRepository.deletePost(postId);
      return {message: "삭제 성공", code: 200};
    }
    else return {message: "본인 소유의 게시글이 아닙니다", code: 400};
  }

  addLike = async (postId, userId, likes) => {
    await this.postRepository.addLike(postId, userId, likes);
    return;
  }

  deleteLike = async (postId, userId, likes) => {
    await this.postRepository.deleteLike(postId, userId, likes)
  }

  updateLike = async (postId, userId) => {
    const likeExists = await this.postRepository.getOneLike(postId, userId);
    const post = await this.postRepository.getOnePost(postId);

    if(!post) return {message: "존재하지 않는 게시글입니다.", code: 404 }
    if (likeExists) {
      await this.deleteLike(postId, userId, post.likes);

      return { message: "게시글의 좋아요를 취소하였습니다." , code: 200 };
    } else {
      await this.addLike(postId, userId, post.likes);

      return { message: "게시글의 좋아요를 등록하였습니다." , code: 200 };
    }
  }
}

module.exports = PostService;