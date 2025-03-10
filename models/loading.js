var mongoose = require("mongoose");
var loadingSchema = new mongoose.Schema({
});


module.exports = mongoose.model("loading", loadingSchema);