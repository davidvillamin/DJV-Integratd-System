var mongoose = require("mongoose");

var clientContTypeSchema = new mongoose.Schema({
    ClientContType: String
});

module.exports = mongoose.model("clientContType", clientContTypeSchema);