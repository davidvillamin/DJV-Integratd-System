var mongoose = require("mongoose");
var clientSchema = new mongoose.Schema({
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
    ]
    // type: [
    //     { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "clientType"
    //     }
    // ],
    // wContPerson: Boolean,
    // tempFileIndex: Number, // indexing using number 1-99 in for client name and 100 and above will be the contact person
    // tempAvatarFileName: String,
    // isAvatarDefualt: Boolean, // individual / company
    // avatarDefault: String, // individual / company
    // avatar: [
    //     { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "imgVideoDb"
    //     }
    // ],
    // clntName: String, // individual / company
    // fNm: String, //individual
    // lNm: String, //individual
    // mNm: String, //individual
    // gender: String, //individual
    // citizenship: String, //individual
    // address: [ // individual / company
    //     { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "addressDb"
    //     }
    // ], 
    // contact:[ // indiviual
    //     { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "contactDb"
    //     }
    // ],
    // contactPerson:[ // company
    //     { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "contactPerson"
    //     }
    // ],
    // dtls: String, // if needed
    // // para ma lagayan ng device ung mga client
    // device: [ // indivual / company
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "deviceDb"
    //     }
    // ]
    // quotation: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "quotation"
    //     }
    // ],
    // sales: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "sales"
    //     }
    // ]
});

module.exports = mongoose.model("client", clientSchema);