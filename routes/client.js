var express                             = require("express"),
    Client                              = require("../models/client"),
    router                              = express.Router(),
    auth                                = require("../middleware/auth");



// ============================================================
// Routes
// ============================================================
// initialize client page (index)
router.get("/client", auth.requireRoles('root', 'admin'), async function(req, res){
    res.render("client/index")
});
// view
router.get("/client/view/:clntId", function(req, res){
    res.render("client/view")
});
// ============================================================
// Utilities
// ============================================================
// auto generate code number
router.get('/client/generateCodeNumber', auth.requireRoles('root', 'admin'), async function(req, res){
    // count how many data is inside Product to create unique code
    var clientCount = await Client.countDocuments();
    var generatedCode = "CLT" + String(clientCount + 1).padStart(5, '0'); // simple unique code
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
router.post('/client/getData', auth.requireRoles('root', 'admin','tech'), async function(req, res){
    var clientData = await Client.find({})
    .populate('Devices')
    .lean();
    res.send(clientData);
});

// product get one data
router.post('/client/getOneData', auth.requireRoles('root', 'admin','tech'), async function(req, res){
    var clientData = await Client.findById(req.body.data.clientId)
    .populate('Devices')
    .lean();
    res.send(clientData);
});


// ============================================================
// Client
// ============================================================

//create new client
router.post("/client/create", async function(req, res){
    await Client.create(req.body.data)
    res.send("You have successfuly created a new client!")
});
// edit client
router.post("/client/edit", async function(req, res){
    await Client.findByIdAndUpdate(req.body.data.clientId, req.body.data.data)
    res.send('You have successfuly updated the client information!')
});

// ============================================================
// Notes
// ============================================================
router.post("/client/notes", async function(req, res){
    await Client.findByIdAndUpdate(req.body.data.clientId, {Notes: req.body.data.Notes})
    res.send('You have successfuly updated the client notes!')
});

// ============================================================
// Images
// ============================================================
// edit / create image
router.post("/client/image/edit", async function(req, res){
    // find device by id, then find image by id inside device images array, then update image data
    var clientData = await Client.findById(req.body.data.clientId);
    // on the newlyfoundcreatedproduct.Images._id find the image and update else add new image
    var imageIndex = clientData.Images.findIndex(function(img) {
        return img._id.toString() === req.body.data.imageId;
    });
    if (imageIndex == -1){
        // add new image
        await Client.findByIdAndUpdate(req.body.data.clientId, {
            $push: { Images: req.body.data.data }
        });
    } else {
        // update existing image
        clientData.Images[imageIndex] = {
            Title: req.body.data.data.Title,
            Description: req.body.data.data.Description,
            base64String: req.body.data.data.base64String
        }   
        await clientData.save();
    }
    res.send("Product image updated successfully!")
});

// delete image
router.post("/client/image/delete", async function(req, res){
    var foundClient = await Client.findById(req.body.data.clientId);
    var imageIndex = foundClient.Images.findIndex(function(image){
        return image._id.toString() === req.body.data.imageId;
    });
    foundClient.Images.splice(imageIndex, 1);
    await foundClient.save();
    res.send("Product image deleted successfully!")
});

module.exports = router;