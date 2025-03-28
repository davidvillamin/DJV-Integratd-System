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
                        Address:                    $('#eieAddress').val(),
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
                        ContactDetails:             [],
                        Children:                   [],
                        EmergencyDetail:            [],
                        CharacterReference:         [],
                        Employment:                 [],   
                        
                    }
                    $('.eieContactDetails').each(function() {
                        employeedata.data.ContactDetails.push({
                            ContactNumber: Number($(this).find('.eieContactNumber').val())
                        });
                    });
                    $('.eieChildren').each(function() {
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

                    $('.eiCharacterReference').each(function() {
                        employeedata.data.CharacterReference.push({
                            crName: $(this).find('.eicrReferenceName').val(),
                            crOccupation: $(this).find('.eicrReferenceOccupation').val(),
                            crContactNumber: Number($(this).find('.eicrReferenceContact').val())
                        })
                    });

                    employeedata.id = id;
                    
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