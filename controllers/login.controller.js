const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

const User = require('../models/user')

class LoginController {
  login = async (req, res, next) => {
    try {
      const nickname = req.body.nickname;
      const password = req.body.password;

      const user = await User.findOne({
        where: {
          nickname: nickname
        }
      });

      if (!user) {
        return res.status(400).send('닉네임 또는 패스워드를 확인해주세요. ^_^;')
      }

      if (user.password !== password) {
        return res.status(400).send('닉네임 또는 패스워드를 확인해주세요. ^_^;')
      }
      const token = jwt.sign({ userId: user.id }, 'sparta')
      // return res.status(200).send({ token: jwt.sign({ userId: user.nickname }, process.env.MY_SECRET_KEY) })
      res.cookie('token', token, { httpOnly: true, });
      res.json({ 'token': token })

    } catch (err) {
      console.error('로그인에 실패했습니다.');
      next('로그인에 실패했습니다.');
    }
  }
}

module.exports = LoginController;