const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async (req, res, next) => {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Unknown";
    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async (req, res, next) => {
  try {
    const invId = parseInt(req.params.invId);
    const data = await invModel.getVehicleById(invId);
    if (!data) {
      return next(new Error("Vehicle not found"));
    }
    const html = utilities.buildVehicleHTML(data);
    const nav = await utilities.getNav();
    res.render("inventory/vehicle-detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      content: html
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    flashMessage: req.flash("info")
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    flashMessage: req.flash("info"),
    errors: req.flash("errors") || []
  });
};

/* ***************************
 *  Process classification insertion
 * ************************** */
invCont.insertClassification = async (req, res) => {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();
  try {
    await invModel.addClassification(classification_name);
    req.flash("info", "Classification added successfully!");
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      flashMessage: req.flash("info")
    });
  } catch (error) {
    req.flash("errors", [error.message || "Failed to add classification."]);
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      flashMessage: null,
      errors: req.flash("errors")
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications(); // ✅ Fetch classifications
  const classificationList = await utilities.buildClassificationList(classifications); // ✅ Build HTML

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    flashMessage: req.flash("info"),
    errors: req.flash("errors") || [],
    classificationList // ✅ Pass to view
  });
};

/* ***************************
 *  Process inventory insertion
 * ************************** */
invCont.insertInventory = async (req, res) => {
  const { inv_make, inv_model, inv_year, classification_id } = req.body;
  const nav = await utilities.getNav();
  try {
    await invModel.addInventory({ inv_make, inv_model, inv_year, classification_id });
    req.flash("info", "Inventory item added successfully!");
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      flashMessage: req.flash("info")
    });
  } catch (error) {
    req.flash("errors", [error.message || "Failed to add inventory item."]);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      flashMessage: null,
      errors: req.flash("errors")
    });
  }
};
module.exports = invCont;

/* ***************************
 *  Update buildAddClassification to await navigation data
 * ************************** */
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    flashMessage: req.flash("info"),
    errors: req.flash("errors") || []
  });
};

