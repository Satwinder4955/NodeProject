function checkUserAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // Redirect to login page if not authenticated
        res.redirect("/login");
    }
}

module.exports = checkUserAuth;
