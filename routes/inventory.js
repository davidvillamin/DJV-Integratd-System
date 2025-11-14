var express                             = require("express"),
    Product                             = require("../models/product"),
    Supply                              = require("../models/supply"),
    InventoryLedger                     = require("../models/ledgerInventory"),
    router                              = express.Router(),
    auth                                = require("../middleware/auth");
//====================================================================================================
// Routes
//====================================================================================================
// inventory product index
router.get("/inventory", auth.requireRoles('root', 'admin'), async function(req, res){
    res.render("inventory/index");
});

// inventory product view
router.get('/inventory/product/view/:id', auth.requireRoles('root', 'admin'), function(req, res){
    res.render('inventory/view')
})
//====================================================================================================
// Utilities
//====================================================================================================
// auto generate code number for Product
router.get('/inventory/product/generateCodeNumber', auth.requireRoles('root', 'admin'), async function(req, res){
    // count how many data is inside Product to create unique code
    var productCount = await Product.countDocuments();
    var generatedCode = "PRD" + String(productCount + 1).padStart(5, '0'); // simple unique code
    res.send(generatedCode);
});

// auto generate verify code existing for Product
router.post('/inventory/product/verifyCodeNumber', auth.requireRoles('root', 'admin'), async function(req, res){
    var existingProduct = await Product.findOne({Code: req.body.data.codeNumber});
    if (existingProduct){
        res.send(true); // code number exists
    } else {
        res.send(false); // code number does not exist
    }
});

// product get data
router.post('/inventory/product/getData', auth.requireRoles('root', 'admin'), async function(req, res){
    var productData = await Product.find({})
    .populate('Supply')
    .lean();
    res.send(productData);
});

// product get one data
router.post('/inventory/product/getOneData', auth.requireRoles('root', 'admin'), async function(req, res){
    var productData = await Product.findById(req.body.data.productId)
    .populate('Supply')
    .lean();
    res.send(productData);
});

// supply get data
router.post('/inventory/supply/getOneData', auth.requireRoles('root', 'admin'), async function(req, res){
    var supplyData = await Supply.findById(req.body.data.supplyId)
    .populate('Product')
    .lean();
    res.send(supplyData);
});
//====================================================================================================
// Product
//====================================================================================================

// create product
router.post('/inventory/product/create', auth.requireRoles('root', 'admin'), async function(req, res){
    await Product.create(req.body.data)
    res.send("You have successfuly created a product!")
});

// edit product
router.put('/inventory/product/edit', auth.requireRoles('root', 'admin'), async function(req, res){
    await Product.findByIdAndUpdate(req.body.data.productId, req.body.data.data)
    res.send("Product information updated successfully!")
})
//====================================================================================================
// Supply
//====================================================================================================
// add supply
router.post('/inventory/supply/addSupply', auth.requireRoles('root', 'admin'), async function(req, res){
    // count how many data is inside InventoryLedger to create unique code
    var ledgerCount = await InventoryLedger.countDocuments();

    var newlyCreatedSupply = await Supply.insertMany(req.body.data.data)
    newlyCreatedSupply.forEach(async function(supply){
        // ledger entry
        var ledgerData = {
            ledger: "Inventory",
            code: "INV" + String(ledgerCount + 1).padStart(5, '0'), // simple unique code
            product: req.body.data.id,
            supply: supply._id,
            status: "IN",
            date: new Date(),
            unitPrice: supply.Cost,
            description: "New supply added to inventory."
        }
        ledgerCount += 1; // increment for next code
        await InventoryLedger.create(ledgerData);
        //=============================================
        // Update product's supply information
        var foundProduct = await Product.findById(req.body.data.id)
        foundProduct.Supply.push(supply._id)
        await foundProduct.save()
    })
    res.send("New supply added successfully!")
});

// edit supply
router.put('/inventory/supply/editSupply', auth.requireRoles('root', 'admin'), async function(req, res){
    await Supply.findByIdAndUpdate(req.body.data.supplyId, req.body.data.data)
    res.send("Supply information updated successfully!")
});

//====================================================================================================
// Notes
//====================================================================================================
// Product Notes
router.post('/inventory/product/notes', auth.requireRoles('root', 'admin'), async function(req, res){
    await Product.findByIdAndUpdate(req.body.data.ProductId, {
        Notes: req.body.data.Notes
    });
    res.send("Product notes updated successfully!")
});

//====================================================================================================
// Images
//====================================================================================================
// edit and create product image
router.post('/inventory/product/image/edit', auth.requireRoles('root', 'admin'), async function(req, res){

    var newlyfoundProduct = await Product.findById(req.body.data.ProductId);
    // on the newlyfoundcreatedproduct.Images._id find the image and update else add new image
    var imageIndex = newlyfoundProduct.Images.findIndex(function(img) {
        return img._id.toString() === req.body.data.ImageId;
    });
    if (imageIndex == -1){
        // add new image
        await Product.findByIdAndUpdate(req.body.data.ProductId, {
            $push: { Images: req.body.data.data }
        });
    } else {
        // update existing image
        newlyfoundProduct.Images[imageIndex] = {
            Title: req.body.data.data.Title,
            Description: req.body.data.data.Description,
            base64String: req.body.data.data.base64String
        }   
        await newlyfoundProduct.save();
    }
    res.send("Product image updated successfully!")
});

// product image delete
router.post('/inventory/product/image/delete', auth.requireRoles('root', 'admin'), async function(req, res){
    var foundProduct = await Product.findById(req.body.data.ProductId);
    var imageIndex = foundProduct.Images.findIndex(function(image){
        console.log("Comparing: ", image._id.toString(), " with ", req.body.data.ImageId);
        return image._id.toString() === req.body.data.ImageId;
    });
    console.log("Image Index to delete: ", imageIndex);
    foundProduct.Images.splice(imageIndex, 1);
    await foundProduct.save();
    res.send("Product image deleted successfully!")
});
module.exports = router;