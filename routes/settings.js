var express                             = require("express"),
    PartInformation                     = require("../models/itemInformation"),
    Serial                               = require("../models/serial"),
    router                              = express.Router();

router.get("/settings", function(req, res){
    res.render("settings/index")
});


module.exports = router;




    