var mongoose = require("mongoose");

var clientTypeSchema = new mongoose.Schema({
    ClientType: String,
    wContPerson: Boolean
});

module.exports = mongoose.model("clientType", clientTypeSchema);