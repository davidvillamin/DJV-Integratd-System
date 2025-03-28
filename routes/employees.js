var express                             = require("express"),
    Employees                           = require("../models/employees"),
    router                              = express.Router();



// ============================================================
// Employee Index
// ============================================================
// initialize employee page (index)
router.get("/employees", async function(req, res){
    res.render("employees/index")
});
// ============================================================
// Employee View
// ============================================================
// initialize employee page (view)
router.get("/employees/view/:id", function(req, res){
    res.render("employees/view");
});

// ============================================================
// Employee Create
// ============================================================
router.post("/employees/create", async function(req, res){
    await Employees.create(req.body.data)
    res.send("You have successfully created a new device!")
});
// ============================================================
// Employee Edit
// ============================================================
router.put("/employees/employeesinformation/edit", async function(req, res){ 
    await Employees.findByIdAndUpdate(req.body.data.id, req.body.data.data)
    res.send("success")
})

// ============================================================
// Employee ID
// ============================================================
router.post("/employee/view/ajax", async function(req, res){
    var foundEmployees = await Employees.findById(req.body.data.id)
    res.send(foundEmployees)
});

router.post("/employees/populate/table", async function(req, res) {
    var employeeID = await populateIndexTable()
    res.send(employeeID);
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
            employee.Address || "N/A",
            employee.JobTitle || "N/A",
        ]);
    });

    return empList;
    
}


