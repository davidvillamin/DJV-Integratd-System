var express                             = require("express"),
    router                              = express.Router(),
    passport                            = require("passport"),
    User                                = require("../models/users");

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

router.get("/", function(req, res){
    // Check if user is logged in, if not redirect to login
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    } else {
        res.render("index");
    }
    // redirect to /transaction
    // res.redirect("/");
});

router.get("/login", function(req, res){
    res.render("login");
});

// Handle login POST
router.post("/login", function(req, res, next) {
    console.log("Login attempt for user:", req.body.username);
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            console.log("Login error:", err);
            return next(err);
        }
        if (!user) {
            console.log("Login failed for user:", req.body.username, "Info:", info);
            req.flash("error", info.message || "Invalid username or password.");
            return res.redirect("/login");
        }
        req.logIn(user, function(err) {
            if (err) {
                console.log("Session error:", err);
                return next(err);
            }
            console.log("Login successful for user:", user.username);
            return res.redirect("/");
        });
    })(req, res, next);
});

// Handle logout
router.get("/logout", function(req, res){
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out!");
        res.redirect("/login");
    });
});

// Show current user info (for debugging)
router.get("/whoami", isLoggedIn, function(req, res){
    res.json({
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
        sessionID: req.sessionID
    });
});

module.exports = router;

    