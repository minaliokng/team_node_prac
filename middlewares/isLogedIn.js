module.exports = async function isLogedIn(req, res, next) {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || '').split(' ');

  if (authType === 'Bearer' || authToken) {
    return res.status(401).send({
      errorMessage: '이미 로그인이된 사용자입니다.',
    });
  } else {
    next();
  }
};
