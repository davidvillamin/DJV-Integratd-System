var mongoose = require("mongoose");

var contactDbSchema = new mongoose.Schema({
    tempFileIndex: Number,
    contact: String,
    type: String
});

module.exports = mongoose.model("contactDb", contactDbSchema);