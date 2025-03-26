function editEmployee() {
    return new Promise(function(resolve, reject) {
        try {
            $('#eicEdit').on('submit',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var employeedata = {
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
                        ElementarySchoolYearStart:  new Date($('#eiElemStart').val()).toDateString(),
                        ElementarySchoolYearEnd:    new Date($('#eiElemEnd').val()).toDateString(),
                        JuniorHighschoolName:       $('#eieJuniorHighSchoolName').val(),
                        JuniorHighschoolAddress:    $('#eieJuniorHighSchoolAddress').val(),
                        JuniorHighSchoolYearStart:  new Date($('#eieJuniorHighStart').val()).toDateString(),
                        JuniorHighSchoolYearEnd:    new Date($('#eieJuniorHighEnd').val()).toDateString(),
                        SeniorHighschoolName:       $('#eieSeniorHighSchoolName').val(),
                        SeniorHighschoolAddress:    $('#eieSeniorHighSchoolAddress').val(),
                        SeniorHighSchoolYearStart:  new Date($('#eieSeniorHighStart').val()).toDateString(),
                        SeniorHighSchoolYearEnd:    new Date($('#eieSeniorHighEnd').val()).toDateString(),
                        CollegeName:                $('#eieCollegeName').val(),
                        CollegeAddress:             $('#eieCollegeAddress').val(),
                        CollegeYearStart:           new Date($('#eiCollegeStart').val()).toDateString(),
                        CollegeYearEnd:             new Date($('#eiCollegeEnd').val()).toDateString(),
                        CollegeCourse:              $('#eieCourseName').val(),
                        ContactDetails:             [],
                        Children:                   [],
                        EmergencyDetail:            [],
                        CharacterReference:         [],
                        Employment:                 []   
                        
                    }
                    $('.eieContactNumber').each(function() {
                        employeedata.ContactDetails.push({
                            ContactNumber: Number($(this).find('.eicContactNumber').val())
                        });
                    });
                    $('.eieChildren').each(function() {
                        employeedata.Children.push({
                            ChildrenName: $(this).find('.eieChildrenName').val()
                        });
                    });

                    $('.eieEmergency').each(function() {
                        employeedata.EmergencyDetail.push({
                            Name: $(this).find('.eieeName').val(),
                            Address: $(this).find('.eieeAddress').val(),
                            ContactNumber: Number($(this).find('.eieeContactNumber').val()),
                            Relationship: $(this).find('.eieeRelationship').val()
                        })
                    });

                    $('.eiEmploymentRecord').each(function() {
                        employeedata.Employment.push({
                            erCompany: $(this).find('.eierCompanyName').val(),
                            erPosition:  $(this).find('.eierPosition').val(),
                            erFrom: new Date($(this).find('.eierFrom').val()).toDateString(),
                            erTo: new Date($(this).find('.eierTo').val()).toDateString(),
                        })
                        
                    });
                    $('.eiCharacterReference').each(function() {
                        employeedata.CharacterReference.push({
                            crName: $(this).find('.eiReferenceName').val(),
                            eiReferenceOccupation: $(this).find('.eiReferenceOccupation').val(),
                            crContactNumber: Number($(this).find('.eiReferenceContact').val())
                        })
                    });
                    console.log(employeedata);

                    employeedata.id = id;
                    
                    crudiAjax(employeedata, "/employees/employeesinformation/view", "PUT")
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