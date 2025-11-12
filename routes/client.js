var express                             = require("express"),
    Client                              = require("../models/client"),
    router                              = express.Router(),
    auth                                = require("../middleware/auth");



// ============================================================
// Client Index
// ============================================================
// initialize client page (index)
router.get("/client", auth.requireRoles('root', 'admin'), async function(req, res){
    res.render("client/index")
});

// index populate table (ajax)
router.post("/client/index/table", auth.requireRoles('root', 'admin'), async function(req, res){
    var tableData = await populateTable()
    res.send(tableData)
});
// ============================================================
// Generic Populate Client with Devices
// ============================================================
router.post("/client/list", async function(req, res){
    var clientList = await Client.find()
        .populate('Devices')
        .lean();
    res.send(clientList)
})

// auto generate code number
router.get('/client/generateCodeNumber', auth.requireRoles('root', 'admin'), async function(req, res){
    // count how many data is inside Product to create unique code
    var clientCount = await Client.countDocuments();
    var generatedCode = "CLN" + String(clientCount + 1).padStart(5, '0'); // simple unique code
    res.send(generatedCode);
});

// auto generate verify code existing
router.post('/client/verifyCodeNumber', auth.requireRoles('root', 'admin'), async function(req, res){
    var existingClient = await Client.findOne({Code: req.body.data.codeNumber});
    if (existingClient){
        res.send(true); // code number exists
    } else {
        res.send(false); // code number does not exist
    }
});

// product get data
router.post('/client/getData', auth.requireRoles('root', 'admin'), async function(req, res){
    var clientData = await Client.find({})
    .populate('Devices')
    .lean();
    res.send(clientData);
});

// product get one data
router.post('/client/getOneData', auth.requireRoles('root', 'admin'), async function(req, res){
    var clientData = await Client.findById(req.body.data.clientId)
    .populate('Devices')
    .lean();
    res.send(clientData);
});


// ============================================================
// Client Create
// ============================================================

//create new client
router.post("/client/create", async function(req, res){
    await Client.create(req.body.data)
    res.send("You have successfuly created a new client!")
});


// ============================================================
// Client Edit
// ============================================================
router.post("/client/edit", async function(req, res){
    await Client.findByIdAndUpdate(req.body.data.clientId, req.body.data.data)
    res.send('You have successfuly updated the client information!')
});

// ============================================================
// Client Delete
// ============================================================

// ============================================================
// Client View
// ============================================================
router.get("/client/view/:clntId", function(req, res){
    res.render("client/view")
});

//get client info
router.post("/client/view/ajax", async function(req, res){
    var foundClient = await Client.findById(req.body.data.clientId)
    .populate('Devices')
    .lean();
    res.send(foundClient)
});

module.exports = router;

async function populateTable(){
    var cList = [];
    var clientList = await Client.find()
        .select('_id FullName Address.FullAddress BusinessName') // specify the fields you want to retrieve
        .lean();
    // convert data to string
    clientList.forEach(function(c){
        var clientType = ''
        if (c.BusinessName == '') {
            clientType = "<span class='badge bg-primary'>Individual</span>"
        } else {
            clientType = "<span class='badge bg-warning'>Business</span>"
        }

        cList.push([
            "<a href='/client/view/" + c._id + "'>" + c.FullName + "</a>",
            c.Address.FullAddress,
            clientType
        ]);
    });

    return cList;
}