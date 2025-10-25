var express                             = require("express"),
    Product                             = require("../models/product"),
    Supply                              = require("../models/supply"),
    InventoryLedger                     = require("../models/ledgerInventory"),
    router                              = express.Router();
//====================================================================================================
// Index Route
//====================================================================================================

// inventory index
router.get("/inventory", async function(req, res){
    res.render("inventory/index");
});

//inventory product create
router.post('/inventory/product/create', async function(req, res){
    await Product.create(req.body.data)
    res.send("You have successfuly created a product!")
})

//index table population
router.post('/inventory/index/table', async function(req, res){
    var tableData = await populateIndexTable();
    res.send(tableData);
})

//====================================================================================================
// View Route
//====================================================================================================

//view parts information
router.get('/inventory/product/view/:id', function(req, res){
    res.render('inventory/view')
})

//populate parts information view
router.post('/inventory/product/view/populate',async function(req, res){
    var productInformation = await Product.findById(req.body.data.id)
    .populate('Supply')
    .lean()
    res.send(productInformation)
})

// add supply
router.post('/inventory/supply/addSupply', async function(req, res){
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
router.put('/inventory/supply/editSupply', async function(req, res){
    await Supply.findByIdAndUpdate(req.body.data.supplyId, req.body.data.data)
    res.send("Supply information updated successfully!")
});

// edit product information
router.put('/inventory/product/edit', async function(req, res){
    await Product.findByIdAndUpdate(req.body.data.productId, req.body.data.data)
    res.send("Product information updated successfully!")
})

// Product Notes edit
router.post('/inventory/product/notes/edit', async function(req, res){
    await Product.findByIdAndUpdate(req.body.data.ProductId, {
        Notes: req.body.data.Notes
    });
    res.send("Product notes updated successfully!")
});

// Product Image edit
router.post('/inventory/product/image/edit', async function(req, res){

    var newlyfoundProduct = await Product.findById(req.body.data.ProductId);
    // on the newlyfoundcreatedproduct.Images._id find the image and update else add new image
    var imageIndex = newlyfoundProduct.Images.findIndex(function(img) {
        console.log("Comparing: ", img._id.toString(), " with ", req.body.data.ImageId);
        return img._id.toString() === req.body.data.ImageId;
    });
    console.log("Found Image Index: ", imageIndex);
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
router.post('/inventory/product/image/delete', async function(req, res){
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

async function populateIndexTable(){
    // find all products
    var products = await Product.find({})
    .lean();
    // count all supplies base on product code to get quantity that is Available via for loop
    for (let i = 0; i < products.length; i++) {
        var supplyCount = await Supply.countDocuments({
            ProductCode: products[i].Code,
            Status: "Available"
        });
        products[i].quantity = supplyCount;
    }    
    var partList = []
    // convert data to string
    products.forEach(function(product){
        partList.push([
            "<a href='/inventory/product/view/" + product._id + "'>" + product.Code + "</a>",
            "<a href='/inventory/product/view/" + product._id + "'>" + product.Name + "</a>",
            product.Description,
            product.quantity
        ]);
    });
    return partList;
}