// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(`✅ User logged in: ${req.user.username} (${req.user.role})`);
        return next();
    }
    console.log("❌ User not logged in - redirecting to login");
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

// Middleware to check if user has required role(s)
function requireRoles(...allowedRoles) {
    return function(req, res, next) {
        if (!req.isAuthenticated()) {
            console.log("❌ User not logged in - redirecting to login");
            req.flash("error", "You need to be logged in to do that");
            return res.redirect("/login");
        }
        
        if (allowedRoles.includes(req.user.role)) {
            console.log(`✅ Access granted: ${req.user.username} (${req.user.role}) - Allowed roles: [${allowedRoles.join(', ')}]`);
            return next();
        }
        
        console.log(`❌ Access denied for: ${req.user.username} (${req.user.role}) - Required roles: [${allowedRoles.join(', ')}]`);
        req.flash("error", `You need ${allowedRoles.length > 1 ? 'one of these roles' : 'this role'}: ${allowedRoles.join(' or ')} to access that page`);
        res.redirect("/");
    };
}

// Convenience functions for common role combinations
const isAdmin = requireRoles('admin');
const isRoot = requireRoles('root');
const isRootOrAdmin = requireRoles('root', 'admin');
const isAnyRole = requireRoles('root', 'admin', 'technical'); // For routes accessible to all authenticated users with roles

// Middleware to log user info (for debugging)
function logUserInfo(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(`🔍 Current user: ${req.user.username} | Role: ${req.user.role} | ID: ${req.user._id}`);
    } else {
        console.log("🔍 No user logged in");
    }
    next();
}
var auth = {
    isLoggedIn: isLoggedIn,
    requireRoles: requireRoles,
    isAdmin: isAdmin,
    isRoot: isRoot,
    isRootOrAdmin: isRootOrAdmin,
    isAnyRole: isAnyRole,
    logUserInfo: logUserInfo
};
module.exports = auth;