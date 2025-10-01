function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render("errors/error", {
        title: "Server Error",
        message: err.message
    });
}

module.exports = errorHandler;