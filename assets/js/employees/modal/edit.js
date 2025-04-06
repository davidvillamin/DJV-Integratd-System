function editEmployee() {
    employeeEditPopulate()
    return new Promise(function(resolve, reject) {
        try {
            $('#eicEdit').on('submit', function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var employeedata = {}
                    employeedata.data = {
                        Name:                       $('#eieName').val(),
                        JobTitle:                   $('#eieJob').val(),
                        PlaceofBirth:               $('#eiePlaceofBirth').val(),
                        Religion:                   $('#eieReligion').val(),
                        Citizenship:                $('#eieCitizenship').val(),
                        CivilStatus:                $('#eieCivilStatus').val(),
                        Age:                        Number($('#eieAge').val()),
                        Height:                     Number($('#eieHeight').val()),
                        Weight:                     Number($('#eieWeight').val()),
                        isMale:                     $('#eieGender').val(), // Updated to match the select element
                        DateofBirth:                new Date($('#eieDateofBirth').val()).toDateString(),
                        Spouse:                     $('#eieSpouse').val(),
                        FathersName:                $('#eieFatherName').val(),
                        FathersOccupation:          $('#eieFatherOccupation').val(),
                        MothersName:                $('#eieMotherName').val(),
                        MothersOccupation:          $('#eieMotherOccupation').val(),
                        ParentsAddress:             $('#eieParentAddress').val(),
                        ParentsContactNumber:       Number($('#eieParentContactNumber').val()),
                        ElementaryName:             $('#eieElementaryName').val(),
                        ElementaryAddress:          $('#eieElementaryAddress').val(),
                        ElementarySchoolYearStart:  new Date($('#eieElemStart').val()).toDateString(),
                        ElementarySchoolYearEnd:    new Date($('#eieElemEnd').val()).toDateString(),
                        JuniorHighschoolName:       $('#eieJuniorHighSchoolName').val(),
                        JuniorHighschoolAddress:    $('#eieJuniorHighSchoolAddress').val(),
                        JuniorHighSchoolYearStart:  Date($('#eieJHSYearStart').val()),
                        JuniorHighSchoolYearEnd:    Date($('#eieJHSYearEnd').val()),
                        SeniorHighschoolName:       $('#eieSeniorHighSchoolName').val(),
                        SeniorHighschoolAddress:    $('#eieSeniorHighSchoolAddress').val(),
                        SeniorHighSchoolYearStart:  new Date($('#eieSeniorHighStart').val()).toDateString(),
                        SeniorHighSchoolYearEnd:    new Date($('#eieSeniorHighEnd').val()).toDateString(),
                        CollegeName:                $('#eieCollegeName').val(),
                        CollegeAddress:             $('#eieCollegeAddress').val(),
                        CollegeStart:           new Date($('#eieCollegeStart').val()).toDateString(),
                        CollegeYearEnd:             new Date($('#eieCollegeEnd').val()).toDateString(),
                        CollegeCourse:              $('#eieCourseName').val(),
                        Address:                    [],
                        ContactDetails:             [],
                        Children:                   [],
                        EmergencyDetail:            [],
                        CharacterReference:         [],
                        Employment:                 [],   
                        
                    }
                    $('.eieAddressDetails').each(function(index) {
                        employeedata.data.Address.push({
                            AddressLine: $(this).find('.eieAddressLine').val(),
                            
                        });
                    });
                    $('.eieContactDetails').each(function(index) {
                        employeedata.data.ContactDetails.push({
                            ContactNumber: $(this).find('.eieContactNumber').val(),
                            
                        });
                    });
                    $('.eieChildren').each(function(index) {
                        employeedata.data.Children.push({
                            ChildrenName: $(this).find('.eieChildrenName').val()
                        });
                    });

                    $('.eieEmergency').each(function() {
                        employeedata.data.EmergencyDetail.push({
                            eeName: $(this).find('.eieeName').val(),
                            eeAddress: $(this).find('.eieeAddress').val(),
                            eeContactNumber: Number($(this).find('.eieeContactNumber').val()),
                            eeRelationship: $(this).find('.eieeRelationship').val()
                        })
                    });

                    $('.eierEmploymentRecord').each(function() {
                        employeedata.data.Employment.push({
                            erCompanyName: $(this).find('.eierCompanyName').val(),
                            erPosition:  $(this).find('.eierPosition').val(),
                            erFrom: new Date($(this).find('.eierFrom').val()).toDateString(),
                            erTo: new Date($(this).find('.eierTo').val()).toDateString()
                        })
                    });

                    $('.eieCharacterReference').each(function() {
                        employeedata.data.CharacterReference.push({
                            crName: $(this).find('.eicrReferenceName').val(),
                            crOccupation: $(this).find('.eicrReferenceOccupation').val(),
                            crContactNumber: Number($(this).find('.eicrReferenceContact').val())
                        })
                    });

                    employeedata.id = id;

                    console.log(employeedata.data.ContactDetails);
                    console.log(employeedata.data.Children);
                    
                    crudiAjax(employeedata, "/employees/employeesinformation/edit", "PUT")
                    // $('#eicEdit')[0].reset();
                    // // // close modal   
                    $('#eEditEmployee').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfuly added a new client!")
                    $(".toast").find(".toast-title").text("New Client")

                    resolve()
                }

            })

        } catch(error) {
            reject(error)
        }
    })
}
// ==================================================================
// Add and Delete for Address
// ==================================================================

