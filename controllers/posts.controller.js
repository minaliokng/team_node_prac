// const PostService = require('../services/posts.service');

const Post = require('../models/post');
const Like = require("../models/like");
const jwt = require("jsonwebtoken")

class PostsController {
  //postService = new PostService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  getPosts = async (req, res, next) => {
    try {
      const posts = await Post.findAll({})
      res.status(201).json(posts);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  createPost = async (req, res, next) => {
    const authorization = req.cookies.token;

    const userId = jwt.verify(authorization, "sparta")
    try {
      const post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        poster: userId.userId
      })
      res.status(200).send('게시글작성 성공~!');
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  getLike = async (req, res, next) => {
    const authorization = req.cookies.token;

    const userId = jwt.verify(authorization, "sparta")

    let data = []
    try {
      const likes = await Like.findAll({
        where: {
          likerId: userId.userId
        }
      })
      const a = await Promise.all(likes.map(a => {
        return Post.findOne({
          where: {
            id: a.dataValues.postId
          }
        })
      }))
      res.status(200).send(a)
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  getPostInfo = async (req, res, next) => {
    try {
      const post = await Post.findOne({
        where: {
          id: req.params.postId
        }
      })

      res.status(200).json(post);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  updatePost = async (req, res, next) => {
    const authorization = req.cookies.token;

    const userId = jwt.verify(authorization, "sparta")
    const post = await Post.findOne({
      where: {
        id: req.params.postId
      }
    })
    try {
      if (userId.userId == post.id) {
        await Post.update(
          {
            title: req.body.title,
            content: req.body.content
          },
          {
            where: { id: req.params.postId }
          }
        )
        res.status(200).json('변경 성공');
      } else {
        res.status(400).send("작성자만 변경 가능합니다.")
      }

    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  deletePost = async (req, res, next) => {
    const authorization = req.cookies.token;

    const userId = jwt.verify(authorization, "sparta")
    const post = await Post.findOne({
      where: {
        id: req.params.postId
      }
    })
    try {
      if (userId.userId == post.id) {
        await Post.destroy(
          {
            where: { id: req.params.postId }
          }
        )
        res.status(200).json('삭제 성공');
      } else {
        res.status(400).send("작성자만 삭제 가능합니다.")
      }

    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  putLike = async (req, res, next) => {
    const authorization = req.cookies.token;

    const userId = jwt.verify(authorization, "sparta")
    try {
      const likeExists = await Like.findOne({
        where: {
          likerId: userId.userId,
          postId: req.params.postId
        }
      })
      const post = await Post.findOne({
        where: {
          id: req.params.postId
        }
      })
      if (likeExists) {
        await Post.update(
          {
            likes: post.likes -= 1
          },
          {
            where: {
              id: likeExists.postId
            }
          }
        )
        await Like.destroy({
          where: {
            id: likeExists.id
          }
        })

        res.status(200).send('좋아요취소!');
      } else {
        await Post.update(
          {
            likes: post.likes += 1
          },
          {
            where: {
              id: req.params.postId
            }
          }
        )
        const like = await Like.create({
          likerId: userId.userId,
          postId: req.params.postId
        })
        res.status(200).send(like);
      }

    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = PostsController;