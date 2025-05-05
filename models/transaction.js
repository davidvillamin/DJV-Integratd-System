var mongoose = require("mongoose");

var transactionDbSchema = new mongoose.Schema({
    TransactionType: String,
    JobOrder: String,
    Client: 
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "client"
        }
    ,
    RecieveDate: Date,
    RecievedBy: String,
    Device: String,
    SerialNumber: String,
    Notes: Object,
    Images: [
        {
            Title: String,
            Description: String,
            base64String: String
        }
    ],
    Tags: Array, // temporary tags or fix tags
    Technician: String,
    Balance: Number,
    Billing: {
        Parts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "serial"
            }
        ],
        Transporation: [
            {
                Description: String,
                Quantity: Number,
                Price: Number
            }
        ],
        ServiceCharge: [
            {
                Description: String,
                Price: Number
            }
        ],
        Payment: [
            {
                Date: Date,
                Description: String,
                Amount: Number,
            }
        ]
    },
    ReleasedBy: {
        Date: Date,
        Technician: String
    },
    isClosed: Boolean,
    CloseTransaction: {
        Date: Date,
        Technician: String
    }

    
});

module.exports = mongoose.model("transaction", transactionDbSchema);