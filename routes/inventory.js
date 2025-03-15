var express                             = require("express"),
    ItemInformation                     = require("../models/itemInformation"),
    Serial                              = require("../models/serial"),
    router                              = express.Router();
//====================================================================================================
// Index Route
//====================================================================================================

// inventory index
router.get("/inventory", async function(req, res){
    res.render("inventory/index");
});

//inventory information create
router.post('/inventory/iteminformation/create', async function(req, res){
    console.log(req.body.data)
    await ItemInformation.create(req.body.data)
    res.send("You have successfuly created a item information!")
})

//index table population
router.post('/inventory/index/populate/table', async function(req, res){
    var tableData = await populateIndexTable();
    res.send(tableData);
})

//====================================================================================================
// View Route
//====================================================================================================

//view parts information
router.get('/inventory/iteminformation/view/:id', function(req, res){
    res.render('inventory/view')
})

//populate parts information view
router.post('/inventory/iteminformation/view/populate',async function(req, res){
    var itemInformation = await ItemInformation.findById(req.body.data.id)
    .lean()
    res.send(itemInformation)
})

//====================================================================================================
// Serial Route
//====================================================================================================

//view part serial list
router.post('/inventory/view/populate/serial/table', async function(req, res){
    var tableData = await populateViewSerialTable(req.body.data);
    res.send(tableData);
})

//save parts serial data
router.post('/inventory/serial/create', async function(req, res){
    await Serial.insertMany(req.body.data.data)
    var tableData = await populateViewSerialTable(req.body.data.id)
    res.send(tableData)
})

module.exports = router;

async function populateIndexTable(){
    var partList = [];
    var itemInformationList = await ItemInformation.find()
        .lean();
    // convert data to string
    itemInformationList.forEach(function(item){
        partList.push([
            "<a>" + item.Brand + "</a>",
            "<a href='/inventory/iteminformation/view/" + item._id + "'>" + item.Model + "</a>",
            item.Description,
        ]);
    });

    return partList;
}

async function populateViewSerialTable(id){
    var serialList = [];
    var itemSerialList = await Serial.find({ItemInformation:id})
        .lean();
    // convert data to string
    itemSerialList.forEach(function(item){
        serialList.push([
            "<a>" + item.Serial + "</a>",
            // "<a href='/inventory/partsinformation/view/" + part._id + "'>" + part.Model + "</a>",
            item.Description,
        ]);
    });

    return serialList;
}

    