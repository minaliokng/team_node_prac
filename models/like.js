const Sequelize = require('sequelize');

module.exports = class Like extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      postId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      }
    },
      {
        sequelize,
        timestamps: false,
        modelName: 'Like',
        tableName: 'likes',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
      })
  }
  static associate(db) {
    db.User.belongsTo(db.Post, { foreignKey: 'postId', sourceKey: 'postId' });
    db.User.belongsTo(db.User, { foreignKey: 'userId', sourceKey: 'userId' });
  }
}