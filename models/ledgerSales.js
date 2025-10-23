
var mongoose = require("mongoose");
var salesLedgerSchema = new mongoose.Schema({
    ledger: String, // Sales
    code: String, // INVXXXX
    transaction: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
    },
    material: { // inventory item sold
        type: mongoose.Schema.Types.ObjectId,
        ref: "inventory",
    },
    expenses: { // linked expense entry for pass-through costs
        type: mongoose.Schema.Types.ObjectId,
        ref: "expensesLedger",
    },
    service: { // linked service entry for service costs
        type: mongoose.Schema.Types.ObjectId,
        ref: "serviceLedger",
    },
    total: Number,
    date: Date,
    description: String,
});

module.exports = mongoose.model("salesLedger", salesLedgerSchema);

// sample data:
// Ledger      ItemCode	    transaction     material    expenses	service	    Total	Date	        Description
// Sales       INV123	    INH156	        7500	    0	        2000	    9500	2023-11-01	    Desktop Computer Repair
// Sales       INV124	    PROJ845	        2500	    2500	    1200	    3700	2023-11-15	    CCTV Installation Project
