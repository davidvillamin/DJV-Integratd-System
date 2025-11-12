var express                             = require("express"),
    Device                              = require("../models/device"),
    Client                              = require("../models/client"),
    router                              = express.Router(),
    auth                                = require("../middleware/auth");

//====================================================================================================
// Routes
//====================================================================================================
// index
router.get("/device", auth.requireRoles('root', 'admin'), function(req, res){
    res.render("device/index")
});
// view
router.get("/device/view/:id", function(req, res){
    res.render("device/view")
});
//====================================================================================================
// Utilities
//====================================================================================================
// auto generate code number
router.get('/device/generateCodeNumber', auth.requireRoles('root', 'admin'), async function(req, res){
    // count how many data is inside Product to create unique code
    var deviceCount = await Device.countDocuments();
    var generatedCode = "DEV" + String(deviceCount + 1).padStart(5, '0'); // simple unique code
    res.send(generatedCode);
});

// auto generate verify code existing
router.post('/device/verifyCodeNumber', auth.requireRoles('root', 'admin'), async function(req, res){
    var existingDevice = await Device.findOne({Code: req.body.data.codeNumber});
    if (existingDevice){
        res.send(true); // code number exists
    } else {
        res.send(false); // code number does not exist
    }
});

// product get data
router.post('/device/getData', auth.requireRoles('root', 'admin'), async function(req, res){
    var deviceData = await Device.find({})
    .populate('Client')
    .lean();
    res.send(deviceData);
});

// product get one data
router.post('/device/getOneData', auth.requireRoles('root', 'admin'), async function(req, res){
    var deviceData = await Device.findById(req.body.data.deviceId)
    .populate('Client')
    .lean();
    res.send(deviceData);
});

//====================================================================================================
// device
//====================================================================================================
// successfully created new device
router.post("/device/create", async function(req, res){
    var newlyCreatedDevice = await Device.create(req.body.data)
    Client.findById(req.body.data.Client).then(async function(client){
        client.Devices.push(newlyCreatedDevice._id);
        await client.save();
    })
    res.send("You have successfully created a new device!")
});
// successfully created new device
router.post("/device/edit", async function(req, res){
    console.log(req.body.data);
   await Device.findByIdAndUpdate(req.body.data.deviceId, req.body.data.data);
   res.send("You have successfully edited the device!")
});

module.exports = router;