// ==================================================================
// Add and Delete for Contact Number
// ==================================================================
function eiAddressAdd() {
    $(".eieAddressAdd").off('click').on('click', function(){
        var newEmployeeAddressGroup = $('.eieAddressDetails').first().clone();
        newEmployeeAddressGroup.find('input').val('');
        newEmployeeAddressGroup.insertAfter($(this).closest('.eieAddressDetails'));
        newEmployeeAddressGroup.find('.eieAddressLine').val(''); // Clear the input field
        eiAddressAdd(); // re-attach listener to new elements
        eiAddressDelete();
    });
}
function eiAddressDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".eieAddressDelete").off('click').on('click', function(){
        if ($('.eieAddressDetails').length > 1) {
            $(this).closest('.eieAddressDetails').remove();
        }
    });
}
function eiContactNumberAdd() {
    // cciContactNumberAdd = Client Create Individual Contact Number
    $(".eieContactNumberAdd").off('click').on('click', function() {
        var newEmployeeContactGroup = $('.eieContactDetails').first().clone();
        newEmployeeContactGroup.find('input').val('');
        newEmployeeContactGroup.insertAfter($(this).closest('.eieContactDetails'));
        newEmployeeContactGroup.find('.eieContactNumber').val(''); // Clear the input field
        eiContactNumberAdd(); // re-attach listener to new elements
        eiContactNumberDelete(); // re-attach delete listener to new elements
    });
}
function eiContactNumberDelete() {
    // cciContactNumberDelete = Client Create Individual Contact Number Delete
    $(".eieContactNumberDelete").off('click').on('click', function() {
        if ($('.eieContactDetails').length > 1) {
            $(this).closest('.eieContactDetails').remove();
        }
    });
}
// ==================================================================
// Add and Delete for Children
// ==================================================================

function eiChildrenAdd() {
    $(".eieChildrenAdd").off('click').on('click', function(){
        var newChildrenGroup = $('.eieChildren').first().clone();
        newChildrenGroup.find('input').val('');
        newChildrenGroup.insertAfter($(this).closest('.eieChildren'));
        newChildrenGroup.find('.eieChildren').val(''); // Clear the input field
        eiChildrenAdd(); // re-attach listener to new elements
        eiChildrenDelete(); // re-attach delete listener to new elements
    });
}
function eiChildrenDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".eieChildrenDelete").off('click').on('click', function(){
        if ($('.eieChildren').length > 1) {
            $(this).closest('.eieChildren').remove();
        }
    });
}

// ==================================================================
// Add and Delete for Address
// ==================================================================
function eiContactNumberAdd() {
    // cciContactNumberAdd = Client Create Individual Contact Number
    $(".eieContactNumberAdd").off('click').on('click', function() {
        var newEmployeeContactGroup = $('.eieContactDetails').first().clone();
        newEmployeeContactGroup.find('input').val('');
        newEmployeeContactGroup.insertAfter($(this).closest('.eieContactDetails'));
        newEmployeeContactGroup.find('.eieContactNumber').val(''); // Clear the input field
        eiContactNumberAdd(); // re-attach listener to new elements
        eiContactNumberDelete(); // re-attach delete listener to new elements
    });
}
function eiContactNumberDelete() {
    // cciContactNumberDelete = Client Create Individual Contact Number Delete
    $(".eieContactNumberDelete").off('click').on('click', function() {
        if ($('.eieContactDetails').length > 1) {
            $(this).closest('.eieContactDetails').remove();
        }
    });
}




// ==================================================================
// Add and Delete for Emergency Contact
// ==================================================================

function eiEmergencyAdd() {
    $(".eiEmergencyContactAdd").off('click').on('click', function(){
        var newEmergencyContactGroup = $('.eieEmergency').first().clone();
        newEmergencyContactGroup.find('input').val('');
        newEmergencyContactGroup.insertAfter($(this).closest('.eieEmergency'));
        newEmergencyContactGroup.find('.eieeName').val(''); // Clear the input field
        eiEmergencyAdd(); // re-attach listener to new elements
        eiEmergencyDelete(); // re-attach delete listener to new elements
    });
}
function eiEmergencyDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".eiEmergencyContactDelete").off('click').on('click', function(){
        if ($('.eieEmergency').length > 1) {
            $(this).closest('.eieEmergency').remove();
        }
    });
}

// ==================================================================
// Add and Delete for Employment
// ==================================================================
function eiEmploymentAdd() {
    $(".eierEmploymentRecordAdd").off('click').on('click', function(){
        var newEmploymentGroup = $('.eierEmploymentRecord').first().clone();
        newEmploymentGroup.find('input').val('');
        newEmploymentGroup.insertAfter($(this).closest('.eierEmploymentRecord'));
        newEmploymentGroup.find('.eierCompanyName').val(''); // Clear the input field
        eiEmploymentAdd(); // re-attach listener to new elements
        eiEmploymentDelete(); // re-attach delete listener to new elements
    });
}
function eiEmploymentDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".eierEmploymentRecordDelete").off('click').on('click', function(){
        if ($('.eierEmploymentRecord').length > 1) {
            $(this).closest('.eierEmploymentRecord').remove();
        }
    });
}

// ==================================================================
// Add and Delete for Character Reference
// ==================================================================
function eiReferenceAdd() {
    $(".eieCharacterReferenceAdd").off('click').on('click', function(){
        var newReferenceGroup = $('.eieCharacterReference').first().clone();
        newReferenceGroup.find('input').val('');
        newReferenceGroup.insertAfter($(this).closest('.eieCharacterReference'));
        newReferenceGroup.find('.eicrReferenceName').val(''); // Clear the input field
        eiReferenceAdd(); // re-attach listener to new elements
        eiReferenceDelete(); // re-attach delete listener to new elements
    });
}

function eiReferenceDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".eieCharacterReferenceDelete").off('click').on('click', function(){
        if ($('.eieCharacterReference').length > 1) {
            $(this).closest('.eieCharacterReference').remove();
        }
    });
}
