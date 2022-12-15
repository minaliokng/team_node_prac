const { json } = require('sequelize')
const CommentRepository = require('../repositories/comments.repository');
const { Post, Comment} = require('../models')

class CommentService {
    commentRepository = new CommentRepository(Comment);

    isMine = async (userId, commentId) => {
        console.log(commentId)
        const comment = await this.commentRepository.getOneComment(commentId)
        
        if (comment.userId === userId ) return true
        else return false
    }
    
    getComments = async (commentId) => {
        return await this.commentRepository.getComments(commentId);
    }

    createComment = async (userId, postId, comment) => {
        return await this.commentRepository.createComment(userId, postId, comment);
    }

    updateComment = async (userId, commentId, comment) => {
        
        if (await this.isMine(userId, commentId)){
            await this.commentRepository.updateComment(commentId, comment)
            return { message : '수정 성공', code: 200 }
        }

        else return { message : '본인 소유의 댓글이 아닙니다.', code: 400}
    }

    deleteComment = async (userId, commentId) => {
        
        if (await this.isMine(userId, commentId)){
            await this.commentRepository.deleteComment(commentId)
            return { message : '삭제 성공', code: 200}
        }

        else return { message : '본인 소유의 댓글이 아닙니다.', code: 400}
    }
} 

module.exports = CommentService