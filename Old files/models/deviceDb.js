var mongoose = require("mongoose");

var deviceDbSchema = new mongoose.Schema({
    // lahat ng repair ng device thru job order
    jobOrder : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "serviceJobOrder"
        }
    ],

    type: String, //LAPTOP, PRINTER, DESKTOP COMPUTER ,ALL-IN-ONE COMPUTER, ETC.
    brand: String, // ASUS , LENOVO, DESKTOP COMPUTER 
    model: String,
    deviceName: String, // TYPE + BRAND + MODEL
    SN: String,
    otherDetails: String,

    // prefred na may pic din ungdevice para madalaing ma identify
    partSN: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "clientDevicePart"
        }
    ]
});

module.exports = mongoose.model("deviceDb", deviceDbSchema);