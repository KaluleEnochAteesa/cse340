const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async (req, res, next) => {
  try {
    const invId = parseInt(req.params.invId)
    const data = await invModel.getVehicleById(invId)
    if (!data) {
      return next(new Error("Vehicle not found"))
    }
    const html = utilities.buildVehicleHTML(data)
    const nav = await utilities.getNav()
    res.render("inventory/vehicle-detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      content: html
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont