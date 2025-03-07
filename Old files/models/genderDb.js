var mongoose = require("mongoose");

var genderDbSchema = new mongoose.Schema({
    gender: String
});

module.exports = mongoose.model("genderDb", genderDbSchema);