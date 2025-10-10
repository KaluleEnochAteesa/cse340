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
  regValidate.registationRules(),
  regValidate.checkRegData,
  handleErrors(accountController.registerAccount)
)


module.exports = router;

