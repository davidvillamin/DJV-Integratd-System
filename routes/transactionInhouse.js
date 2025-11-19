var express                              = require("express"),
    mongoose                             = require("mongoose");
const { $where } = require("../models/product");
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
// add
router.post("/transaction/inhouse/product/add", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push product data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
        $push: {Product: {Product: req.body.data.productId}}
    });
    res.send("Product data saved successfully!");
});
// delete
router.delete("/transaction/inhouse/product/delete", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // pull product data from transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
        $pull: {Product: {_id: req.body.data.productId}}
    });
    res.send("Product data deleted successfully!");
});

// ==============================================================================
// Supply
// ==============================================================================
// add
router.post("/transaction/inhouse/supply/add", async function(req, res){
    // update supply srp and status to reserved
    await Supply.findByIdAndUpdate(req.body.data.supplyId, {
        SRP: req.body.data.data.SRP,
        Status: "Reserved",
        Transaction: new mongoose.Types.ObjectId(req.body.data.inhouseId)
    });
    // set supply data to transaction product
    await Transaction.updateOne(
        { 
            _id: req.body.data.inhouseId,
            "Product._id": req.body.data.productSupplyId
        },
        {
            $set: { "Product.$.Supply": new mongoose.Types.ObjectId(req.body.data.supplyId) }
        }
    );
    res.send("Supply data saved successfully!");
});

// ==============================================================================
// Expenses
// ==============================================================================
// add expense to transaction
router.post("/transaction/inhouse/expenses/add", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push expense data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
        $push: {Expense: req.body.data.data}
    });
    res.send("Expense data saved successfully!");
});

// update expense to transaction
router.put("/transaction/inhouse/expenses/update", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update expense data to transaction
    await Transaction.updateOne(
        { _id: req.body.data.inhouseId, "Expense._id": req.body.data.expensesId },
        { $set: { "Expense.$": req.body.data.data } }
    );
    res.send("Expense data updated successfully!");
});

//delete expense from transaction
router.delete("/transaction/inhouse/expenses/delete", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // pull expense data from transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
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
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
        $push: {ServiceCharge: req.body.data.data}
    });
    res.send("Service charge data saved successfully!");
});

// update service charge to transaction
router.put("/transaction/inhouse/servicecharge/update", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update service charge data to transaction
    await Transaction.updateOne(
        { _id: req.body.data.inhouseId, "ServiceCharge._id": req.body.data.serviceChargeId },
        { $set: { "ServiceCharge.$": req.body.data.data } }
    );
    res.send("Service charge data updated successfully!");
});

//delete service charge from transaction
router.delete("/transaction/inhouse/servicecharge/delete", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // pull service charge data from transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
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
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
        $push: {Payment: req.body.data.data}
    });
    res.send("Payment data saved successfully!");
});
// update payment to transaction
router.put("/transaction/inhouse/payments/update", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update payment data to transaction
    await Transaction.updateOne(
        { _id: req.body.data.inhouseId, "Payment._id": req.body.data.paymentId },
        { $set: { "Payment.$": req.body.data.data } }
    );
    res.send("Payment data updated successfully!");
});
//delete payment from transaction
router.delete("/transaction/inhouse/payments/delete", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // pull payment data from transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId,{
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
// ==============================================================================
// Notes
// ==============================================================================
// edit notes
router.post("/transaction/inhouse/notes/edit", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update notes data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        Notes: req.body.data.Notes
    });
    res.send("Device notes updated successfully!");
});

// ==============================================================================
// Pre-assessment Notes
// ==============================================================================
// edit pre-assessment notes
router.post("/transaction/inhouse/preassessment/edit", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update pre-assessment notes data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        PreAssessmentNotes: req.body.data.Notes
    });
    res.send("Device pre-assessment notes updated successfully!");
});

// ==============================================================================
// Service Report
// ==============================================================================
// update service report
router.put("/transaction/inhouse/serviceReport/update", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update service report data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        ServiceReport: req.body.data.serviceReportContent
    });
    res.send("Service report updated successfully!");
});

// ==============================================================================
// Quotation
// ==============================================================================
// save quotation image (this save function is used only to update quotation image. the actual quotation data is saved on quotation array)
router.post("/transaction/inhouse/quotation/save", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push quotation image data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        $push: { 
            Status: "Quotation"
        },
        $set: {
            "DocumentImages.Quotation": req.body.data.data,
            statQuotation: true, 
            statQuotationDate: new Date()
        }
    });
    res.send("Quotation image saved successfully!");
});

// ==============================================================================
// Approval
// ==============================================================================
// save approval image
router.post("/transaction/inhouse/approval/save", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push approval image data to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        $push: { 
            Status: "Approved"
        },
        $set: {
            "DocumentImages.Approval": req.body.data.data,
            statApproved: true,
            statApprovedDate: new Date()
        }
    });
    res.send("Approval image saved successfully!");
});

// ==============================================================================
// Repaired
// ==============================================================================
// change status to repaired
router.post("/transaction/inhouse/repaired/save", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update status to repaired
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        $push: { 
            Status: "Repaired"
        },
        $set: {
            statRepaired: true,
            statRepairedDate: new Date()
        }
    });
    res.send("Status changed to Repaired successfully!");
});

// ==============================================================================
// Released
// ==============================================================================
// save released information
router.post("/transaction/inhouse/released/save", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // push released information to transaction
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        $push: { 
            Status: "Released"
        },
        $set: {
            "ReleasedBy.Date": req.body.data.data.Date,
            "ReleasedBy.Personel": req.body.data.data.Personel,
            statReleased: true,
            statReleasedDate: new Date()
        }
    });
    res.send("Released information saved successfully!");
});

// ==============================================================================
// Complete
// ==============================================================================
// change status to complete
router.post("/transaction/inhouse/complete/save", auth.requireRoles('root', 'admin', 'tech'), async function(req, res){
    // update status to complete
    console.log(req.body.data.inhouseId);
    await Transaction.findByIdAndUpdate(req.body.data.inhouseId, {
        $push: { 
            Status: "Complete"
        },
        $set: {
            statComplete: true,
            statCompletedDate: new Date()
        }
    });
    res.send("Status changed to Complete successfully!");
});

module.exports = router;