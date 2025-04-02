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
    $('.eiProfileJobTitle').text(employee.JobTitle)
    $('.evProfileName').text(employee.Name)
    $('#eiName').text(employee.Name)
    $('#eiJob').text(employee.JobTitle)
    $('#eiAge').text(employee.Age)
    $('#eiAddress').text(employee.Address)
    
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

    if (employee.ContactDetails && employee.ContactDetails.length > 0) {
        $('#eiContactNumber').text(employee.ContactDetails.map(contact => contact.ContactNumber).join(', '));
    } else {
        $('#eiContactNumber').text('N/A');
    }
    
    if (employee.Children && employee.Children.length > 0) {
        $('#eiChildrenNames').text(employee.Children.map(contact => contact.ChildrenName).join(', '));
    } else {
        $('#eiChildrenNames').text('N/A');
    }

    if (employee.EmergencyDetail && employee.EmergencyDetail.length > 0) {
        // Clear existing emergency details except the first one (if any)
        $('.eiEmergencyDetail:not(:first)').remove();

        // Loop through the EmergencyDetail and populate or add new fields
        employee.EmergencyDetail.forEach(function(emergency, index) {
            if (index > 0) {
                var newEmergencyGroup = $('.eiEmergencyDetail').first().clone();
                newEmergencyGroup.find('.eiEmergencyContactName').text(emergency.eeName);
                newEmergencyGroup.find('.eiEmergencyContactAddress').text(emergency.eeAddress);
                newEmergencyGroup.find('.eiEmergencyContactNumber').text(emergency.eeContactNumber);
                newEmergencyGroup.find('.eiEmergencyContactRelationship').text(emergency.eeRelationship);
                newEmergencyGroup.insertAfter($('.eiEmergencyDetail').last());
            } else {
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactName').text(emergency.eeName);
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactAddress').text(emergency.eeAddress);
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactNumber').text(emergency.eeContactNumber);
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactRelationship').text(emergency.eeRelationship);
            }
        });
    } else {
        $('.eiEmergencyDetail').text('N/A');
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
        // Clear existing employment details except the first one (if any)
        $('.eiEmploymentRecord:not(:first)').remove();

        // Loop through the Employment and populate or add new fields
        employee.Employment.forEach(function(employment, index) {
            if (index > 0) {
                var newEmploymentGroup = $('.eiEmploymentRecord').first().clone();
                newEmploymentGroup.find('.eivCompanyName').text(employment.erCompanyName);
                newEmploymentGroup.find('.eivPosition').text(employment.erPosition);
                newEmploymentGroup.find('.eivFrom').text(moment(employment.erFrom).format("MMM-DD-YYYY"));
                newEmploymentGroup.find('.eivTo').text(moment(employment.erTo).format("MMM-DD-YYYY"));
                newEmploymentGroup.insertAfter($('.eiEmploymentRecord').last());
            } else {
                $('.eiEmploymentRecord').eq(index).find('.eivCompanyName').text(employment.erCompanyName);
                $('.eiEmploymentRecord').eq(index).find('.eivPosition').text(employment.erPosition);
                $('.eiEmploymentRecord').eq(index).find('.eivFrom').text(moment(employment.erFrom).format("MMM-DD-YYYY"));
                $('.eiEmploymentRecord').eq(index).find('.eivTo').text(moment(employment.erTo).format("MMM-DD-YYYY"));
            }
        });
    } else {
        $('.eiEmploymentRecord').text('N/A');
    }

    
    
    //================================================================================================
    // CHARACTER REFERENCE
    //================================================================================================ 

    if (employee.CharacterReference && employee.CharacterReference.length > 0) {
        // Clear existing character references except the first one (if any)
        $('.eiCharacterReference:not(:first)').remove();

        // Loop through the CharacterReference and populate or add new fields
        employee.CharacterReference.forEach(function(reference, index) {
            if (index > 0) {
                var newReferenceGroup = $('.eiCharacterReference').first().clone();
                newReferenceGroup.find('.eivcrCompanyName').text(reference.crName);
                newReferenceGroup.find('.eivcrReferenceOccupation').text(reference.crOccupation);
                newReferenceGroup.find('.eicrNumber').text(reference.crContactNumber);
                newReferenceGroup.insertAfter($('.eiCharacterReference').last());
            } else {
                $('.eiCharacterReference').eq(index).find('.eivcrCompanyName').text(reference.crName);
                $('.eiCharacterReference').eq(index).find('.eivcrReferenceOccupation').text(reference.crOccupation);
                $('.eiCharacterReference').eq(index).find('.eicrNumber').text(reference.crContactNumber);
            }
        });
    } else {
        $('.eiCharacterReference').text('N/A');
    }

}
