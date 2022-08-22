const { DataTypes, Model } = require('sequelize');

module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        text: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        parent: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Comment',
        tableName: 'comments',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.Post);
    db.Comment.belongsTo(db.User);
  }
};
