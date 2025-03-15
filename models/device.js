var mongoose = require("mongoose");
var deviceSchema = new mongoose.Schema({
    deviceinformation:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "deviceInformation"
        },
    Brand: String,
    Model: String,
    Serial: String,
    Notes: String,
    
     
});

module.exports = mongoose.model("device", deviceSchema);