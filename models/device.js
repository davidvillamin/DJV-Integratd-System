var mongoose = require("mongoose");
var deviceSchema = new mongoose.Schema({
    Client:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: "client"
        },
    Name: String,
    Type: String,
    Brand: String,
    Model: String,
    withSerial: Boolean,
    Serial: String,
    Images: [{
        Title: String,
        Description: String,
        base64String: String
    }],
    Notes: String,
    CreatedDate: Date
});

module.exports = mongoose.model("device", deviceSchema);