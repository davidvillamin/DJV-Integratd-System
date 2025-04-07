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
    // 1. Prepare an empty list to store our time table data.
    const timeList = [];
  
    // 2. Get the raw time data from the database.
    //    - `Employees.find()`: Find all employees.
    //    - `.select('Time _id')`: Only get the "Time" field and the employee's ID.
    //    - `.lean()`: Get plain JavaScript objects, not Mongoose documents.
    const timeTableList = await Employees.find()
    .select('Time _id')
    .lean();
  
    // 3. Go through each employee's time data.
    timeTableList.forEach((employee) => {
      // 4. Check if the employee has any "Time" entries.
      if (employee.Time && employee.Time.length > 0) {
        // 5. Go through each "Time" entry for this employee.
        employee.Time.forEach((timeEntry) => {
          // 6. Get the date from either TimeIn or TimeOut.
          //    - `moment(...)`: Use the moment.js library to work with dates.
          //    - `timeEntry.TimeIn || timeEntry.TimeOut`: If TimeIn is missing, use TimeOut.
          //    - `.format("MMMM-DD-YYYY")`: Format the date as "Month-Day-Year" (e.g., "January-01-2024").
          const date = moment(timeEntry.TimeIn || timeEntry.TimeOut).format("MMMM-DD-YYYY");
  
          // 7. Check if we already have an entry for this date in our timeList.
          //    - `timeList.find(...)`: Look for an entry where the "date" matches the current date.
          const existingEntry = timeList.find((entry) => entry.date === date);
  
          // 8. If we found an entry for this date...
          if (existingEntry) {
            // 9. Update the existing entry with the TimeIn or TimeOut.
            if (timeEntry.TimeIn) {
              existingEntry.timeIn = moment(timeEntry.TimeIn).format("hh:mm A"); // Format as "hour:minute AM/PM"
            }
            if (timeEntry.TimeOut) {
              existingEntry.timeOut = moment(timeEntry.TimeOut).format("hh:mm A");
            }
          } else {
            // 10. If there's no entry for this date, create a new one.
            timeList.push({
              date: date,
              // 11. Set TimeIn and TimeOut, or "N/A" if they're missing.
              timeIn: timeEntry.TimeIn ? moment(timeEntry.TimeIn).format("hh:mm A") : 'N/A',
              timeOut: timeEntry.TimeOut ? moment(timeEntry.TimeOut).format("hh:mm A") : 'N/A',
            });
          }
        });
      }
    });
  
    // 12. Return the completed time table list.
    return timeList;
  }
  