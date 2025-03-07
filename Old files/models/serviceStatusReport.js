var mongoose = require("mongoose");

var statusReportSchema = new mongoose.Schema({
    date: Date,
    report: String,
    tech: String,
    statusReportFile: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "imgVideoDb"
        }
    ]
});

module.exports = mongoose.model("serviceStatusReport", statusReportSchema);