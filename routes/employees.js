var express                             = require("express"),
    Employees                           = require("../models/employees"),
    router                              = express.Router();



// ============================================================
// Client Index
// ============================================================
// initialize client page (index)
router.get("/employees", async function(req, res){
    res.render("employees/index")
});

router.post("/employees/populate/table", async function (req, res) {
    var employeeData = await populateIndexTable();
    res.send(employeeData)   
})

// successfully created employee
router.post("/employees/create", async function(req, res){
    await Employees.create(req.body.data)
    res.send("You have successfully created a new device!")
});

module.exports = router;

async function populateIndexTable(){

    var empList = [];
        var employeeInformationList = await Employees.find()
            .lean();
        // convert data to string
        employeeInformationList.forEach(function(employees){
            empList.push([
                "<a>" + employees.Name + "</a>",
                employees.Address,
                employees.Job,
            ]);
        });
    
        return empList;
}
