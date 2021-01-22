const { sequelize } = require("../database/models");
const models = require("../database/models");

const register = async (req, res) => {
  try {
    const user = await models.User.create(req.body);
    return res.status(201).json({
      user
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await models.User.create(req.body);
    return res.status(201).json({
      user
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userList = await sequelize.query(`
      SELECT 
        id,
        created_at as "createdAt",
        description,
        email,
        photo_url as "photoUrl",
        username,
        updated_at as "updatedAt",
        blog_name_list as "BlogNameList"
      FROM 
      (
        SELECT *
        FROM
          users u
        LEFT JOIN 
        (
          SELECT array_agg(b.name) as blog_name_list, b.author_id 
          FROM blogs b
          GROUP BY b.author_id 
        ) b ON u.id = b.author_id
      ) as subresult
    `);
    return res.status(200).json({ userList });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogList = await sequelize.query(`
      SELECT 
        name,
        created_at as "crateadAt",
        updated_at as "updatedAt"
      FROM blogs
    `);
    return res.status(200).json({ blogList });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getAllArticles = async (req, res) => {
  try {
    const articleList = await sequelize.query(`
      SELECT
        name,
        content,
        created_at as "crateadAt", 
        updated_at as "updatedAt"
      FROM articles
    `);
    return res.status(200).json({ articleList });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
module.exports = {
  register,
  deleteAccount,
  getAllArticles,
  getAllBlogs,
  getAllUsers,
};
