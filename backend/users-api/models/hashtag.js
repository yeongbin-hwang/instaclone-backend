const { DataTypes, Model } = require('sequelize');

module.exports = class Hashtag extends Model{
  static init(sequelize){
    return super.init({
      title: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Hashtag',
      tableName: 'hashtags',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db){
    db.Hashtag.belongsToMany(db.Post, { through : 'PostHashtag'});
  }
};