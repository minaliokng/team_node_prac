const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        commentId: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        comment: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        usersId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        postId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'Comment',
        tableName: 'comments',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.Post, { foreignKey: 'postId', sourceKey: 'postId' });
    db.Comment.belongsTo(db.User, { foreignKey: 'userId', sourceKey: 'userId' });
  }
};
