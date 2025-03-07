var express                             = require("express"),
    transaction                         = require("../models/transaction"),
    router                              = express.Router();

router.get("/transaction", function(req, res){
    res.render("transaction/index")
})

module.exports = router;

    