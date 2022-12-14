const LoginRepository = require('../repositories/login.repositories');
const { json } = require('sequelize');
const jwt = require('jsonwebtoken');

class LoginService {
  loginRepository = new LoginRepository();

  postLogin = async (nickname, password) => {
    const user = await this.loginRepository.findUser(nickname, password);
    console.log('user: ', user);

    if (!user) {
      return json({
        status: 400,
        errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
      });
    }

    const token = jwt.sign(
      {
        userId: user.userId, // payload 설정
      },
      'blog-secret-key' // jwt를 활용 암호화를 위한 비밀키
    );

    return json({
      status: 200,
      token: token,
    });
  };
}

module.exports = LoginService;
