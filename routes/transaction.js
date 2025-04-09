var express                             = require("express"),
    Transaction                         = require("../models/transaction"),
    router                              = express.Router(),
    mongoose                            = require("mongoose"),
    ItemInformation                     = require("../models/itemInformation"),
    Serial                              = require("../models/serial");
    

router.get("/transaction", function(req, res){
    res.render("transaction/index")
})
//============================================================
// Billing
//============================================================
//billing - populate table
router.post("/transaction/billing/populte/table", async function(req, res){
    var transaction = await Transaction.findById(req.body.data)
        .populate({
            path: "Billing.Parts",
            model: "serial"
        })
        .lean();
    console.log(transaction)
    res.send(partsTable)
})

// Billing - Parts
//populate list of parts information
router.post("/transaction/parts/add/partsInfromation/populate", async function(req, res){
    var itemData = await ItemInformation.find().lean()
    res.send(itemData)
})

// Billing - Parts
// populate list of serial base on selected parts information
router.post("/transaction/parts/add/partsInformation/serial/populate",async function(req, res){
    // update table list (get only Partinformation)
    // transfer only the id
    var partsList = await Serial.find({ "ItemInformation": new mongoose.Types.ObjectId(req.body.data) })
    .lean();
    res.send(partsList)
})

// Billing - Parts
//save serial to transaction
router.post("/transaction/parts/add", async function(req, res){
    var transaction = await Transaction.findById(
        req.body.data.transId,
    );
    console.log(transaction)
    transaction.Billing.Parts.push(req.body.data.Parts)
    await transaction.save()
    res.send("You have successfuly add parts!")
})

// billing - transporation add
router.post("/transaction/transportation/add", async function(req, res){
    var transaction = await Transaction.findById(req.body.data.transId)
    transaction.Billing.Transporation.push(req.body.data.transportation)
    await transaction.save()
    res.send('You have successfuly added a transportation!')
})

//billing - service charge save
router.post("/transaction/serviceCharge/add", async function(req, res){
    // update transaction data
    var transaction = await Transaction.findById(req.body.data.transId)
    transaction.Billing.ServiceCharge.push(req.body.data.ServiceCharge)
    await transaction.save()
    res.send('You have successfuly added a Service Charge!')
})

//billing - payment save
router.post("/transaction/payment/add", async function(req, res){
    // update transaction data
    var transaction = await Transaction.findById(req.body.data.transId)
    transaction.Billing.Payment.push(req.body.data.Payment)
    await transaction.save()
    res.send('You have successfuly added a Payment!')
})
module.exports = router;

    