var mongoose = require("mongoose");

var jobOrderTypeSchema = new mongoose.Schema({
    type: String
});

module.exports = mongoose.model("jobOrderType", jobOrderTypeSchema);