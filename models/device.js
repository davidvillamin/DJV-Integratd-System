var mongoose = require("mongoose");
var deviceSchema = new mongoose.Schema({
    
    Description: String,
    
     
});

module.exports = mongoose.model("device", deviceSchema);