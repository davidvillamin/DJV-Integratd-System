var mongoose = require("mongoose");
var partInformationSchema = new mongoose.Schema({
    Brand: String,
    Model: String,
    Description: String    
});

module.exports = mongoose.model("partInformation", partInformationSchema);