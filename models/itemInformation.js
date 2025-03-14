var mongoose = require("mongoose");
var itemInformationSchema = new mongoose.Schema({
    Brand: String,
    Model: String,
    Description: String    
});

module.exports = mongoose.model("itemInformation", itemInformationSchema);