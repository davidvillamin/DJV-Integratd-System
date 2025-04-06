
var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
function employeeEditPopulate(){

  eiAddressAdd()
  eiAddressDelete()
  
  eiContactNumberAdd()
  eiContactNumberDelete()


  eiChildrenAdd()
  eiChildrenDelete()

  eiEmergencyAdd()  
  eiEmergencyDelete()

  eiEmploymentAdd()
  eiEmploymentDelete()

  eiReferenceAdd()
  eiReferenceDelete()
    
  var employeedata =  crudiAjax({id: id}, "/employee/view/ajax", 'Post')
          
  console.log(employeedata);
  
  //================================================================================================
  // Personal Data
  //===========================================================   =====================================
  $('#eieName').val(employeedata.Name)
  $('#eieJob').val(employeedata.JobTitle)
  $('#eieAge').val(employeedata.Age)
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

  if (employeedata.Address && employeedata.Address.length > 0) {
    // Clear existing address details except the first one
    $('.eieAddressDetails:not(:first)').remove();

    // Loop through the Address and populate or add new fields
    employeedata.Address.forEach(function(address, index) {
        if (index > 0) {
            var newAddressGroup = $('.eieAddressDetails').first().clone();
            newAddressGroup.find('.eieAddressLine').val(address.AddressLine);
            newAddressGroup.insertAfter($('.eieAddressDetails').last());
        } else {
            $('.eieAddressDetails').eq(index).find('.eieAddressLine').val(address.AddressLine);
        }
    });
    
}


  if (employeedata.ContactDetails && employeedata.ContactDetails.length > 0) {
    // Clear existing contact details except the first one
    $('.eieContactDetails:not(:first)').remove();
    
    // Loop through the ContactDetails and populate or add new fields
    employeedata.ContactDetails.forEach(function(contact, index) {
        if (index > 0) {
            var newEmployeeContactGroup = $('.eieContactDetails').first().clone();
            newEmployeeContactGroup.find('input').val('');
            newEmployeeContactGroup.find('.eieContactNumber').val(contact.ContactNumber);
            newEmployeeContactGroup.insertAfter($('.eieContactDetails').last());
            eiContactNumberAdd(); // Add a new contact group
            eiContactNumberDelete()
        }
        $('.eieContactDetails').eq(index).find('.eieContactNumber').val(contact.ContactNumber);
    });
  } 

  if (employeedata.Children && employeedata.Children.length > 0) {
    // Clear existing children details except the first one
    $('.eieChildren:not(:first)').remove();

    // Loop through the Children and populate or add new fields
    employeedata.Children.forEach(function(child, index) {
        if (index > 0) {
            var newChildrenGroup = $('.eieChildren').first().clone();
            newChildrenGroup.find('input').val('');
            newChildrenGroup.find('.eieChildrenName').val(child.ChildrenName);
            newChildrenGroup.insertAfter($('.eieChildren').last());
            eiChildrenAdd(); // Add a new children group
            eiChildrenDelete();
        }
        $('.eieChildren').eq(index).find('.eieChildrenName').val(child.ChildrenName);
    });
  }


  if (employeedata.EmergencyDetail && employeedata.EmergencyDetail.length > 0) {
    // Clear existing emergency details except the first one
    $('.eieEmergency:not(:first)').remove();

    // Loop through the EmergencyDetail and populate or add new fields
    employeedata.EmergencyDetail.forEach(function(emergency, index) {
        if (index > 0) {
            var newEmergencyGroup = $('.eieEmergency').first().clone();
            newEmergencyGroup.find('input').val('');
            newEmergencyGroup.find('.eieeName').val(emergency.eeName);
            newEmergencyGroup.find('.eieeAddress').val(emergency.eeAddress);
            newEmergencyGroup.find('.eieeContactNumber').val(emergency.eeContactNumber);
            newEmergencyGroup.find('.eieeRelationship').val(emergency.eeRelationship);
            newEmergencyGroup.insertAfter($('.eieEmergency').last());
            eiEmergencyAdd(); // Add a new emergency group
            eiEmergencyDelete();
        }
        $('.eieEmergency').eq(index).find('.eieeName').val(emergency.eeName);
        $('.eieEmergency').eq(index).find('.eieeAddress').val(emergency.eeAddress);
        $('.eieEmergency').eq(index).find('.eieeContactNumber').val(emergency.eeContactNumber);
        $('.eieEmergency').eq(index).find('.eieeRelationship').val(emergency.eeRelationship);
    });
  }


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
  if (employeedata.Employment && employeedata.Employment.length > 0) {
    // Clear existing employment details except the first one
    $('.eierEmploymentRecord:not(:first)').remove();

    // Loop through the Employment and populate or add new fields
    employeedata.Employment.forEach(function(employment, index) {
        if (index > 0) {
            var newEmploymentGroup = $('.eierEmploymentRecord').first().clone();
            newEmploymentGroup.find('input').val('');
            newEmploymentGroup.find('.eierCompanyName').val(employment.erCompanyName);
            newEmploymentGroup.find('.eierPosition').val(employment.erPosition);
            newEmploymentGroup.find('.eierFrom').val(moment(employment.erFrom).format("YYYY-MM-DD"));
            newEmploymentGroup.find('.eierTo').val(moment(employment.erTo).format("YYYY-MM-DD"));
            newEmploymentGroup.insertAfter($('.eierEmploymentRecord').last());
            eiEmploymentAdd(); // Add a new employment group
            eiEmploymentDelete();
        }
        $('.eierEmploymentRecord').eq(index).find('.eierCompanyName').val(employment.erCompanyName);
        $('.eierEmploymentRecord').eq(index).find('.eierPosition').val(employment.erPosition);
        $('.eierEmploymentRecord').eq(index).find('.eierFrom').val(moment(employment.erFrom).format("YYYY-MM-DD"));
        $('.eierEmploymentRecord').eq(index).find('.eierTo').val(moment(employment.erTo).format("YYYY-MM-DD"));
    });
  }

  
  //================================================================================================
  // CHARACTER REFERENCE
  //================================================================================================ 
  
  if (employeedata.CharacterReference && employeedata.CharacterReference.length > 0) {
    // Clear existing character references except the first one
    $('.eieCharacterReference:not(:first)').remove();

    // Loop through the CharacterReference and populate or add new fields
    employeedata.CharacterReference.forEach(function(reference, index) {
        if (index > 0) {
            var newReferenceGroup = $('.eieCharacterReference').first().clone();
            newReferenceGroup.find('input').val('');
            newReferenceGroup.find('.eicrReferenceName').val(reference.crName);
            newReferenceGroup.find('.eicrReferenceOccupation').val(reference.crOccupation);
            newReferenceGroup.find('.eicrReferenceContact').val(reference.crContactNumber);
            newReferenceGroup.insertAfter($('.eieCharacterReference').last());
            eiReferenceAdd(); // Add a new reference group
            eiReferenceDelete();
        }
        $('.eieCharacterReference').eq(index).find('.eicrReferenceName').val(reference.crName);
        $('.eieCharacterReference').eq(index).find('.eicrReferenceOccupation').val(reference.crOccupation);
        $('.eieCharacterReference').eq(index).find('.eicrReferenceContact').val(reference.crContactNumber);
    });
  }

    

    

}