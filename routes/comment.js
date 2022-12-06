const express = require('express');
const Sequelize = require('sequelize');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken')

const authMiddleWare = require('../index');
const isUser = require("../isUser.js")

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const comments = await Comment.findAll({});
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

router.route('/:postId')
  .get(async (req, res, next) => {
    try {
      const comments = await Comment.findAll({
        where: {
          posts_id: req.params.postId
        },
        attributes: ['context', 'created_at']
      })
      if (comments.length == 0) {
        return res.status(400).send('존재하지 않는 게시물입니다.')
      }
      res.status(200).json(comments);
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
      const comment = await Comment.create({
        context: req.body.context,
        posts_id: req.params.postId,
        users_id: userId.userId
      })
      res.status(200).send(comment);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

router.route('/:commentId')
  .put(authMiddleWare, isUser, async (req, res, next) => {
    try {
      const comment = await Comment.update(
        {
          context: req.body.context,
        },
        {
          where: {
            id: req.params.commentId
          }
        }
      )
      res.status(200).send('수정 성공~!');
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  .delete(authMiddleWare, isUser, async (req, res, next) => {
    console.log(req.headers.authorization);
    try {
      await Comment.destroy({
        where: { id: req.params.commentId }
      })
      res.status(200).send('삭제 성공');
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

module.exports = router;