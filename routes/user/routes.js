const router = require('express').Router();
const userController = require('../../controllers/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/user', userController.authenticateToken, userController.getUserData)
router.get('/index', userController.index)


module.exports = router;