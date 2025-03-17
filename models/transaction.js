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
    TempStatus: Array, // Pending, In Progress, Quotation,
    //Pending Approval, For Release, Pending Payment, Incomplete Payment,
    //Hold
    FixedStatus: Array, // Cancel Repair, Partial Approval,
    //Parts Request(Major), Parts Request(Minor), Parts Request(Major/Minor),
    // Parts Approve, Repaired, Released, Paid
    Technician: String,
    Part: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "part"
        }
    ],
    Billing: {
        Parts: [
            {
                Description: String,
                Quantity: Number,
                UnitPrice: Number,
                Total: Number
            }
        ],
        Transporation: [
            {
                Description: String,
                Quantity: Number,
                UnitPrice: Number,
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
    }
    
});

module.exports = mongoose.model("transaction", transactionDbSchema);