var express = require("express");
var router = express.Router();
// Import passport and user
var passport = require("passport");
require("../configs/github");
var User = require("../models/user");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "COMP 2068 JavaScript Frameworks", description: "This assignment requires you to create a new Node application using Express, MongoDB/Mongoose, and HBS views. Your site must be hosted live on a cloud service such as Render (Recommended), Azure, Heroku, AWS, or Digital Ocean.", user: req.user });
});

// GET /login
router.get("/login", function (req, res, next) {
    let messages = req.session.messages || [];
    req.session.messages = [];
    res.render("login", {
        title: "Login to application",
        messages: messages,
    });
});

// POST /login
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/products",
        failureRedirect: "/login",
        failureMessage: "Invalid Credentials",
    })
);

// GET /register
router.get("/register", function (req, res, next) {
    res.render("register", { title: "Register on application" });
});

// POST /register
router.post("/register", function (req, res, next) {
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        function (err, newUser) {
            // Callback function to handle the result
            if (err) {
                // If there is an error
                console.log(err);
                res.render("error", {
                    message: "Please enter valid information!",
                });
            } else {
                req.login(newUser, function (err) {
                    res.redirect("/products");
                });
            }
        }
    );
});

// GET /logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => { res.redirect("/login") });
});

// GET /github
router.get("/github", passport.authenticate("github", { scope: ["user:email"]}));

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }), // github middleware
    (req, res, next) => { // custom middleware to handle successful authentication
        res.redirect("/products");
    }
);

module.exports = router;
