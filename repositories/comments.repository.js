class CommentRepository {
    constructor(CommentsModel) {
        this.commentsModel = CommentsModel
    }

    getComments = async () => {
        return await this.commentsModel.findAll()
    }

    getOneComment = async (commentId) => {
        console.log(commentId.commentId)
        return await this.commentsModel.findOne({ 
            where: { commentId :commentId.commentId },
        })
    }
// 수정
    createComment = async (userId, postId, comment) => {
        return await this.commentsModel.create({
            userId, 
            postId, 
            comment
        })
    }

    updateComment = async (commentId, comment) => {
        return await this.commentsModel.update(
            { comment },
            { where : { commentId }}
        )
    }

    deleteComment = async (commentId) => {
        return await this.commentsModel.destroy(
            { where : { commentId }}
        )
    }  
}

module.exports = CommentRepository

