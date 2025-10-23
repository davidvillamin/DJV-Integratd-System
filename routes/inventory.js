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

module.exports = router;

async function populateIndexTable(){
    var products = await Product.find({})
    .lean();
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