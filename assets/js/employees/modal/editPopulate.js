
var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
function employeeEditPopulate(){
    
    var employeedata =  crudiAjax({id: id}, "/employee/view/ajax", 'Post')
            
    console.log(employeedata);
    
    //================================================================================================
    // Personal Data
    //================================================================================================
    $('#eieName').val(employeedata.Name)
    $('#eieJob').val(employeedata.JobTitle)
    $('#eieAge').val(employeedata.Age)
    $('#eieAddress').val(employeedata.Address)
    $('#eieGender').val(employeedata.isMale)
    $('#eieHeight').val(employeedata.Height)
    $('#eieWeight').val(employeedata.Weight)
    $('#eieReligion').val(employeedata.Religion)
    $('#eieCitizenship').val(employeedata.Citizenship)
    $('#eieCivilStatus').val(employeedata.CivilStatus)
    $('#eieSpouse').val(employeedata.Spouse)
    $('#eiePlaceofBirth').val(employeedata.PlaceofBirth)
    $('#eieDateofBirth').val(moment(employeedata.DateofBirth).format("YYYY-MM-DD")); // Set formatted date
    $('#eieMotherName').val(employeedata.MothersName)
    $('#eieMotherOccupation').val(employeedata.MothersOccupation)
    $('#eieFatherName').val(employeedata.FathersName)
    $('#eieFatherOccupation').val(employeedata.FathersOccupation)
    $('#eieParentAddress').val(employeedata.ParentsAddress)
    $('#eieParentContactNumber').val(employeedata.ParentsContactNumber)

    $('.eieContactDetails').each(function() {
      
        $(this).find('.eieContactNumber').val(employeedata.ContactDetails[0].ContactNumber);
      
    });
    $('.eieChildren').each(function(index) {
      if(employeedata.Children[index]){
        $(this).find('.eieChildrenName').val(employeedata.Children[index].ChildrenName);
      }
    });

    $('.eieEmergency').each(function(index) {
      if(employeedata.EmergencyDetail[index]){
        $(this).find('.eieeName').val(employeedata.EmergencyDetail[index].eeName),
        $(this).find('.eieeAddress').val(employeedata.EmergencyDetail[index].eeAddress),
        Number($(this).find('.eieeContactNumber').val(employeedata.EmergencyDetail[index].eeContactNumber)),
        $(this).find('.eieeRelationship').val( employeedata.EmergencyDetail[index].eeRelationship)
      }
    });

    //================================================================================================
    // Educational Background
    //================================================================================================ 
    $('#eieElementaryName').val(employeedata.ElementaryName)
    $('#eieElementaryAddress').val(employeedata.ElementaryAddress)
    $('#eieElemStart').val(moment(employeedata.ElementarySchoolYearStart).format("YYYY-MM-DD"))
    $('#eieElemEnd').val(moment(employeedata.ElementarySchoolYearEnd).format("YYYY-MM-DD"))


    $('#eieJuniorHighSchoolName').val(employeedata.JuniorHighschoolName)
    $('#eieJuniorHighSchoolAddress').val(employeedata.JuniorHighschoolAddress)
    $('#eieJHSYearStart').val(moment(employeedata.JuniorHighSchoolYearStart).format("YYYY-MM-DD"))
    $('#eieJHSYearEnd').val(moment(employeedata.JuniorHighSchoolYearEnd).format("YYYY-MM-DD"))

    $('#eieSeniorHighSchoolName').val(employeedata.SeniorHighschoolName)
    $('#eieSeniorHighSchoolAddress').val(employeedata.SeniorHighschoolAddress)
    $('#eieSeniorHighEnd').val(moment(employeedata.SeniorHighSchoolYearStart).format("YYYY-MM-DD"))
    $('#eieSeniorHighStart').val(moment(employeedata.SeniorHighSchoolYearEnd).format("YYYY-MM-DD"))


    $('#eieCollegeName').val(employeedata.CollegeName)
    $('#eieCollegeAddress').val(employeedata.CollegeAddress)
    $('#eieCollegeStart').val(moment(employeedata.CollegeYearStart).format("YYYY-MM-DD"))
    $('#eieCollegeEnd').val(moment(employeedata.CollegeYearEnd).format("YYYY-MM-DD"))
    //================================================================================================
    // Employment History
    //================================================================================================ 
    $('.eierEmploymentRecord').each(function(index) {
      if(employeedata.Employment[index]){
        $(this).find('.eierCompanyName').val(employeedata.Employment[index].erCompanyName),
        $(this).find('.eierPosition').val(employeedata.Employment[index].erPosition)
      }
    });
    
    //================================================================================================
    // CHARACTER REFERENCE
    //================================================================================================ 
    
    $('.eiCharacterReference').each(function(index) {
      if(employeedata.CharacterReference[index]){
        $(this).find('.eicrReferenceName').val(employeedata.CharacterReference[index].crName),
        $(this).find('.eicrReferenceOccupation').val(employeedata.CharacterReference[index].crOccupation)
        $(this).find('.eicrReferenceContact').val(employeedata.CharacterReference[index].crContactNumber)
      }
    });
    

    

}