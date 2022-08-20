const { DataTypes, Model } = require('sequelize');

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(40),
          allowNull: true,
          unique: true,
        },
        fullname: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        avatar: {
          type: DataTypes.STRING(200),
          allowNull: false,
          defaultValue:
            'https://res.cloudinary.com/dz5alijky/image/upload/v1660927636/default-user-icon-13_hpland.png',
        },
        website: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        bio: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        provider: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: 'local',
        },
        snsId: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.Post, {
      foreignKey: 'LikeUserId',
      as: 'LikePosts', //as: alias
      through: 'LikePost',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
};
