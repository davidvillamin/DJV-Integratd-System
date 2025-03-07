var mongoose = require("mongoose");

var clientDevicePartTypeSchema = new mongoose.Schema({
    partType: String //CPU, RAM, SSD, HDD ETC.
});

module.exports = mongoose.model("clientDevicePartType", clientDevicePartTypeSchema);