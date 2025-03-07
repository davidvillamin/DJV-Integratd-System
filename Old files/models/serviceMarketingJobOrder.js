var mongoose = require("mongoose");

var marketingJobOrderSchema = new mongoose.Schema({
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
    

});

module.exports = mongoose.model("serviceMarketingJobOrder", marketingJobOrderSchema);