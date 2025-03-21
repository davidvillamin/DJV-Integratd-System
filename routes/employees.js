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

// initialize employee page (view)
router.get("/employees/view/:id", function(req, res){
    res.render("employees/view");
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
            .select('Name Address Job Email _id')
            .lean();
        // convert data to string
        employeeInformationList.forEach(function(employees){
            empList.push([
                "<a href='/employees/view/"+ employees._id +"' > "+ employees.Name +" </a>",
                employees.Email,
                employees.Address,
                employees.Job,
            ]);
        });
    
        return empList;
}
