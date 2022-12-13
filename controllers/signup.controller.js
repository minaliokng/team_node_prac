const {User} = require('../models')

function isId(value) {
  var regExp = /^[A-Z]+[a-z0-9]{3,19}$/g;

  return regExp.test(value);
}

class SignupController {
  signup = async (req, res, next) => {
    try {
      const nickname = req.body.nickname;
      const password = req.body.password;
      const confirm = req.body.confirm;

      console.log(User)
      const user_nick = await User.findOne({
        where: {
          nickname
        }
      })

      if (user_nick) {
        return res.status(412).send('중복된 닉네임이네요');
      };

      if (password != confirm) {
        return res.status(412).send('패스워드가 일치하지 않습니다.');
      };

      if (password.length < 4 || password.indexOf(nickname) != -1) {
        return res.status(412).send('패스워드 형식이 일치하지 않습니다')
      };

      if (isId(nickname)) {
        return res.status(412).send('아이디 형식이 일치하지 않습니다.')
      }


      const user = await User.create({
        nickname,
        password,
      })

      console.log(user);
      res.status(200).send('회원 가입에 성공하였습니다.');

    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = SignupController