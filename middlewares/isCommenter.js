const {Comment} = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async function isCommenter(req, res, next) {
  const authorization = req.cookies.token;

  const commentUserId = await Comment.findOne({
    where: {
      commentId: req.params.commentId
    }
  })

  const userId = jwt.verify(authorization, 'sparta');
  if (userId.userId === commentUserId.userId) {
    next()
  } else {
    return res.send('본인 소유의 댓글이 아닙니다.')
  }
}

// authorization을 controller에서 요청
// service에서 verify를 처리하는 로직을 만들고 repo에 요청
// repo에서 commentUserId를 처리