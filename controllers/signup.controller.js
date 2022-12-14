const SignupService = require('../services/signup.services');

class SignupController {
  signupService = new SignupService();

  postSignup = async (req, res, next) => {
    const { nickname, password, confirm } = req.body;
    const result = await this.signupService.postSignup(nickname, password, confirm);
    console.log('result: ', result);

    return res.status(result.conditions.status).json({ result: result.conditions.msg });
  };
}

module.exports = SignupController;
