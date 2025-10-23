
var mongoose = require("mongoose");
var inventoryLedgerSchema = new mongoose.Schema({
    ledger: String, // Inventory 
    code: String, //INVXXXX

    //IN
    product: { // reference to the product
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    supply: { // source
        type: mongoose.Schema.Types.ObjectId,
        ref: "supply",
    },

    //OUT
    isTransaction: Boolean, // true if OUT is due to transaction, false if due to expenses
    Transaction:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
    },
    Expenses: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenses",
    },

    unitPrice: Number,
    status: String, // IN / OUT
    date: Date,
    description: String,

    // USER LOGS?? 
});

module.exports = mongoose.model("inventoryLedger", inventoryLedgerSchema);

// every entry the quantity is always 1 for supply ledger
// if multiple quantities... create multiple entries

// sample data: 
// Ledger       code    	Supply   		UnitPrice	Date	        Description
// Inventory    INV123	    Oak Planks		10	   	    2023-11-01	    Purchased from Wood Co
// Inventory    INV124	    Oak Planks		10	   	    2023-11-15	    Sold to Customer A