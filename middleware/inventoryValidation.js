/**
 * Middleware to validate the classification name in inventory routes.
 * Ensures the name contains only alphanumeric characters (no spaces or special characters).
 */
exports.validateClassification = (req, res, next) => {
    const { classification_name } = req.body;
    // Regex pattern: only letters and numbers allowed
    const pattern = /^[A-Za-z0-9]+$/;
    let errors = [];

    // Check if classification_name is missing or invalid
    if (!classification_name || !pattern.test(classification_name)) {
        errors.push('Classification name must not contain spaces or special characters.');
    }

    // If there are errors, flash them and re-render the form
    if (errors.length > 0) {
        req.flash('errors', errors);
        return res.render('inventory/add-classification', {
            title: 'Add Classification',
            flashMessage: null,
            errors
        });
    }

    // If validation passes, proceed to next middleware/controller
    next();
};