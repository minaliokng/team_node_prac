const express = require('express');
const router = express.Router();

const isLogedIn = require('../middlewares/isLogedIn');

const LoginController = require('../controllers/login.controller');
const loginController = new LoginController();

router.post('/', isLogedIn, loginController.postLogin);

module.exports = router;
