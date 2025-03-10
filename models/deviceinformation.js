var mongoose = require("mongoose");
var deviceInformationSchema = new mongoose.Schema({
    Brand: String,
    Model: String,
    Description: String    
});

module.exports = mongoose.model("deviceInformation", deviceInformationSchema);