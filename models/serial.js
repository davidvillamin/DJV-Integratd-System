var mongoose = require("mongoose");
var serialSchema = new mongoose.Schema({
    ItemInformation:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "itemInformation"
    },
    Brand: String,
    Model: String,
    Description: String,
    Serial: String,
    SupplierPrice: Number,
    RetailPrice: Number,
    isUsed: Boolean
});

module.exports = mongoose.model("serial", serialSchema);