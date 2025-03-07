var mongoose = require("mongoose");

var contactPersonSchema = new mongoose.Schema({
    isAvatarDefualt: Boolean, // individual / company
    avatarDefault: String, // individual / company
    tempFileIndex: Number, // individual / company Desc: eto ung magiging tagging system pag punta sa db
    tempAvatarFileName: String,
    avatar: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "imgVideoDb"
        }
    ],
    clntName: String, // individual / company
    gender: String, //individual
    citizenship: String, //individual

    address: [ // individual / company
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "addressDb"
        }
    ], 
    contact:[ // indiviual / company
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "contactDb"
        }
    ],
    dtls: String // if needed
});

module.exports = mongoose.model("contactPerson", contactPersonSchema);