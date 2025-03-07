var express                             = require("express"),
    router                              = express.Router();

router.get("/supplier", function(req, res){
    res.render("supplier/index")
})
module.exports = router;

    