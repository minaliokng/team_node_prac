const SignupRepository = require('../repositories/signup.repositories');
const { json } = require('sequelize');

function isId(value) {
  let regExp = /^[A-Z]+[a-z0-9]{3,19}$/g;
  return regExp.test(value);
}

class SignupService {
  signupRepository = new SignupRepository();

  postSignup = async (nickname, password, confirm) => {
    console.log('SignupService nickname: ', nickname);
    console.log('SignupService password: ', password);
    console.log('SignupService confirm: ', confirm);

    const user_nickname = await this.signupRepository.findUserNickname(nickname);
    console.log('user_nickname: ', user_nickname);

    if (user_nickname) {
      return json({
        status: 412,
        msg: '중복된 닉네임이네요',
      });
    }

    if (password != confirm) {
      return json({
        status: 412,
        msg: '패스워드가 일치하지 않습니다.',
      });
    }

    if (password.length < 4 || password.indexOf(nickname) != -1) {
      return json({
        status: 412,
        msg: '패스워드가 일치하지 않습니다.',
      });
    }

    if (isId(nickname)) {
      return json({
        status: 412,
        msg: '아이디 형식이 일치하지 않습니다.',
      });
    }

    await this.signupRepository.createUser(nickname, password);

    return json({
      status: 200,
      msg: '회원 가입에 성공하였습니다.',
    });
  };
}

module.exports = SignupService;
