var express                             = require("express"),
    router                              = express.Router(),

    // client
    ClientType                          =require('../models/clientType'),
    // Contact
    ContactType                         =require('../models/contactType'),
    //device
    DeviceType                          =require('../models/deviceType'),
    DeviceBrand                         =require('../models/deviceBrand'),
    DevicePartType                      =require('../models/devicePartType'),
    // material
    MatType                             =require('../models/matType'),
    MatBrand                            =require('../models/matBrand'),
    // Service
    ServiceType                         =require('../models/serviceType'),
    ServiceCategory                     =require('../models/serviceCategory');


// ============================================================
// Client Settings routes
// ============================================================
//get client settings page
router.get("/settings/client", function(req, res){
    res.render("settings/client")
});
// ============================================================
// CRUD Client Type
// ============================================================
//poplulate client type list
//get list of client list
router.get("/settings/clntType/list", function(req, res){
    ClientType.find().lean().exec(function(err,foundClientType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundClientType: foundClientType
            })
        }
    })
})

// add client type 
router.post("/settings/clntType/create", function(req, res){
    ClientType.create(req.body.data,function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New Client Type Added" })
        }
    })
})

//edit client type
router.post("/settings/clntType/edit", function(req, res){
    ClientType.findByIdAndUpdate(req.body.data.clntContType.id,req.body.data.clntContType.type,function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "Client contact type" })
        }
    })
})

//delete client type

// ============================================================
// CRUD Client Contact Type
// ============================================================
//poplulate client contact type list
router.get("/settings/clntContType/list", function(req, res){
    ContactType.find().lean().exec(function(err,foundClientContType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundClientContType: foundClientContType
            })
        }
    })
})
// add client contact type add
router.post("/settings/clntContType/create", function(req, res){
    ContactType.create(req.body.data,function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New Client Contact Type Added" })
        }
    })
})

// edit client contact type

// elete client contact type

// ============================================================
// CRUD Client Device Type
// ============================================================
//populate client device type
router.get("/settings/clntDevType/list", function(req, res){
    DeviceType.find().lean().exec(function(err,foundClientDeviceType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundClientDeviceType: foundClientDeviceType
            })
        }
    })
})

// add client device type
router.post("/settings/clntDevType/create", function(req, res){
    DeviceType.create(req.body.data,function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New Device Type Added" })
        }
    })
})

// edit client device type

// delete client device type

// ============================================================
// CRUD Client Device Brand
// ============================================================
//populate client device brand
router.get("/settings/clntDevBrand/list", function(req, res){
    DeviceBrand.find().lean().exec(function(err,foundClientDeviceBrand){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundClientDeviceBrand: foundClientDeviceBrand
            })
        }
    })
})
//add client device brand
router.post("/settings/clntDevBrand/create", function(req, res){
    DeviceBrand.create(req.body.data,function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New Device Brand Added" })
        }
    })
})

// edit client device brand

// delete client device brand

// ============================================================
// CRUD Client Device Part
// ============================================================
//populate client device part type list
router.get("/settings/clntDevPartType/list", function(req, res){
    DevicePartType.find().lean().exec(function(err,foundClientDevicePartType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundClientDevicePartType: foundClientDevicePartType
            })
        }
    })
})
//add client device part type create
router.post("/settings/clntDevPartType/create", function(req, res){
    DevicePartType.create(req.body.data,function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New Device Part type Added" })
        }
    })
})
// edit client device part

// delete client device part












// ============================================================
// Material
// ============================================================
//get material setting page
router.get("/settings/warehouse", function(req, res){
    res.render("settings/warehouse")
});

// ============================================================
// CRUD Material Material Type
// ============================================================
// poplulate materlial type list
router.get("/settings/matType/list", function(req, res){
    MatType.find().lean().exec(function(err,foundMatType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundMatType: foundMatType
            })
        }
    })
})
// add material type
router.post("/settings/matType/create", function(req, res){
    MatType.create(req.body.data, function(err){
        if (err) {
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New material Type Added" })
        }
    })
})

// edit material type

// delete material type

// ============================================================
// CRUD Material Material Brand
// ============================================================
// poplulate material brand
router.get("/settings/matBrand/list", function(req, res){
    MatBrand.find().lean().exec(function(err,foundMatBrand){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundMatBrand: foundMatBrand
            })
        }
    })
})
// add material brand 
router.post("/settings/matBrand/create", function(req, res){
    MatBrand.create(req.body.data, function(err){
        if (err) {
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New material brand Added" })
        }
    })
})
// edit material brand

// delete material brand











// ============================================================
// Services
// ============================================================
// get Service page
router.get("/settings/service", function(req, res){
    res.render("settings/service")
});
// ============================================================
// CRUD Service Type
// ============================================================
// poplulate
router.get("/settings/serviceType/list", function(req, res){
    ServiceType.find().lean().exec(function(err,foundServiceType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundServiceType: foundServiceType
            })
        }
    })
})
// create service type
router.post("/settings/serviceType/create", function(req, res){
    ServiceType.create(req.body.data, function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New Job Order type Added" })
        }
    })
});

// edit service type
// delete service type
// ============================================================
// CRUD Service Category
// ============================================================
// poplulate
router.get("/settings/serviceCat/list", function(req, res){
    ServiceCategory.find().lean().exec(function(err,foundServiceCat){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundServiceCat: foundServiceCat
            })
        }
    })
})
// create service category
router.post("/settings/serviceCat/create", function(req, res){
    ServiceCategory.create(req.body.data, function(err){
        if (err){
            console.log(err)
        } else {
            res.send({flash: 'success', message: "New service Category Added" })
        }
    })
});

// edit service category
// delete service category
module.exports = router;

    