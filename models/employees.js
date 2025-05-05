
var mongoose = require("mongoose");
var employeesSchema = new mongoose.Schema({
    // ===============================================
    //                  Personal Data
    // ===============================================
    Name:           String,
    Email:          String,

    Time: [{
        TimeIn:      Date,
        TimeOut:     Date,
        Log:      String,
    }],

    Address:        [{
        AddressLine: String
    }],
    
    JobTitle:       String,
    PlaceofBirth:   String,
    Religion:       String,
    Citizenship:    String,   
    CivilStatus:    String,
    Age:            Number,
    
    

    ContactDetails: [{
        ContactNumber: String
    }],

    Height:         Number,
    Weight:         Number,
    isMale:         String,
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
        eeName:             String,
        eeAddress:          String,
        eeContactNumber:    String,
        eeRelationship:     String
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
    CollegeStart:   Date,
    CollegeYearEnd:     Date,
    
          
    CollegeCourse: String,
    
    // ===============================================
    //              Employment Record
    // ===============================================
    // -------- er = Employment Record  --------
    Employment :[
        {
            erCompanyName:  String,
            erPosition:     String,
            erFrom:         Date,
            erTo:           Date,
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