var express                             = require("express"),
    Device                              = require("../models/device"),
    Client                              = require("../models/client"),
    router                              = express.Router(),
    auth                                = require("../middleware/auth");

//====================================================================================================
// Index Route
//====================================================================================================

router.get("/device", auth.requireRoles('root', 'admin'), function(req, res){
    res.render("device/index")
});

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

// successfully created new device
router.post("/device/create", async function(req, res){
    var newlyCreatedDevice = await Device.create(req.body.data)
    Client.findById(req.body.data.Client).then(async function(client){
        client.Devices.push(newlyCreatedDevice._id);
        await client.save();
    })
    res.send("You have successfully created a new device!")
});

//====================================================================================================
// View Route
//====================================================================================================
router.get("/device/view/:id", function(req, res){
    res.render("device/view")
});

router.post("/device/view/populate", async function(req, res){
    var foundDevice = await Device.findById(req.body.data.id)
    .populate('Client')
    .lean()
    res.send(foundDevice)
})

// router.post("/device/deviceinformation/view/name",async function(req, res){
//     var deviceInformation = await Device.findById(req.body.data.id)
//     .lean()
//     res.send(deviceInformation)
// })

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

// async function populateTable(){
//     var dList = [];
//     var deviceList = await Device.find()
//         .populate('Client') // populate Client field with Name
//         .select('Client Name Type') // specify the fields you want to retrieve
//         .lean();
//     // convert data to string
//     deviceList.forEach(function(device){
//         dList.push([
//             "<a href='/device/view/" + device._id + "'>" + device.Name + "</a>",
//             device.Client.FullName,
//             device.Type
//         ]);
//     });

//     return dList;
// }

// async function populateViewTable(){
//     var dList = [];
//     var deviceList = await Device.find()
//         .select('Brand Model Serial _id') // specify the fields you want to retrieve
//         .lean();
//     // convert data to string
//     deviceList.forEach(function(device){
//         dList.push([
//             device.Serial,
//             device.Brand,
//             device.Model,
//             "<button class='btn btn-success dvEditDevice' type='button'><i class='bi bi-pencil-fill'></i></button> <button class='btn btn-danger  dvDeleteDevice' type='button'><i class='bi bi-trash'></i></button>"
            
//         ]);
//     });

//     return dList;
// }