var express                             = require("express"),
    router                              = express.Router();

router.get("/settings", function(req, res){
    res.render("settings/index")
});


module.exports = router;




    