const { User } = require('../models');

class SignupRepository {
  // find user nickname
  findUserNickname = async (nickname) => {
    const user_nick = await User.findOne({
      where: {
        nickname: nickname,
      },
    });
    return user_nick;
  };

  // create user data
  createUser = async (nickname, password) => {
    const user = await User.create({
      nickname: nickname,
      password: password,
    });
    return user;
  };
}

module.exports = SignupRepository;
