var mongoose = require("mongoose");

var serviceCatergorySchema = new mongoose.Schema({
    category: String,
});

module.exports = mongoose.model("serviceCategory", serviceCatergorySchema);