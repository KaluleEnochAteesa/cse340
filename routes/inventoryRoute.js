// Needed Resources 
const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const { validateClassification } = require('../middleware/inventoryValidation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle detail view
router.get("/detail/:invId", invController.buildVehicleDetail);

router.get("/trigger-error", (req, res, next) => {
    try {
        throw new Error("Intentional error for testing");
    } catch (err) {
        next(err);
    }
});

router.get("/", invController.buildManagement);

router.get('/add-classification', invController.buildAddClassification);
router.post('/add-classification', validateClassification, invController.insertClassification);
router.get('/add-inventory', invController.buildAddInventory);
router.post('/add-inventory', invController.insertInventory);

module.exports = router;