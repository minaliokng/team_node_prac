const {Comment} = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async function isCommenter(req, res, next) {
  const authorization = req.cookies.token;

  const commentUserId = await Comment.findOne({
    where: {
      id: req.params.commentId
    }
  })

  const userId = jwt.verify(authorization, 'sparta');
  console.log(userId, commentUserId)
  if (userId.userId === commentUserId.users_id) {
    next()
  } else {
    return res.send('본인 소유의 댓글이 아닙니다.')
  }
}