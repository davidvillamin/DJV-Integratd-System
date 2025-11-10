var mongoose = require("mongoose");
var transactionDbSchema = new mongoose.Schema({
    TransactionType: String, // inhouse , onsite, sales , warranty , project
    // TRXXXXXX
    transactionCode: String, 
    Name: String,
    Client: 
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "client"
        },
    Device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "device"
    },
    ServiceReport: Object, // quill
    Images: [
        {
            Title: String,
            Description: String,
            base64String: String
        }
    ],

    Tags: Array, // temporary tags or fix tags
    Technician: String,
    ReleasedBy: {
        Date: Date,
        Personel: String
    },
    RecievedBy: {
        Date: Date,
        Personel: String
    },
    isClosed: Boolean,
    Product: [
        {
            Product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            Supply: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "supply"
            }
        }
    ],

    Expense: [{
        // ExpenseCode: String, //EXPXXXX - Expenses Code (expenses code will be created once it was written on transaction ledger)
        ExpensesType: String, // parts , service , others
        Date: Date,
        Name: String,
        Amount: Number,
        Description: String,
        Status: String, // , Approved, Paid
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    }],
    ServiceCharge: [{
        // ServiceCode: String, //SVRXXXX - Service Code
        Date: Date,
        Name: String,
        Amount: Number,
        Description: String,
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    }],

    Payment: [{
        // PaymentCode: String, //PAYXXXX - Payment Code
        Date: Date,
        Name: String,
        Amount: Number,
        Description: String,
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    }],

    // reporting
    Quotation: [{
        QuotationCode: String, //QUOXXXX - Quotation Code\
        Name: String,
        Date: Date,
        Name: String,
        Supplies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "supply"
            }
        ],
        // ServiceCharge
        Amount: Number,
        Description: String,
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        },
        isApproved: Boolean
    }],
    PurchaseOrder: [{
        PurchaseOrderCode: String, //PURXXXX - Purchase Order Code
        Date: Date,
        Name: String,
        Amount: Number,
        Description: String,
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    }],
    Invoice: [{
        InvoiceCode: String, //INVXXXX - Invoice Code
        Date: Date,
        Name: String,
        Amount: Number,
        Description: String,
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    }],
    Payment: [{
        PaymentCode: String, //PAYXXXX - Payment Code
        Date: Date,
        Name: String,
        Amount: Number,
        Description: String,
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    }],
    
});

module.exports = mongoose.model("transaction", transactionDbSchema);