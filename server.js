/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const session = require("express-session");
const pool = require("./database/");
const path = require("path");
const engine = require("ejs-mate"); // ✅ Use ejs-mate for layout support
const env = require("dotenv").config();
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const expressMessages = require("express-messages");

const app = express();

const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoutes = require("./routes/accountRoute");
const utilities = require("./utilities");
const errorHandler = require("./middleware/errorHandler");

/* ***********************
 * Session Middleware
 *************************/
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}));

/* ***********************
 * Body Parser Middleware
 *************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ***********************
 * Flash Messages Middleware
 *************************/
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
// ✅ Use ejs-mate for layout support
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ***********************
 * Static Routes
 *************************/
app.use(static);

/* ***********************
 * Main Routes
 *************************/
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use("/account", accountRoutes);

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

/* ***********************
 * Server Startup
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});

/* ***********************
 * Custom Error Handler Middleware
 *************************/
app.use(errorHandler);
