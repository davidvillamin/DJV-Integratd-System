var mongoose = require("mongoose");
var partSchema = new mongoose.Schema({
    partinformation:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "partInformation"
    },
    Brand: String,
    Model: String,
    Description: String,
    Serial: String,
    SupplierPrice: Number,
    RetailPrice: Number,
    hasSerial: Boolean
    //supplier Detials 
});

module.exports = mongoose.model("part", partSchema);