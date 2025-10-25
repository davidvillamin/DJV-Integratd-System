var mongoose = require("mongoose");
var supplySchema = new mongoose.Schema({
    // Product Information
    ProductCode: String,
    Serial: String,
    Product:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },

    //Supplier Information
    Supplier: {
        Name: String,
        Address: String,
        OR: String,
        ORDate: Date,
        Warranty: String,
        Notes: String,
        // Image: String // for OR
    },

    // Accounting Information
    Cost: Number,

    // Transaction Information
    Status: String, // Available, Reserved, Sold
    DateAcquired: Date,
    DateReleased: Date,
    Transaction:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction"
    },
    Expenses:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenses"
    }
});

module.exports = mongoose.model("supply", supplySchema);