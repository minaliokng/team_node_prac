const jwt = require("jsonwebtoken");
const User = require('./models/user');

module.exports = async function authMiddleWare(req, res, next) {
  const { authorization } = req.headers;
  const [authType, authToken] = authorization.split(" ");

  if (authType !== 'Bearer' || !authToken) {
    res.status(400).json({
      errorMessage: "로그인 후 사용해주세요."
    });
    return
  }

  try {
    const userId = jwt.verify(authToken, 'sparta')
    console.log(userId);
    const user = await User.findOne({
      where: {
        id: userId.userId
      }
    });

    if (user) {
      res.locals.user = user;
      next();
    } else {
      return res.send('잘못된 접속경로인데?')
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      errorMessage: '로그인 후 사용가능합니다.'
    })
  }

  return
}
