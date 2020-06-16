const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');
const userController = require('../controllers/user.controller');

router.get('/login', loginController.login);
router.get('/users', userController.listUsers);
router.post('/add-user', userController.addUser);
router.get('/user-logs', userController.userLogs);

module.exports = router; 