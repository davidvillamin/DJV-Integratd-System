var mongoose = require("mongoose");

var addressDbSchema = new mongoose.Schema({
    tempFileIndex: Number,
    address: String,
    type: String
});

module.exports = mongoose.model("addressDb", addressDbSchema);