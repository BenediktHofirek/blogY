'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.blog, {
        foreignKey: 'author_id',
        as: 'blogs',
        onDelete: 'CASCADE',
      });
    }
  };
  user.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    photo_url: DataTypes.TEXT,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'user',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return user;
};