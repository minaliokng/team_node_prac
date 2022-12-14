const express = require('express');
const router = express.Router();

const isLogedIn = require('../middlewares/isLogedIn');

const SignupController = require('../controllers/signup.controller');
const signupController = new SignupController();

router.post('/', isLogedIn, signupController.postSignup);

module.exports = router;
