
const { Router } = require('express');
const ensureLoggedIn = require('connect-ensure-login');
const controllers = require('../controllers/index.js');

const router = Router();

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.post('/register', ensureLoggedIn.ensureLoggedOut, controllers.register);
router.delete('/deleteAccount', ensureLoggedIn.ensureLoggedIn, controllers.deleteAccount);

//users
router.get('/users', controllers.getAllUsers);
// router.put('/users', ensureLoggedIn.ensureLoggedIn(), controllers.editUser);

//blogs
router.get('/blogs', controllers.getAllBlogs);
// router.post('/blogs', controllers.createBlog);
// router.put('/blogs/:blogId', ensureLoggedIn.ensureLoggedIn(), controllers.editBlog);
// router.delete('/blogs/:blogId', ensureLoggedIn.ensureLoggedIn(), controllers.deleteBlog);

//articles
router.get('/articles', controllers.getAllArticles);
// router.post('/articles', controllers.createArticle);
// router.put('/articles/:articleId', ensureLoggedIn.ensureLoggedIn(), controllers.editArticle);
// router.delete('/articles/:articleId', ensureLoggedIn.ensureLoggedIn(), controllers.deleteArticle);

module.exports = router;