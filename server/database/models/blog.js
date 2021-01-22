'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      blog.hasMany(models.article, {
        foreignKey: 'blog_id',
        as: 'articles',
        onDelete: 'CASCADE',
      });

      blog.belongsTo(models.user, {
        foreignKey: 'author_id',
        as: 'author',
      });
    }
  };
  blog.init({
    name: DataTypes.STRING,
    author_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'blog',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return blog;
};