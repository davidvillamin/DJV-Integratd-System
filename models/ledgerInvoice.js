
var mongoose = require("mongoose");
var serviceLedgerSchema = new mongoose.Schema({
    ledger: String, // Service 
    code: String,
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
    },
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    date: Date,
    description: String,
});

module.exports = mongoose.model("serviceLedger", serviceLedgerSchema);

// sample data:
// Ledger      code     	transaction 	Quantity	UnitPrice	TotalPrice	Date	        Description
// Service     SERV123	    Onsite123	        5	        1500    7500	    2023-11-01	    CCTV Installation
// Service     SERV124	    Inhouse124	        1	        2500    2500	    2023-11-15	    Printer Repair