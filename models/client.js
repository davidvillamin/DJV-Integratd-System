var mongoose = require("mongoose");
var clientSchema = new mongoose.Schema({
    // ClientCode: String, // CLNTXXXXX
    CreatedDate: Date,
    FirstName: String,
    LastName: String,
    FullName: String,
    BusinessName: String,
    Email: String,
    ContactDetails: [],
    Address: {
        FullAddress: String,
        AddressLine: String,
        City: String,
        Zip: String,
    },
    Notes: String,
    Transaction: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    ],
    Devices:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "device"
    }]
});

module.exports = mongoose.model("client", clientSchema);