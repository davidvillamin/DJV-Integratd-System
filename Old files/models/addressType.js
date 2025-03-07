var mongoose = require("mongoose");

var addressTypeSchema = new mongoose.Schema({
    type: String
});

module.exports = mongoose.model("addressType", addressTypeSchema);