var express                             = require("express"),
    Client                              = require("../models/client"),
    router                              = express.Router();


router.get("/transaction/onsite", function(req, res){
    res.render("transaction/Onsite/index")
})

module.exports = router;