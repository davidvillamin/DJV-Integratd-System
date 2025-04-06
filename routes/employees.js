var express = require("express"),
    Employees = require("../models/employees"),
    router = express.Router();



// ============================================================
// Employee Index
// ============================================================
// initialize employee page (index)
router.get("/employees", async function (req, res) {
    res.render("employees/index")
});
// ============================================================
// Employee View
// ============================================================
// initialize employee page (view)
router.get("/employees/view/:id", function (req, res) {
    res.render("employees/view");
});

// ============================================================
// Employee Create
// ============================================================
router.post("/employees/create", async function (req, res) {
    await Employees.create(req.body.data)
    res.send("You have successfully created a new device!")
});
// ============================================================
// Employee Edit
// ============================================================
router.put("/employees/employeesinformation/edit", async function (req, res) {
    await Employees.findByIdAndUpdate(req.body.data.id, req.body.data.data)
    res.send("success")
})// ============================================================
// Employee Time Table
// ============================================================



// ============================================================
// Employee ID
// ============================================================
router.post("/employee/view/ajax", async function (req, res) {
    var foundEmployees = await Employees.findById(req.body.data.id)
    res.send(foundEmployees)
});

router.post("/employees/populate/table", async function (req, res) {
    var employeeID = await populateIndexTable()
    res.send(employeeID);
});


// ============================================================
// Employee Time In and Out
// ============================================================

router.put("/employees/employeesinformation/time", async function (req, res) {
    try {
        await Employees.findByIdAndUpdate(
            req.body.data.id,
            { $push: { Time: req.body.data.Time[0] } },
            { new: true }
        );
        res.send("success");
    } catch (error) {
        console.error("Error updating employee time:", error);
        res.status(500).send("Error updating employee time");
    }
});

router.post("/employees/time/table", async function (req, res) {
    var employeeTime = await populateTimeTable()
    res.send(employeeTime);
});





module.exports = router;

// ============================================================
// Functions
// ============================================================

async function populateIndexTable() {

    const empList = [];
    const employeeInformationList = await Employees.find()
        .select('Name ContactDetails Address JobTitle _id')
        .lean();

    // Transform data into the desired format
    employeeInformationList.forEach((employee) => {
        empList.push([
            `<a href='/employees/view/${employee._id}'>${employee.Name}</a>`,
            employee.ContactDetails?.[0]?.ContactNumber || "N/A",
            employee.Address?.[0]?.AddressLine || "N/A",
            employee.JobTitle || "N/A",
        ]);
    });
    return empList;
}
async function populateTimeTable() {
    const timeList = [];
    const timeTableList = await Employees.find()
        .select('Time _id')
        .lean();

    timeTableList.forEach((employee) => {
        if (employee.Time && employee.Time.length > 0) {
            employee.Time.forEach((timeEntry) => {
                timeList.push({
                    date: timeEntry.TimeIn ? new Date(timeEntry.TimeIn).toLocaleDateString() : 'N/A',
                    timeIn: timeEntry.TimeIn ? new Date(timeEntry.TimeIn).toLocaleTimeString() : 'N/A',
                    timeOut: timeEntry.TimeOut ? new Date(timeEntry.TimeOut).toLocaleTimeString() : 'N/A',
                });
            });
        }
    });
    return timeList;
}