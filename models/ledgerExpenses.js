
var mongoose = require("mongoose");
var expensesLedgerSchema = new mongoose.Schema({
    ledger: String, // Expenses 
    code: String,
    expenseName: String,
    category: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    date: Date,
    description: String,
    images: [{
        Title: String,
        Description: String,
        base64String: String
    }],
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction"
    }
});

module.exports = mongoose.model("expensesLedger", expensesLedgerSchema);

// sample data:
// Ledger       code    	ExpenseName	    Category	        Quantity	UnitPrice	TotalPrice	Date	        Description                     images
// Expenses     EXP123	    Lalamove	    Transportation	    1	        1500        1500	    2023-11-01	    Transaction for delivery        [images]
// Expenses     EXP124	    Drill Bit #6	OverHead	        1	        2500        2500	    2023-11-15	    CCTV Installation supplies      [images]
// Expenses     EXP125	    Office Rent   	Operational Costs	1	        20000       20000	    2023-11-30	    Monthly office rent payment     [images]