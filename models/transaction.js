const { type } = require("jquery");
var mongoose = require("mongoose");

var transactionDbSchema = new mongoose.Schema({
    TransactionType: String, // inhouse , onsite, sales , warranty , project
    // inhouse - INHXXXX
    // onsite - ONSXXXX
    // sales - SALXXXX
    // warranty - WARXXXX
    // project - PROJXXXX
    transactionCode: String, 
    Client: 
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "client"
        },
    Device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "device"
    },
    Notes: Object, // quill

    Images: [
        {
            Title: String,
            Description: String,
            base64String: String
        }
    ],

    Tags: Array, // temporary tags or fix tags
    
    Technician: String,
    Supplies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "supply"
        }
    ],

    Running: {
        Expense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "running" // ledger
        },
        ServiceCharge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "running" // ledger
        },

        Quotation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "running" // ledger
        },
        PurchaseOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "running" // ledger
        },
        Invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "running" // ledger
        }, 
        Payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "running" // ledger
        }
    },
    Expense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense" // ledger
    },
    ServiceCharge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCharge" // ledger
    },
    Quotation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quotation" // ledger
    },
    PurchaseOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "purchaseOrder" // ledger
    },
    Invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "invoice" // ledger
    },
    Payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment" // ledger
    },

    ReleasedBy: {
        Date: Date,
        Technician: String
    },
    RecievedBy: {
        Date: Date,
        Technician: String
    },
    isClosed: Boolean,
    
});

module.exports = mongoose.model("transaction", transactionDbSchema);