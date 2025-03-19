
var mongoose = require("mongoose");
var employeesSchema = new mongoose.Schema({
    
    Name: String,
    Address: String,
    Job: String
  
    
     
});

module.exports = mongoose.model("employees", employeesSchema);