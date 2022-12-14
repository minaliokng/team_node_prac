const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        userId: {
          type: Sequelize.INTEGER(45),
          allowNull: false,
        },
        likes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' });
    db.Post.hasMany(db.Comment, { foreignKey: 'postId', sourceKey: 'postId' });
    db.Post.hasMany(db.Like, { foreignKey: 'postId', sourceKey: 'postId' });
  }
};
