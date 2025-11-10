var express                             = require("express"),
    Transaction                         = require("../models/transaction"),
    router                              = express.Router(),
    mongoose                            = require("mongoose"),
    { isLoggedIn }                      = require("../middleware/auth");
    

router.get("/transaction", isLoggedIn, function(req, res){
    res.render("transaction/index")
})

// create transaction
router.post("/transaction/create", isLoggedIn, async function(req, res){
    await Transaction.create(req.body.data)
    res.send("Create Transaction");
});

// auto generate transaction code
router.post("/transaction/code/generate", isLoggedIn, async function(req, res){
    // count how many data is inside transation to create unique code
    var transactionCount = await Transaction.countDocuments();
    var generatedCode = "TRX" + String(transactionCount + 1).padStart(5, '0'); // simple unique code
    res.send(generatedCode);
})   


module.exports = router;

    