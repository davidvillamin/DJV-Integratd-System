var express                             = require("express"),
    router                              = express.Router();

router.get("/settings", function(req, res){
    res.render("settings/index")
});

// router.get("/dashboard", function(req, res){
//     res.render("index")
// });

module.exports = router;




    