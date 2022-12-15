module.exports = function test(req, res, next) {
  console.log(req.cookies);
  next();
}