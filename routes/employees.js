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
var moment = require('moment'); // Assuming you're using moment.js

async function populateTimeTable() {
  const timeList = [];
  const timeTableList = await Employees.find()
      .select('Time _id')
      .lean();

  function roundToNearest15(date) {
      const minutes = date.minutes();
      let roundedMinutes;

      if (minutes >= 0 && minutes <= 7) {
          roundedMinutes = 0;
      } else if (minutes >= 8 && minutes <= 22) {
          roundedMinutes = 15;
      } else if (minutes >= 23 && minutes <= 37) {
          roundedMinutes = 30;
      } else if (minutes >= 38 && minutes <= 52) {
          roundedMinutes = 45;
      } else {
          roundedMinutes = 0;
          date.add(1, 'hour');
      }

      date.minutes(roundedMinutes);
      date.seconds(0);
      date.milliseconds(0);
      return date;
  }

  timeTableList.forEach((employee) => {
      if (employee.Time && employee.Time.length > 0) {
          employee.Time.forEach((timeEntry) => {
              const date = moment(timeEntry.TimeIn || timeEntry.TimeOut).format("YYYY-MM-DD");
              let status = "";
              let time = "";
              let statusClass = "";

              if (timeEntry.TimeIn) {
                  const timeInMoment = moment(timeEntry.TimeIn);
                  const roundedTimeIn = roundToNearest15(timeInMoment);
                  time = roundedTimeIn.format("hh:mm A");

                  // Define the time ranges
                  const onTimeStart = moment(date + " 08:00", "YYYY-MM-DD hh:mm");
                  const onTimeEnd = moment(date + " 08:07", "YYYY-MM-DD hh:mm");
                  const yellowStart = moment(date + " 08:08", "YYYY-MM-DD hh:mm");
                  const yellowEnd = moment(date + " 08:59", "YYYY-MM-DD hh:mm");
                  const orangeStart = moment(date + " 09:00", "YYYY-MM-DD hh:mm");
                  const orangeEnd = moment(date + " 13:00", "YYYY-MM-DD hh:mm");

                  if (roundedTimeIn.isBetween(onTimeStart, onTimeEnd, null, '[]')) {
                      status = "Time In";
                      statusClass = "on-time";
                  } else if (roundedTimeIn.isBetween(yellowStart, yellowEnd, null, '[]')) {
                      status = "Time In";
                      statusClass = "late-yellow";
                  } else if (roundedTimeIn.isBetween(orangeStart, orangeEnd, null, '[]')) {
                      status = "Time In";
                      statusClass = "late-orange";
                  } else {
                      status = "Time In";
                      statusClass = "late-orange";
                  }
                  timeList.push({
                      date: moment(date).format("MMMM-DD-YYYY"),
                      status: `<span class="attendance-status ${statusClass}">${status}</span>`,
                      time: time,
                  });
              }

              if (timeEntry.TimeOut) {
                  const timeOutMoment = moment(timeEntry.TimeOut);
                  const roundedTimeOut = roundToNearest15(timeOutMoment);
                  time = roundedTimeOut.format("hh:mm A");
                  if (!timeEntry.TimeIn) {
                      status = "Time Out";
                      statusClass = "";
                  }
                  timeList.push({
                      date: moment(date).format("MMMM-DD-YYYY"),
                      status: status, 
                      time: time,
                  });
              }
          });
      }
  });

  return timeList;
}




  