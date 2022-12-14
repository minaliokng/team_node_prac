const Sequelize = require('sequelize');
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        nickname: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: 'userId', sourceKey: 'userId' });
    db.User.hasMany(db.Comment, { foreignKey: 'userId', sourceKey: 'userId' });
    db.User.hasMany(db.Like, { foreignKey: 'userId', sourceKey: 'userId' });
  }
};
