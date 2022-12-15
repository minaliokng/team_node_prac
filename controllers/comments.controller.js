const CommentService = require('../services/comments.service');
const { Post, Comment } = require('../models')
const jwt = require('jsonwebtoken')

class CommentController {
  commentService = new CommentService();

  getComments = async ( req, res, next ) => {
    try {
      return res.status(200).json({ Data : await this.commentService.getComments() })
    
    } catch (err) {
      next(err)
    }
  }

  createComment = async ( req, res, next ) => {
    try {
      const userId = res.locals.userId
      const postId = req.params.body
      const { comment } = req.body
      
      if (!res.body.comment){
        res.status(412).json({ errorMessage : '잘못된 형식입니다.'})
        throw new Error('InvalidParamsError')
      }
      
      if (!req.params.postId){
        res.status(404).json({ errorMessage : '존재하지 않는 게시글입니다.'})
        throw new Error('InvalidParamsError')
      }
      
      await this.commentService.createComment(userId, postId, comment)
      return res.status(201).send('댓글작성 성공~!')
    
    } catch (err) {
      next(err)
    }
  }

  updateComment = async (req, res, next) => {
    try {

      const userId = res.locals.userId
      const postId = req.params
      const { comment } = req.body
      
      if (!comment){
        res.status(412).json({ errorMessage : '잘못된 형식입니다.'})
        throw new Error('InvalidParamsError')
      }
      else if (!postId){
        res.status(404).json({ errorMessage : '존재하지 않는 게시글입니다.'})
        throw new Error('InvalidParamsError')
      }
      else {
        await this.commentService.updateComment(userId, postId, comment)
        return res.status(201).send('댓글수정 성공~!')
      }
      
    } catch (err) {
      console.error(err)
      next(err)
    }
  }

  deleteComment = async ( req, res, next) => {
    try {
      const userId = res.locals.userId
      const commentId = req.params.commentId

      if(!commentId){
        res.status(404).json({ errorMessage : '존재하지 않는 댓글입니다.'})
      }

      await this.commentService.deleteComment(userId, commentId)
      return res.status(201).send('댓글삭제 성공~!')
    
    } catch (err) {
      next(err)
    }
  }
}

module.exports = CommentController;