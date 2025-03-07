var mongoose = require("mongoose");

var matSchema = new mongoose.Schema({
    //Material information
    isSerialized: Boolean,
    type: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "matType"
        }
    ],
    brand:[
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "matBrand"
        }
    ],
    // name: String,
    model: String,
    desc: String,
    eanUPC: String,
    
    //serial Details
    // serial:[
    //     { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "supplier"
    //     }
    // ]
});

module.exports = mongoose.model("material", matSchema);