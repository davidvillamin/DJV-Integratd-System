// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash("error", "You need admin privileges to access that page");
    res.redirect("/login");
}

module.exports = {
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin
};