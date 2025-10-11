const regValidate = require('../utilities/account-validation')
const express = require('express');
const router = express.Router();

const { handleErrors } = require('../utilities');
const accountController = require('../controllers/accountController');

// Routes
router.get('/login', handleErrors(accountController.buildLogin));
router.get('/register', handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)


router.post(
  "/login",
  (req, res) => {
    res.status(200).send("Login process");
  }
);


module.exports = router;

