const Comment = require('../models/comment');
const jwt = require('jsonwebtoken')

class CommentController {
  //postService = new PostService();

  getComments = async (req, res, next) => {
    try {
      const comments = await Comment.findAll({
        where: {
          posts_id: req.params.postId
        },
        attributes: ['comment', 'created_at']
      })
      if (comments.length == 0) {
        return res.status(400).send('존재하지 않는 게시물입니다.')
      }
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  createComment = async (req, res, next) => {
    const authorization = req.cookies.token;

    const userId = jwt.verify(authorization, "sparta")

    try {
      const comment = await Comment.create({
        comment: req.body.comment,
        posts_id: req.params.postId,
        users_id: userId.userId
      })
      res.status(200).send(comment);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  updateComment = async (req, res, next) => {
    try {
      const comment = await Comment.update(
        {
          comment: req.body.comment,
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
  }

  deteleComment = async (req, res, next) => {
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
  }
}

module.exports = CommentController;