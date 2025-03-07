var mongoose = require("mongoose");

var repairJobOrderSchema = new mongoose.Schema({
    client: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "client"
        }
    ],
    // eto ung in-house, on-site etc. kung meron pa gustong i dag dag
    serviceType: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "serviceType"
        }
    ],
    //backend
    joNum : String, // pwede naman ung _id ng jo ang joNumber or gagawa ng ibang jo number talaga. undecided pa ako dito
    //ok
    status: String, //Outsource, repaired, Unrepairable, Pending ,Ongoing, Pull-out, warranty/Backjob

    clientDevice: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "clientDevice"
        }
    ],
    // under client device para malaman ung item type and item description ng i rerepair. 
    //ok
    trouble: String, // eto ung status ng unit nung narecieved (eto ung initial status)
    troubleFile: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "imgVideoDb"
        }
    ], // eto ung name ng recording or picture ng pag accept ng unit

    // on time input of status report
    statusReport: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "serviceStatusReport"
        }
    ],
    
    dateRecieve: Date,  // date recieved kelan na tangap ung item
    //ok
    custody: String, //On Hand, Released na item

    dateRelease: Date,  // date relesed kelan na release ung item
    paymentStatus: String, // kung paid or unpaid
    paymentDate: Date, // kung kelan binayran ung service
    serviceCharge: Number, // eto ung bayad sa  labor

    warranty: Number, // by days ang warranty computation ang start ng warranty kung kelan na release ung item 
    warrantyEndDate: Date, // eto ung end ng date ng warranty
    draftMat: [], //  eto ung propose muna. parang scratch holder ng probable material upon reciveing ng material.
    // pero hindi ito ung exact material. esp. ung mga walang stock or for checking pa ng pricelist.
    // eto ung list ng materials na need sa service. 
    mat: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "material"
        }
    ],
    //eto ung gumawa ng jo
    // pero for now gagawin muna nating text lang
    recievedBy: String,
    repairedBy: String
    // tech: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "tech"
    //     }
    // ]

});

module.exports = mongoose.model("serviceRepairJobOrder", repairJobOrderSchema);