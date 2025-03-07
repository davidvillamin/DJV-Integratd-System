var express                             = require("express"),
    PartInformation                     = require("../models/partinformation"),
    Parts                               = require("../models/part"),
    router                              = express.Router();

router.get("/parts", function(req, res){
    res.render("parts/index")
});

//parts information
router.post('/parts/partsinformation/create', async function(req, res){
    await PartInformation.create(req.body.data)
    var tabelData = await populateIndexTable()
    res.send(tabelData)
})

//universal get all parts information
router.post('/parts/index/populate/table', async function(req, res){
    var tableData = await populateIndexTable();
    res.send(tableData);
})

//view parts infromation
router.get('/parts/partsinformation/view/:id', function(req, res){
    res.render('parts/view')
})

//populate parts information view
router.post('/parts/partsinformation/view/populate',async function(req, res){
    var partInformation = await PartInformation.findById(req.body.data.id)
    .lean()
    // var partSerial = await Parts.find({partinformation:req.body.data.id})
    // populateViewTable(partSerial)
    // res.send({partInformation,partSerial})
    res.send(partInformation)
})

//view part serial list
router.post('/parts/view/populate/serial/table', async function(req, res){
    var tableData = await populateViewTable(req.body.data);
    res.send(tableData);
})

//save parts serial data
router.post('/parts/serial/create', async function(req, res){
    await Parts.insertMany(req.body.data.data)
    var tableData = await populateViewTable(req.body.data.id)
    res.send(tableData)
})

module.exports = router;

async function populateIndexTable(){
    var partList = [];
    var partInformationList = await PartInformation.find()
        .lean();
    // convert data to string
    partInformationList.forEach(function(part){
        partList.push([
            "<a>" + part.Brand + "</a>",
            "<a href='/parts/partsinformation/view/" + part._id + "'>" + part.Model + "</a>",
            part.Description,
        ]);
    });

    return partList;
}

async function populateViewTable(id){
    var partList = [];
    var partSerialList = await Parts.find({partinformation:id})
        .lean();
    // convert data to string
    partSerialList.forEach(function(part){
        partList.push([
            "<a>" + part.Serial + "</a>",
            // "<a href='/parts/partsinformation/view/" + part._id + "'>" + part.Model + "</a>",
            part.Description,
        ]);
    });

    return partList;
}

    