var express                             = require("express"),
    mongoose                            = require("mongoose");
    Transaction                         = require("../models/transaction"),
    PartsInformation                    = require("../models/partinformation"),
    Parts                               = require("../models/part")
    Client                              = require("../models/client"),
    router                              = express.Router();


// get index
router.get("/transaction/inhouse", function(req, res){
    res.render("transaction/Inhouse/index")
})

// create inhouse transaction
router.post("/transaction/inhouse/create/ajax",async function(req, res){
  // Convert the string date to a Date object
  req.body.data.RecieveDate = new Date(req.body.data.RecieveDate);
  // Create a new transaction with the data from the request body
  var newlyCreatedTransaction = await Transaction.create(req.body.data);
  // Find the client by ID from the request body
  var foundClient = await Client.findById(req.body.data.Client);
  // Add the newly created transaction to the client's transactions
  foundClient.Transaction.push(newlyCreatedTransaction);
  // Save the updated client information
  await foundClient.save();

  // Populate the table with the updated data
  var tableData = await populateTable();
  // Send the populated table data as the response
  res.send(tableData);
})

//update
router.post("/transaction/inhouse/edit",async function(req, res){
    //convet string to date
    req.body.data.data.RecieveDate = new Date(req.body.data.data.RecieveDate)
    await Transaction.findByIdAndUpdate(req.body.data.id,req.body.data.data)
    // populate transaction
    // var transaction = await Transaction.findById(req.body.data.id)
    //     .populate('Client')
    //     .lean()
    res.send('You have successfuly edited a transaction!')
})

// add image
router.post("/transaction/inhouse/edit/image/add",async function(req, res){
    // find transaction
    var transaction = await Transaction.findById(req.body.data.id)
    // add image to transaction
    transaction.Images.push(req.body.data.data)
    await transaction.save()
    res.send('You have successfuly added an image!')
})

// get client list for add transaction
router.post("/transaction/inhouse/create/clientList", async function(req, res){
    var clientList = await Client.find()
        .select('_id Name')
        .lean()
    var tempStr = String
    clientList.forEach(function(d){
        tempStr += "<option value='" + d._id + "'>" + d.Name + "</option>"
    })
    res.send(tempStr)
})

// view inhouse transaction
router.get("/transaction/inhouse/view/:id", function(req, res){
    res.render("transaction/inhouse/view")
})

// get all inhouse transaction
router.post("/transaction/inhouse/view/populate/transaction",async function(req, res){
    var transaction = await Transaction.findById(req.body.data.id)
        .populate('Client')
        .lean()
    res.send(transaction)
})
// get all inhouse view parts request list
router.post("/transaction/inhouse/view/populate/partInformation",async function(req, res){
    // update table list (get only Partinformation)
    var partsList = await Transaction.findById(req.body.data)
    .populate("PartInformation")
    .select("PartInformation")
    var partsTable = await populateTableParts(partsList)
    res.send(partsTable)
})

//universal get all client
router.post("/transaction/inhouse/index/poplate/table", async function(req, res){
    var tableData = await populateTable();
    res.send(tableData);
})

// Print
router.get("/transaction/inhouse/view/:id/print", function(req, res){
    res.render("transaction/inhouse/printReport/initial")
})

//populate list of parts information
router.post("/transaction/inhouse/view/:id/parts/add/partsInfromation/populate", async function(req, res){
    var partListStr = ''
    var partsList = await PartsInformation.find()
    .select('_id Description')
    partsList.forEach(function(part){
        partListStr += "<option value='" + part._id + "'>" + part.Description + "</option>"
    })
    res.send(partListStr)
})

//save parts information to transaction
router.post("/transaction/inhouse/view/:id/parts/add/partsInfromation/add", async function(req, res){
    // update transaction data
    var transaction = await Transaction.findById(req.body.data.id)
    transaction.PartInformation.push(req.body.data.PartInformation)
    await transaction.save()

    // update table list (get only Partinformation)
    var partsList = await Transaction.findById(req.body.data.id)
    .populate("PartInformation")
    .select("PartInformation")
    var partsTable = await populateTableParts(partsList)
    res.send(partsTable)
})


module.exports = router;

async function populateTable(){
    var tihList = [];
    var transactioninhouseList = await Transaction.find()
        .populate({ path: 'Client', select: 'Name' }) // only retrieve the name field from Client
        .select('_id JobOrder Client Device') // specify the fields you want to retrieve
        .lean();
    // convert data to string
    transactioninhouseList.forEach(function(tih){
        tihList.push([
            "<a href='/transaction/inhouse/view/" + tih._id + "'>" + tih.JobOrder + "</a>",
            "<a href='/client/view/" + tih.Client._id + "'>" + tih.Client.Name + "</a>",
            tih.Device,
            "Php. 1,000.00",
            "Status"
        ]);
    });

    return tihList;
}

async function populateTableParts(partsList){
    var mPartList = []
    
    partsList.PartInformation.forEach(function(part) {
        mPartList.push({
            id: part._id,
            Description: part.Description,
            Action: "<div class='d-flex justify-content-center'>\
                <a class='btn btn-success mx-1'>\
                    <i class='bi bi-plus-square'></i>\
                </a>\
                <a class='btn btn-danger mx-1'>\
                    <i class='bi bi-trash'></i>\
                </a>\
            </div>"
        });
    });
    return mPartList
}