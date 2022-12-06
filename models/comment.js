const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      context: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    },
      {
        sequelize,
        timestamps: false,
        modelName: 'Comment',
        tableName: 'comments',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      })
  }
  static associate(db) {
    db.Comment.belongsTo(db.Post, { foreignKey: 'posts_id', sourceKey: 'id' });
  }
}