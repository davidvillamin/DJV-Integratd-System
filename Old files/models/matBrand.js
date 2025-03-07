var mongoose = require("mongoose");

var matBrandSchema = new mongoose.Schema({
    brand: String
});

module.exports = mongoose.model("matBrand", matBrandSchema);