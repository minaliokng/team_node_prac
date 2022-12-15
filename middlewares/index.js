const jwt = require("jsonwebtoken");
const {User} = require('../models');

module.exports = async function authMiddleWare(req, res, next) {
  const authorization = req.cookies.token;

  if (!authorization) {
    res.status(400).json({
      errorMessage: "로그인 후 사용해주세요."
    });
    return;
  }

  try {
    const userId = jwt.verify(authorization, 'sparta')
    const user = await User.findOne({
      where: {
        userId: userId.userId
      }
    });

    if (user) {
      res.locals.userId = user.userId;
      next();
    } else {
      return res.status(400).json({
        errorMessage : '잘못된 접속경로인데?'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      errorMessage: '로그인 후 사용가능합니다.'
    })
  }

  return;
}
