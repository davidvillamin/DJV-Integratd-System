
var mongoose = require("mongoose");
var runningLedgerSchema = new mongoose.Schema({
    ledger: String, // running
    // code
    // RNGSUPXXXX - Running Supplies
    // RNGEXPXXXX - Running Expenses
    // RNGSRVXXXX - Running Services
    // RNGQUOTEXXXX - Running Quotations
    // RNGPOXXXX - Running Purchase Orders
    // RNGINVXXXX - Running Invoices
    // RNGPAYXXXX - Running Payments
    code: String, 

    // Supplies
    total: Number,
    date: Date,
    description: String,
});

module.exports = mongoose.model("runningLedger", runningLedgerSchema);

// sample data:
// Ledger      ItemCode	    transaction     material    expenses	service	    Total	Date	        Description
// Running     RNG123	    INH156	        7500	    0	        2000	    9500	2023-11-01	    Desktop Computer Repair
// Running     RNG124	    PROJ845	        2500	    2500	    1200	    3700	2023-11-15	    CCTV Installation Project
