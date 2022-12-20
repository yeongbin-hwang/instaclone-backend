const { DataTypes, Model } = require('sequelize');

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        caption: {
          type: DataTypes.STRING(140),
          allowNull: false,
        },
        files: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.User, {
      foreignKey: 'LikePostId',
      as: 'LikeUsers', //as: alias
      through: 'LikePost',
    });
    db.Post.belongsToMany(db.User, {
      foreignKey: 'SavePostId',
      as: 'SaveUsers', //as: alias
      through: 'SavePost',
    });
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.hasMany(db.Comment);
  }
};
