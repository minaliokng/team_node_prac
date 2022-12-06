const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require("../models/like");
const jwt = require("jsonwebtoken")

const authMiddleWare = require('../index');
const isUser = require("../isUser.js")
// const db = require('../models/index');
// const PostUsertag = new db.sequelize.models.PostUsertag()

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {

    try {
      const posts = await Post.findAll({})
      res.status(201).json(posts);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  .post(authMiddleWare, async (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");
    const userId = jwt.verify(authToken, "sparta")
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
  })

router.route('/like')
  .get(authMiddleWare, async (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");
    const userId = jwt.verify(authToken, "sparta")
    try {
      const likes = await Like.findAll({
        where: {
          likerId: userId.userId
        }
      })
      res.status(200).send(likes.sort())
    } catch (err) {
      console.error(err);
      next(err);
    }
  })


router.route('/:postId')
  .get(async (req, res, next) => {

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
  })
  .put(async (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");
    const userId = jwt.verify(authToken, "sparta")
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
  })
  .delete(async (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");
    const userId = jwt.verify(authToken, "sparta")
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
  })

router.route('/:postId/like')
  .put(authMiddleWare, async (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");
    const userId = jwt.verify(authToken, "sparta")
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
  })

// router.route('/:postId/like')
//   .put(async (req, res, next) => {
//     try {
//       console.log(PostUsertag)
//       const post = await Post.findOne({ where: { id: req.params.postId } })
//       if (post) {

//         await post.addUsers(req.body.userId);
//         PostUsertag.dataValues.UserId = req.body.userId;
//         PostUsertag.dataValues.PostId = req.params.postId;
//         res.send(PostUsertag)
//       }
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
//   })

module.exports = router;