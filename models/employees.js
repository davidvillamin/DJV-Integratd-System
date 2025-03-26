
var mongoose = require("mongoose");
var employeesSchema = new mongoose.Schema({
    // ===============================================
    //                  Personal Data
    // ===============================================
    Name:           String,
    Email:          String,
    Address:        String,
    JobTitle:       String,
    PlaceofBirth:   String,
    Religion:       String,
    Citizenship:    String,   
    CivilStatus:    String,
    Age:            Number,

    ContactDetails: [{
        ContactNumber: Number
    }],

    Height:         Number,
    Weight:         Number,
    isMale:         Boolean,
    DateofBirth:    Date,
    Spouse:         String,
    Children: [
        {
            ChildrenName:   String
        }
    ],
    
    FathersName:            String,
    FathersOccupation:      String,
    MothersName:            String,
    MothersOccupation:      String,
    ParentsAddress:         String,
    ParentsContactNumber:   Number,

    EmergencyDetail: [{
        Name:      String,
        Address:   String,
        ContactNumber:    Number,
        Relationship:    String
    }],
    
    // ===============================================
    //              Educational Background
    // ===============================================
    
    ElementaryName:             String,
    ElementaryAddress:          String,
    ElementarySchoolYearStart:  Date,
    ElementarySchoolYearEnd:    Date,



    JuniorHighschoolName:       String,
    JuniorHighschoolAddress:    String,
    JuniorHighSchoolYearStart:  Date,
    JuniorHighSchoolYearEnd:    Date,

    SeniorHighschoolName:       String,
    SeniorHighschoolAddress:    String,
    SeniorHighSchoolYearStart:  Date,
    SeniorHighSchoolYearEnd:    Date,
    
    
    
    
    CollegeName:        String,
    CollegeAddress:     String,
    CollegeYearStart:   Date,
    CollegeYearEnd:     Date,
    
          
    CollegeCourse: String,
    
    // ===============================================
    //              Employment Record
    // ===============================================
    // -------- er = Employment Record  --------
    Employment :[
        {
            erCompany:  String,
            erPosition: String,
            erFrom:     Date,
            erTo:       Date,
        }
    ],
    // ===============================================
    //              Character Reference
    // ===============================================
    // -------- cr = Character Reference --------
    CharacterReference: [
        {
        crName:         String,
        crOccupation:   String,
        crContactNumber:      String
        }
    ]
});

module.exports = mongoose.model("employees", employeesSchema);