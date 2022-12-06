const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
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
      poster: {
        type: Sequelize.INTEGER(45),
        allowNull: false,
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
      {
        sequelize,
        timestamps: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      })
  }
  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: 'poster', targetKey: 'id' });
    db.Post.hasMany(db.Comment, { foreignKey: 'posts_id', sourceKey: 'id' })
    db.Post.belongsToMany(db.User, { through: 'PostUsertag' })
  }
}