var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(function () {
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function () {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    $("#sbemployees").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    var currentEmployee = crudiAjax({id: id}, "/employee/view/ajax", 'Post')
    employeeData(currentEmployee);

    

    editEmployee()

    

    

    
})

function employeeData(employee) {


    //================================================================================================
    // Personal Data
    //================================================================================================ 
    $('.evName').text(employee.Name)
    $('#eiName').text(employee.Name)
    $('#eiJob').text(employee.JobTitle)
    $('#eiAge').text(employee.Age)
    $('#eiAddress').text(employee.Address)
    $('#eiContactNumber').text(employee.ContactDetails[0].ContactNumber)
    $('#eiPlaceofBirth').text(employee.PlaceofBirth)
    $('#eiDateofBirth').text(moment(employee.DateofBirth).format("MMM-DD-YYYY")); // Set formatted date
    $('#eiGender').text(employee.isMale)
    $('#eiHeight').text(employee.Height)
    $('#eiWeight').text(employee.Weight)
    $('#eiReligion').text(employee.Religion)
    $('#eiCitizenship').text(employee.Citizenship)
    $('#eiCivilStatus').text(employee.CivilStatus)
    $('#eiSpouse').text(employee.Spouse)
    
    $('#eiMotherName').text(employee.MothersName)
    $('#eiMotherOccupation').text(employee.MothersOccupation)
    $('#eiFatherName').text(employee.FathersName)
    $('#eiFatherOccupation').text(employee.FathersOccupation)
    $('#eiParentAddress').text(employee.ParentsAddress)
    $('#eiParentContactNumber').text(employee.ParentsContactNumber)


    if (employee.EmergencyDetail && employee.EmergencyDetail.length > 0) {
        $('#eiEmergencyContactName').text(employee.EmergencyDetail[0].eeName);
        $('#eiEmergencyContactAddress').text(employee.EmergencyDetail[0].eeAddress);
        $('#eiEmergencyContactNumber').text(employee.EmergencyDetail[0].eeContactNumber);
        $('#eiEmergencyContactRelationship').text(employee.EmergencyDetail[0].eeRelationship);
    } else {
        $('#eiEmergencyContactName').text('N/A');
        $('#eiEmergencyContactAddress').text('N/A');
        $('#eiEmergencyContactNumber').text('N/A');
        $('#eiEmergencyContactRelationship').text('N/A');
    }

    if (employee.Children && employee.Children.length > 0) {
        $('#eiChildrenNames').text(employee.Children[0].ChildrenName);
    } else {
        $('#eiChildrenNames').text('N/A'); // Default value if no children data is available
    }
    
    //================================================================================================
    // Educational Background
    //================================================================================================ 
    $('#eiElementaryName').text(employee.ElementaryName)
    $('#eiElementaryAddress').text(employee.ElementaryAddress)
    $('#eiElementaryYearStart').text(moment(employee.ElementarySchoolYearStart).format("MMM-DD-YYYY"))
    $('#eiElementaryYearEnd').text(moment(employee.ElementarySchoolYearEnd).format("MMM-DD-YYYY"))

    $('#eiJHSName').text(employee.JuniorHighschoolName)
    $('#eiJHSAddress').text(employee.JuniorHighschoolAddress)
    $('#eiJHSYearStart').text(moment(employee.JuniorHighSchoolYearStart).format("MMM-DD-YYYY"))
    $('#eiJHSYearEnd').text(moment(employee.JuniorHighSchoolYearEnd).format("MMM-DD-YYYY"))

    $('#eiSeniorHighSchoolName').text(employee.SeniorHighschoolName)
    $('#eiSeniorHighSchoolAddress').text(employee.SeniorHighschoolAddress)
    $('#eiSeniorHighSchoolYearStart').text(moment(employee.SeniorHighSchoolYearStart).format("MMM-DD-YYYY"))
    $('#eiSeniorHighSchoolYearEnd').text(moment(employee.SeniorHighSchoolYearEnd).format("MMM-DD-YYYY"))

    $('#eiCollegeName').text(employee.CollegeName)
    $('#eiCollegeAddress').text(employee.CollegeAddress)
    $('#eiCollegeYearStart').text(moment(employee.CollegeYearStart).format("MMM-DD-YYYY"))
    $('#eiCollegeYearEnd').text(moment(employee.CollegeYearEnd).format("MMM-DD-YYYY"))
    
    $('#eiCourseName').text(moment(employee.CollegeYearEnd).format("MMM-DD-YYYY"))
    
    //================================================================================================
    // Employment History
    //================================================================================================ 
    
    
    if (employee.Employment && employee.Employment.length > 0) {
        $('#eierCompanyName').text(employee.Employment[0].erCompanyName);
        $('#eierPosition').text(employee.Employment[0].erPosition);
        $('#eierFrom').text(moment(employee.Employment[0].erFrom).format("MMM-DD-YYYY"));
        $('#eierTo').text(moment(employee.Employment[0].erTo).format("MMM-DD-YYYY"));
    } else {
        $('#eierCompanyName').text('N/A');
        $('#eierPosition').text('N/A');
        $('#eierFrom').text('N/A');
        $('#eierTo').text('N/A');
    }
    
    
    //================================================================================================
    // CHARACTER REFERENCE
    //================================================================================================ 

    if (employee.CharacterReference && employee.CharacterReference.length > 0) {
        $('#eivcrCompanyName').text(employee.CharacterReference[0].crName);
        $('#eivcrReferenceOccupation').text(employee.CharacterReference[0].crOccupation);
        $('#eicrNumber').text(employee.CharacterReference[0].crContactNumber);
    } else {
        $('#eivcrCompanyName').text('N/A');
        $('#eivcrReferenceOccupation').text('N/A');
        $('#eicrNumber').text('N/A');
    }
}



