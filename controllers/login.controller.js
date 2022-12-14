const LoginService = require('../services/login.services');
const dotenv = require('dotenv');
dotenv.config();
const { User } = require('../models');

class LoginController {
  loginService = new LoginService();

  postLogin = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;
      const result = await this.loginService.postLogin(nickname, password);
      console.log('loginService token: ', result);

      return res.status(result.conditions.status).json(result.conditions);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

module.exports = LoginController;
