var express                             = require("express"),
    PartInformation                     = require("../models/partinformation"),
    Parts                               = require("../models/part"),
    router                              = express.Router();

router.get("/device", function(req, res){
    res.render("device/index")
});


module.exports = router;




    