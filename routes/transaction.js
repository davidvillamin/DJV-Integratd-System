var express                             = require("express"),
    Transaction                         = require("../models/transaction"),
    router                              = express.Router(),
    mongoose                            = require("mongoose");
    

router.get("/transaction", function(req, res){
    res.render("transaction/index")
})
//============================================================
// Billing
//============================================================
//billing - populate table



module.exports = router;

    