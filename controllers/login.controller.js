const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

const {User} = require('../models')

class LoginController {
  login = async (req, res, next) => {
    try {
      const {nickname, password} = req.body;

      let user
      if(nickname && password) user =  await User.findOne({
        where: {
          nickname, password
        }
      });

      if (!user) {
        return res.status(400).send('닉네임 또는 패스워드를 확인해주세요. ^_^;')
      }

      const token = jwt.sign({ userId: user.dataValues.userId }, 'sparta')
      // return res.status(200).send({ token: jwt.sign({ userId: user.nickname }, process.env.MY_SECRET_KEY) })
      res.cookie('token', token, { httpOnly: true, });
      res.json({ 'token': token })

    } catch (err) {
      next('로그인에 실패했습니다.');
    }
  }
}

module.exports = LoginController;