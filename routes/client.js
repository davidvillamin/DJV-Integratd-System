var express                             = require("express"),
    Client                              = require("../models/client"),
    router                              = express.Router();



// ============================================================
// Client Index
// ============================================================
// initialize client page (index)
router.get("/client", async function(req, res){
    res.render("client/index")
});

// index populate table (ajax)
router.post("/client/index/table", async function(req, res){
    var tableData = await populateTable()
    res.send(tableData)
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
    await Client.findByIdAndUpdate(req.body.data.id, req.body.data.data)
    res.send('success')
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
    var foundClient = await Client.findById(req.body.data.id)
    res.send(foundClient)
});

module.exports = router;

async function populateTable(){
    var cList = [];
    var clientList = await Client.find()
        .select('_id Name Address isIndividual') // specify the fields you want to retrieve
        .lean();
    // convert data to string
    clientList.forEach(function(c){
        var clientType = c.isIndividual ? "<span class='badge bg-primary'>Individual</span>" : "<span class='badge bg-warning'>Corporate</span>";

        cList.push([
            "<a href='/client/view/" + c._id + "'>" + c.Name + "</a>",
            c.Address,
            clientType
        ]);
    });

    return cList;
}