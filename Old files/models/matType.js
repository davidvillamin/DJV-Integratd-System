var mongoose = require("mongoose");

var matTypeSchema = new mongoose.Schema({
    type: String,
    isSerialized: Boolean
});

module.exports = mongoose.model("matType", matTypeSchema);