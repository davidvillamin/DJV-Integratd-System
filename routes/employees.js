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
// Employee Attendance Table
// ============================================================

router.post("/employees/populate/employee/attendance", async function (req, res) {
    var employeeID = await populateAttendanceTable()
    res.send(employeeID);
});

// ============================================================
// Populate Weekly Attendance Table (Index Page) - NEW ROUTE
// ============================================================
router.post("/employees/populate/employee/weeklyAttendance", async function (req, res) {
    try {
        const weeklyData = await populateWeeklyAttendanceTable();
        res.send(weeklyData);
    } catch (error) {
        console.error("Error populating weekly attendance table:", error);
        res.status(500).send("Failed to load weekly attendance data.");
    }
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
const moment = require('moment'); // Make sure moment is required at the top of your file if not already

async function populateAttendanceTable(){

    
    const attendanceList = [];
    const employeeAttendanceList = await Employees.find()
        .select('Name _id')
        .lean();
    // Transform data into the desired format
    employeeAttendanceList.forEach((employee) => {
        attendanceList.push([
            `<a href='/employees/view/${employee._id}'>${employee.Name}</a>`,
            moment().format("MMMM DD, YYYY"),
        ]);
    });
    return attendanceList;
}

async function populateWeeklyAttendanceTable() {
    const weeklyData = [];
    const today = moment().startOf('day'); // Use startOf('day') for reliable date comparisons
    // Determine the start of the current week (Sunday) based on 'today'
    const startOfWeek = moment(today).startOf('week'); // moment's default start of week is Sunday

    const employees = await Employees.find()
        .select('Name _id Time')
        .lean();

    for (const employee of employees) {
        const employeeRow = [
            // First column: Employee Name link
            `<a href='/employees/view/${employee._id}'>${employee.Name || 'N/A'}</a>`,
            // Initialize the rest of the columns for the days (will be filled below)
            '-','-','-','-','-','-','-' // Placeholders for Sunday to Saturday
        ];

        const timeRecords = employee.Time || [];

        // Loop through the 7 days of the *current* week, starting from Sunday
        for (let i = 0; i < 7; i++) {
            // Calculate the specific date for the current day of the week (Sunday + i days)
            const currentDayInWeek = moment(startOfWeek).add(i, 'days').startOf('day'); // Ensure time is stripped for comparison

            // Find the TimeIn record for the currentDayInWeek
            const timeInRecord = timeRecords.find(record =>
                record.TimeIn && moment(record.TimeIn).isSame(currentDayInWeek, 'day')
            );

            if (timeInRecord) {
                dayStatus = 'P';
            } else {
                if (currentDayInWeek.day() === 0) { // Sunday is represented by 0
                    dayStatus = ' '; // Set the status to '-' for Sunday
                } else {
                    // Only mark as Absent ('A') if the day is strictly *before* today AND no TimeIn record was found
                    if (currentDayInWeek.isBefore(today, 'day')) {
                        dayStatus = 'A'; // Absent
                    } else {
                        dayStatus = '-';
                    }
                }
            }

            // Place the status in the correct column index (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
            // The employee name is at index 0, so days start from index 1.
            employeeRow[i + 1] = dayStatus;
        }
        weeklyData.push(employeeRow);
    }

    return weeklyData;
}






  