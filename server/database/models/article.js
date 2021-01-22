'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      article.belongsTo(models.blog, {
        foreignKey: 'blog_id',
        as: 'blog',
        onDelete: 'CASCADE',
      });
    }
  };
  article.init({
    name: DataTypes.STRING,
    blog_id: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'article',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return article;
};