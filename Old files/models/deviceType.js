var mongoose = require("mongoose");

var clientDeviceTypeSchema = new mongoose.Schema({
    deviceType: String //LAPTOP, PRINTER, DESKTOP COMPUTER ,ALL-IN-ONE COMPUTER, ETC.
});

module.exports = mongoose.model("clientDeviceType", clientDeviceTypeSchema);