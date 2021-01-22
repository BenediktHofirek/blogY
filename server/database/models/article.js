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
      });

      // article.belongsTo(models.user, { through: models.blog });
    }
  };
  article.init({
    name: {
      type: DataTypes.STRING,
      unique: 'compositeArticle',
    },
    blog_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeArticle',
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'article',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return article;
};