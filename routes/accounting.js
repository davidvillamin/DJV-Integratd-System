var express                             = require("express"),
    accounting                          = require("../models/accounting"),
    router                              = express.Router();



// ============================================================
// Client Index
// ============================================================
// initialize client page (index)
router.get("/accounting", async function(req, res){
    res.render("accounting/index")
});

module.exports = router;



