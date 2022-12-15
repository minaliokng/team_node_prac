const jwt = require("jsonwebtoken");
const { User } = require('../models');

module.exports = async function authMiddleWare(req, res, next) {

  const authorization = req.cookies.token;

  if (!authorization) {

    return res.status(401).json({
      errorMessage: "로그인 후 사용해주세요."
    });
  }

  try {
    const userId = jwt.verify(authorization, 'sparta')

    const user = await User.findOne({
      where: {
        userId: userId.id
      }
    });
    console.log('userzzz', user)
    if (user) {
      res.locals.user = user;
      next();
    } else {
      return res.send('잘못된 접속경로인데?')
    }
  } catch (error) {
    console.log(error)
    res.status(402).json({
      errorMessage: '로그인 후 사용가능합니다.'
    })
  }
}
