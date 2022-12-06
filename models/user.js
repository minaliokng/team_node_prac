const Sequelize = require('sequelize');

function isValidNickname(nick) {
  if (nick.length > 3) {
    return true;
  } else {
    return false;
  }
}


module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          isNickname(nickname) {
            if (!isValidNickname(nickname)) {
              throw new Error('닉네임 형식이 맞지 않습니다.');
            }
          }
        }
      },
      password: {
        type: Sequelize.STRING(25),
        allowNull: false,
      }
    },
      {
        sequelize,
        timestamps: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
      }
    )
  }
  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: 'poster', sourceKey: 'id' })
    db.User.belongsToMany(db.Post, { through: 'PostUsertag' })
  }
}