var express                             = require("express"),
    Client                              = require("../models/client"),
    router                              = express.Router();


router.get("/transaction/project", function(req, res){
    res.render("transaction/Project/index")
})
module.exports = router;