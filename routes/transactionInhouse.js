var express                             = require("express"),
    mongoose                            = require("mongoose");
    moment                              = require("moment");
    Transaction                         = require("../models/transaction"),
    Client                              = require("../models/client"),
    router                              = express.Router();
//===============================================================================================================
// CRUD Transaction Inhouse 
//===============================================================================================================
// edit inhouse transaction (Initialize data)
router.post("/transaction/inhouse/edit",async function(req, res){
    var transaction = await Transaction.findById(req.body.data.tihId)
    .populate({
        path: "Client",
        select: "_id Name"
    })
    .select("_id JobOrder RecieveDate RecievedBy Device SerialNumber Notes Client")
    .lean()
    res.send(transaction)
})
// edit inhouse transaction
router.put("/transaction/inhouse/edit",async function(req, res){
    //convet string to date
    req.body.data.data.RecieveDate = new Date(req.body.data.data.RecieveDate)
    var transaction = await Transaction.findByIdAndUpdate(req.body.data.tihId,req.body.data.data)
    var newClient = await Client.findById(req.body.data.clientId) // for new client
    var oldClient = await Client.findById(req.body.data.clientOldId) // for old client
    oldClient.Transaction.pull(req.body.data.tihId) // remove the old transaction id on old client
    await oldClient.save() // save the edited client

    newClient.Transaction.push(transaction._id) // insert new transaction id
    await newClient.save() //save the new transaction id
    res.send('You have successfuly edited a transaction!')
})

// delete inhouse transaction
router.delete("/transaction/inhouse/delete",async function(req, res){
    console.log(req.body.data)
    // find first the client and remove the transaction id in transaction
    var client = await Client.findById(req.body.data.clientId)
    client.Transaction.pull(req.body.data.tihId)
    await client.save()
    await Transaction.findByIdAndDelete(req.body.data.tihId)
    res.send('You have successfuly deleted a transaction!')
})
//===============================================================================================================
// index
//===============================================================================================================
// get index
router.get("/transaction/inhouse", function(req, res){
    res.render("transaction/Inhouse/index")
})

// get client list for add transaction
router.post("/transaction/inhouse/create/clientList", async function(req, res){
    var clientList = await Client.find()
        .select('_id Name')
        .lean()
    res.send(clientList)
})

// create inhouse transaction
router.post("/transaction/inhouse/create",async function(req, res){
  // Convert the string date to a Date object
  req.body.data.RecieveDate = new Date(req.body.data.RecieveDate);
  var newlyCreatedTransaction = await Transaction.create(req.body.data.data);
  var foundClient = await Client.findById(req.body.data.clientId);
  foundClient.Transaction.push(newlyCreatedTransaction._id);
  // Save the updated client information
  await foundClient.save();
  res.send("You have successfuly created a new transaction!" );
})

// initialize table in index 
router.post("/transaction/inhouse/index/poplate/table", async function(req, res){
    var tihList = await Transaction.find()
    .populate({ path: 'Client', select: 'Name' }) // only retrieve the name field from Client
    .populate({ path: 'Client', select: 'Name' }) // only retrieve the name field from Client
    .select('_id JobOrder Client Device Tags Billing') // specify the fields you want to retrieve
    .lean();
    res.send(tihList)
})

//===============================================================================================================
// view
//===============================================================================================================


// view inhouse transaction
router.get("/transaction/inhouse/view/:id", function(req, res){
    res.render("transaction/inhouse/view")
})
// get all inhouse transaction
router.post("/transaction/inhouse/view/populate/transaction",async function(req, res){
    var transaction = await Transaction.findById(req.body.data.tihId)
        .populate('Client')
        .populate({
            path: "Billing.Parts",
            model: "serial"
        })
        .lean()
    res.send(transaction)
})

//===============================================================================================================
// Dropdown
//===============================================================================================================
// add image
router.post("/transaction/inhouse/edit/image/add",async function(req, res){
    // find transaction
    var transaction = await Transaction.findById(req.body.data.id)
    // add image to transaction
    transaction.Images.push(req.body.data.data)
    await transaction.save()
    res.send('You have successfuly added an image!')
})



// initial print report
router.get("/transaction/inhouse/view/print/serviceReport/:id", async function(req, res){
    res.render("transaction/inhouse/modal/dropDown/reports/serviceReport")
})

// initial print report of  transaction data
router.post("/transaction/report/serviceReport", async function (req, res) {
    var initialPrint = await Transaction.findById(req.body.data.id)
    .populate('Client')
    .populate({
        path: "Billing.Parts",
        model: "serial"
    })
    .lean()
    res.send(initialPrint)
})

// part 
// release
router.post("/transaction/inhouse/view/release/update", async function(req, res){
    await Transaction.findByIdAndUpdate(req.body.data.id, { Release: req.body.data.data });
    res.send("You have successfuly release date!")
})

//tags

router.post("/transaction/inhouse/view/tags/update", async function(req, res){
    req.body.data.tagsTempList = req.body.data.tagsTempList || [];
    req.body.data.tagsFixedList = req.body.data.tagsFixedList || [];
    await Transaction.findByIdAndUpdate(req.body.data.id, {
        TempStatus: req.body.data.tagsTempList,
        FixedStatus: req.body.data.tagsFixedList
    })
    res.send("You have successfuly upated the tags!")
})

//===============================================================================================================
// Accordion
//===============================================================================================================




// notes
router.put("/transaction/inhouse/view/notes", async function(req, res){
    await Transaction.findByIdAndUpdate(req.body.data.id, { Notes: req.body.data.notes });
    res.send("You have successfuly updated notes!")
})

// images edit
router.post("/transaction/inhouse/edit/image/edit",async function(req, res){
    // console.log(req.body.data)

    // find transaction
    var transaction = await Transaction.findById(req.body.data.id)
    // add image to transaction
    // Find the index of the image to be removed
    var imageIndex = transaction.Images.findIndex(function(image){
        image._id.toString() === req.body.data.data._id
    })
    console.log(imageIndex)
    // Remove the image if it exists
    if (imageIndex !== -1) {
        transaction.Images.splice(imageIndex, 1);
        // await transaction.save();
        res.send('You have successfully removed the image!');
    } else {
        res.status(404).send('Image not found!');
    }
    // transaction.Images.push(req.body.data.data)
    // await transaction.save()
    // res.send('You have successfuly added an image!')
})

module.exports = router;