const utilities = require("../utilities"); // ✅ Corrected path
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

const validate = {};
validate.buildLogin = (req, res) => {
  const errors = validationResult(req);
  res.render("account/login", {
    title: "Login",
    message: null,
    errors: errors.isEmpty() ? null : errors
  });
};

validate.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/login", {
      title: "Login",
      message: "Login failed. Please check your input.",
      errors
    });
  }
  // Proceed with login logic
};
/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters.")
      .matches(/(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/)
      .withMessage("Password must include a number, a capital letter, and a special character.")
  ];
};

validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(); // Optional if your layout uses nav
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      locals: {
        account_email: req.body.account_email
      }
    });
    return;
  }
  next();
};

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* **********************************
 * Check Registration Data
 * ********************************* */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    });
    return;
  }
  next();
};

module.exports = validate;
