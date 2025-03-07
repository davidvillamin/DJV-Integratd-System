var mongoose = require("mongoose");

var imgVideoDbSchema = new mongoose.Schema({
    originalname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String
});

module.exports = mongoose.model("imgVideoDb", imgVideoDbSchema);