const { User } = require('../models');

class LoginRepository {
  findUser = async (nickname, password) => {
    const user = await User.findOne({
      where: {
        nickname: nickname,
        password: password,
      },
    });
    console.log('LoginRepository user: ', user);

    return user;
  };
}

module.exports = LoginRepository;
