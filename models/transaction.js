var mongoose = require("mongoose");
var transactionDbSchema = new mongoose.Schema({
    Type: String, // inhouse , onsite, sales , warranty , project
    // TRXXXXXX
    Code: String, 
    Name: String,
    Client: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "client"},
    Device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "device"},
    ServiceReport: Object, // quill
    Images: [
        {
            Title: String,
            Description: String,
            base64String: String
        }
    ],
    Technician: String,
    ReleasedBy: {
        Date: Date,
        Personel: String
    },
    RecievedBy: {
        Date: Date,
        Personel: String
    },
    Status: Array, // pending, onprogress, forrelease, released, closed, cancelled

    statComplete: Boolean,
    statCompletedDate: Date,
    statReleased: Boolean,
    statReleasedDate: Date,
    statRepaired: Boolean,
    statRepairedDate: Date,
    statApproved: Boolean,
    statApprovedDate: Date,
    statQuotation: Boolean,
    statQuotationDate: Date,
    statPending: Boolean,
    CreatedDate: Date, // this date also for pending date

    Notes: String,
    PreAssessmentNotes: String,
    DocumentImages: {
        Quotation: {
            Title: String,
            base64String: String
        },
        Approval: {
            Title: String,
            base64String: String
        }
    },
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
        Name: String, // transaction name
        Amount: Number, // total amount to be paid
        Description: String, // description of the payment
        Transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transaction"
        }
    }],

    // reporting
    Quotation: [{
        QuotationCode: String, //QUOXXXX - Quotation Code\
        Name: String, //transaction name
        Date: Date, // date of quotation
        Supplies: [ // list of supplies in the quotation
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "supply"
            }
        ],
        ServiceCharge: String, // total service charge in the quotation
        Amount: Number, // total amount of the quotation
        hasInitialPaymets: Boolean, // if quotation has initial payment
        InitialPayment: Number,
        PreAssessment: String, // pre-assessment notes
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