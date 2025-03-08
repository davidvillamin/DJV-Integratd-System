var mongoose = require("mongoose");
var settingsSchema = new mongoose.Schema({
    
    Description: String,
    
     
});

module.exports = mongoose.model("settings", settingsSchema);