var express                             = require("express"),
    PartInformation                     = require("../models/partinformation"),
    Parts                               = require("../models/part"),
    router                              = express.Router();

router.get("/settings", function(req, res){
    res.render("settings/index")
});


module.exports = router;




    