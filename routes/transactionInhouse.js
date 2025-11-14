var express                              = require("express"),
    mongoose                             = require("mongoose");
    moment                               = require("moment");
    Transaction                          = require("../models/transaction"),
    InventoryLedger                      = require("../models/ledgerInventory"),
    ExpensesLedger                       = require("../models/ledgerExpenses"),
    Supply                               = require("../models/supply"),
    Client                               = require("../models/client"),
    auth                                 = require("../middleware/auth"),
    router                               = express.Router();
//===============================================================================================================
// Routes
//===============================================================================================================
// index
router.get("/transaction/inhouse", auth.requireRoles('root', 'admin', 'tech'), function(req, res){
    res.render("transaction/Inhouse/index")
})

// view 
router.get("/transaction/inhouse/view/:id", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    res.render("transaction/Inhouse/view")
})

//===============================================================================================================
// Utilities
//===============================================================================================================
// get data

router.post('/transaction/inhouse/getData', auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    var transactionData = await Transaction.find({})
    .populate('Client')
    .populate('Device')
    .populate('Product.Product')
    .populate('Product.Supply')
    .lean();
    res.send(transactionData);
});

// product get one data
router.post('/transaction/inhouse/getOneData', auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    var transactionData = await Transaction.findById(req.body.data.inhouseId)
    .populate('Client')
    .populate('Device')
    .populate('Product.Product')
    .populate('Product.Supply')
    .lean();
    res.send(transactionData);
});

// ==============================================================================
// Product
// ==============================================================================
router.post("/transaction/inhouse/product/add", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push product data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.transactionId,{
        $push: {Product: {Product: req.body.data.productId}}
    });
    res.send("Product data saved successfully!");
});
// save supply data for sales report
// router.post("/transaction/inhouse/salesReport/supply", async function(req, res){
//     // save supply data to transaction
//     var foundTransaction  = await Transaction.findById(req.body.data.transactionId);

//     var tasks = req.body.data.supplyData.map(async function(supplyItem){ 
//         await Supply.findByIdAndUpdate(supplyItem.supplyId, {
//             SRP: Number(supplyItem.srp),
//             Status: "Reserved"
//         });

//         foundTransaction.Supplies.push(supplyItem.supplyId);

//         var ledgerCount = await InventoryLedger.countDocuments();

//         await InventoryLedger.create({
//             ledger: "Inventory",
//             code: "INV" + String(ledgerCount + 1).padStart(5, '0'),
//             supply: supplyItem.supplyId,
//             product: supplyItem.productId,
//             Transaction: req.body.data.transactionId,
//             SRP: Number(supplyItem.srp),
//             status: "Reserved",
//             description: "Supply reserved for Inhouse Transaction",
//             date: new Date(),
//             isTransaction: true,
//         });
//     });

//     await Promise.all(tasks);
//     await foundTransaction.save();

//     res.send("Supply data saved successfully!");
// })

// generate automatic expense code
// router.post("/transaction/inhouse/expenses/generateCode", async function(req, res){
//     var expenseCount = await ExpensesLedger.countDocuments();
//     var generatedCode = "EXP" + String(expenseCount + 1).padStart(5, '0');
//     res.send(generatedCode);
// });

// ==============================================================================
// Expenses
// ==============================================================================
// add expense to transaction
router.post("/transaction/inhouse/expenses/add", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push expense data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.tihId,{
        $push: {Expense: req.body.data.data}
    });
    res.send("Expense data saved successfully!");
});

// update expense to transaction
router.put("/transaction/inhouse/expenses/update", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update expense data to transaction
    await Transaction.updateOne(
        { _id: req.body.data.tihId, "Expense._id": req.body.data.expensesId },
        { $set: { "Expense.$": req.body.data.data } }
    );
    res.send("Expense data updated successfully!");
});

//delete expense from transaction
router.delete("/transaction/inhouse/expenses/delete", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // pull expense data from transaction
    await Transaction.findByIdAndUpdate(req.body.data.tihId,{
        $pull: {Expense: {_id: req.body.data.expensesId}}
    });
    res.send("Expense data deleted successfully!");
});
// ==============================================================================
// Service Charge
// ==============================================================================
// add service charge to transaction
router.post("/transaction/inhouse/servicecharge/add", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push service charge data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.transactionId,{
        $push: {ServiceCharge: req.body.data.data}
    });
    res.send("Service charge data saved successfully!");
});

// update service charge to transaction
router.put("/transaction/inhouse/servicecharge/update", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update service charge data to transaction
    await Transaction.updateOne(
        { _id: req.body.data.transactionId, "ServiceCharge._id": req.body.data.serviceChargeId },
        { $set: { "ServiceCharge.$": req.body.data.data } }
    );
    res.send("Service charge data updated successfully!");
});

//delete service charge from transaction
router.delete("/transaction/inhouse/servicecharge/delete", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // pull service charge data from transaction
    await Transaction.findByIdAndUpdate(req.body.data.transactionId,{
        $pull: {ServiceCharge: {_id: req.body.data.serviceChargeId}}
    });
    res.send("Service charge data deleted successfully!");
});
// ==============================================================================
// Payments
// ==============================================================================
// add payment to transaction
router.post("/transaction/inhouse/payments/add", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push payment data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.tihId,{
        $push: {Payment: req.body.data.data}
    });
    res.send("Payment data saved successfully!");
});
// update payment to transaction
router.put("/transaction/inhouse/payments/update", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update payment data to transaction
    await Transaction.updateOne(
        { _id: req.body.data.tihId, "Payment._id": req.body.data.paymentId },
        { $set: { "Payment.$": req.body.data.data } }
    );
    res.send("Payment data updated successfully!");
});
//delete payment from transaction
router.delete("/transaction/inhouse/payments/delete", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // pull payment data from transaction
    await Transaction.findByIdAndUpdate(req.body.data.tihId,{
        $pull: {Payment: {_id: req.body.data.paymentId}}
    });
    res.send("Payment data deleted successfully!");
});

// ==============================================================================
// Images
// ==============================================================================
// create and edit
router.post("/transaction/inhouse/image/edit", auth.requireRoles('root', 'admin'), async function(req, res){
    // find device by id, then find image by id inside device images array, then update image data
    var inhouseData = await Transaction.findById(req.body.data.inhouseId);
    // on the newlyfoundcreatedproduct.Images._id find the image and update else add new image
    var imageIndex = inhouseData.Images.findIndex(function(img) {
        return img._id.toString() === req.body.data.imageId;
    });
    if (imageIndex == -1){
        // add new image
        await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
            $push: { Images: req.body.data.data }
        });
    } else {
        // update existing image
        inhouseData.Images[imageIndex] = {
            Title: req.body.data.data.Title,
            Description: req.body.data.data.Description,
            base64String: req.body.data.data.base64String
        }   
        await inhouseData.save();
    }
    res.send("Product image updated successfully!")
});

// delete
router.post("/transaction/inhouse/image/delete", auth.requireRoles('root', 'admin'), async function(req, res){
    var foundInhouse = await Transaction.findById(req.body.data.inhouseId);
    var imageIndex = foundInhouse.Images.findIndex(function(image){
        return image._id.toString() === req.body.data.imageId;
    });
    foundInhouse.Images.splice(imageIndex, 1);
    await foundInhouse.save();
    res.send("Product image deleted successfully!")
});

module.exports = router;