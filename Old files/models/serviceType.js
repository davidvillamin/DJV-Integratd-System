var mongoose = require("mongoose");

var serviceTypeSchema = new mongoose.Schema({
    category: String,
    type: String,
    wTicket: Boolean
});

module.exports = mongoose.model("serviceType", serviceTypeSchema);