var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("hbs");
var passport = require('passport');
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var productsRouter = require("./routes/products");

var dbConfig = require("./configs/database"); // Database configuration
var githubConfig = require("./configs/github"); // Github configuration

var session = require("express-session"); // Module for session handling
var User = require("./models/user"); // User model

var authorization = require("./extensions/authorization"); // Import Authorization module

var app = express();

// Setp views engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, '/views/partials'), {
    rename: function (name) {
        // all non-word characters replaced with underscores
        return name.replace(/\W/g, '_')
    }
})

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: 'project', resave: false, saveUninitialized: false })); // Session configuration

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

// Configure Serialization and Deserialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routing
app.use("/", indexRouter);
app.use("/products", productsRouter);

// Connect to the Databse
mongoose
.connect(dbConfig.MongoDB)
.then(() => console.log("Databse connected successfully!"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
