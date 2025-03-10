var express                             = require("express"),
    deviceInformation                   = require("../models/deviceinformation"),
    device                              = require("../models/device"),
    router                              = express.Router();

router.get("/device", function(req, res){
    res.render("device/index")
});


module.exports = router;




    