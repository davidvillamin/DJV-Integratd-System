var express                             = require("express"),
    Client                              = require("../models/client"),
    router                              = express.Router();


router.get("/transaction/sales", function(req, res){
    res.render("transaction/sales/index")
})

module.exports = router;