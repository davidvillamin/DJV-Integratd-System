var mongoose = require("mongoose");

var clientDevicePartSchema = new mongoose.Schema({
    type: String, 
    SN: String
});

module.exports = mongoose.model("clientDevicePart", clientDevicePartSchema);