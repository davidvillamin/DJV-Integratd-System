var mongoose = require("mongoose");

var clientDeviceBrandSchema = new mongoose.Schema({
    deviceBrand: String // ASUS , LENOVO, DESKTOP COMPUTER 
});

module.exports = mongoose.model("clientDeviceBrand", clientDeviceBrandSchema);