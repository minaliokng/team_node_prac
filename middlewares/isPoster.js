const { Post } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async function isPoster(req, res, next) {
  const authorization = req.cookies.token;
  const postUserId = await Post.findOne({
    where: {
      postId: req.params.postId
    }
  })

  const userId = jwt.verify(authorization, 'sparta');
  if (userId.id === postUserId.userId) {

    next();
  } else {
    return res.send('본인 소유의 게시글이 아닙니다.');
  }
}