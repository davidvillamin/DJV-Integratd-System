var express                             = require("express"),
    Device                              = require("../models/device"),
    router                              = express.Router();

//====================================================================================================
// Index Route
//====================================================================================================

router.get("/device", function(req, res){
    res.render("device/index")
});
// index populate table (ajax)
router.post("/device/deviceinformation/table", async function(req, res){
    var foundDevice = await populateTable()
    res.send(foundDevice)
});
// successfully created new device
router.post("/device/create", async function(req, res){
    await Device.create(req.body.data)
    res.send("You have successfully created a new device!")
});

//====================================================================================================
// View Route
//====================================================================================================
router.get("/device/view/:id", function(req, res){
    res.render("device/view")
});

router.post("/device/deviceinformation/view/populate", async function(req, res){
    var foundViewDevice = await populateViewTable()
    res.send(foundViewDevice)
})

router.post("/device/deviceinformation/view/name",async function(req, res){
    var deviceInformation = await Device.findById(req.body.data.id)
    .lean()
    res.send(deviceInformation)
})

//====================================================================================================
// View Serial table
//====================================================================================================
// View serial number 
// router.post("/device/serial/view", async function(req, res){
//     await Device.create(req.body.data)
//     res.send("You have successfully created a new device!")
//     res.render("device/view")
// });

//====================================================================================================
// View Delete Table
//====================================================================================================
// router.post("/device/deviceinformation/delete", async function(req, res){
//     await Device.findByIdAndDelete(req.body.data.id);
//     res.send("You have successfully deleted the device!");
//     res.render("device/view")
// });


module.exports = router;

async function populateTable(){
    var dList = [];
    var deviceList = await Device.find()
        .select('Brand Model Serial _id') // specify the fields you want to retrieve
        .lean();
    // convert data to string
    deviceList.forEach(function(device){
        dList.push([
            "<a href='/device/view/" + device._id + "'>" + device.Serial + "</a>",
            device.Brand,
            device.Model
        ]);
    });

    return dList;
}

async function populateViewTable(){
    var dList = [];
    var deviceList = await Device.find()
        .select('Brand Model Serial _id') // specify the fields you want to retrieve
        .lean();
    // convert data to string
    deviceList.forEach(function(device){
        dList.push([
            device.Serial,
            device.Brand,
            device.Model,
            "<button class='btn btn-success dvEditDevice' type='button'><i class='bi bi-pencil-fill'></i></button> <button class='btn btn-danger  dvDeleteDevice' type='button'><i class='bi bi-trash'></i></button>"
            
        ]);
    });

    return dList;
}