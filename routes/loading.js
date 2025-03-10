var express                             = require("express"),
    Client                              = require("../models/loading"),
    router                              = express.Router();



// ============================================================
// Client Index
// ============================================================
// initialize client page (index)
router.get("/loading", async function(req, res){
    res.render("loading/index")
});