const User = require("./models/user");
const Comment = require("./models/comment");
const jwt = require("jsonwebtoken");

module.exports = async function isUser(req, res, next) {
  const { authorization } = req.headers;
  const [authType, authToken] = authorization.split(" ");

  const commentUserId = await Comment.findOne({
    where: {
      id: req.params.commentId
    }
  })

  const userId = jwt.verify(authToken, process.env.MY_SECRET_KEY);
  if (userId.userId === commentUserId.users_id) {
    next()
  } else {
    return res.send('본인 소유의 댓글이 아닙니다.')
  }
}