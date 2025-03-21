
var mongoose = require("mongoose");
var employeesSchema = new mongoose.Schema({
    // ===============================================
    // Personal Data
    // ===============================================
    Name: String,
    Age: Number,
    Email: String,
    Address: String,
    Job: String,
    ContactNumber: Number,
    DateofBirth: Date,
    PlaceofBirth: String,
    Religion: String,
    Citizenship: String,   
    CivilStatus: String,
    isMale: Boolean,
    Height: Number,
    Weight: Number,
    Spouse: [
        {
            Spouse: String,
            ChildrenName: String
        }
    ],
    Parents: [
        {
            FathersName: String,
            FathersOccupation: String,
            MothersName: String,
            MothersOccupation: String,
            ParentsAddress: String,
            ParentsContactNumber: Number
        }
    ],
    ContactPersonName: String,
    ContactPersonAddress: String,
    ContactPersonNumber: Number,
    // ===============================================
    // Educational Background
    // ===============================================
    EducationalBackground: {
        Elementary: [
            {
                ElementaryName: String,
                ElementaryAddress: String
            }
        ],

        JuniorHighSchool: [
            {
                JuniorHighschoolName: String,
                JuniorHighschoolAddress: String
            }
        ],

        SeniorHighSchool: [
            {
                SeniorHighschoolName: String,
                SeniorHighschoolAddress: String
            }
        ],
        
        College: [
            {
                CollegeName: String,
                CollegeAddress: String
            }
        ],
        CollegeCourse: String
    },
    // ===============================================
    // Employment Record
    // ===============================================
    // -------- er = Employment Record  --------
    Employment :[
        {
            erFrom: Date,
            erTo: Date,
            erPosition: String,
            erCompany: String,
        }
    ],
    // ===============================================
    // Character Reference
    // ===============================================
    // -------- cr = Character Reference --------
    CharacterReference: [
        {
        crName: String,
        crOccupation: String,
        crAddress: String
        }
    ]
});

module.exports = mongoose.model("employees", employeesSchema);