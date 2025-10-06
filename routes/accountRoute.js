// Import required modules
const express = require('express');
const router = express.Router();

// Import utilities and controller
const { handleErrors } = require('../utilities'); // Adjust path if needed
const accountController = require('../controllers/accountController'); // You'll build this later

// Route: GET /account (handled in server.js as '/account')
router.get('/', handleErrors(accountController.buildLogin));
router.get('/login', handleErrors(accountController.buildLogin));

// Export the router
module.exports = router;
