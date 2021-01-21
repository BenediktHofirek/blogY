
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photoUrl: DataTypes.TEXT,
    description: DataTypes.TEXT,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Blog, {
      foreignKey: 'authorId',
      as: 'blogs',
      onDelete: 'CASCADE',
    });
  };
  return User;
};