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
                        Height:                     $('#eieHeight').val(),
                        Weight:                     $('#eieWeight').val(),
                        // isMale:                     $('#eieGender').val(),
                        DateofBirth:                $('#eieDateofBirth').val(),
                        Spouse:                     $('#eieSpouse').val(),
                        FathersName:                $('#eieFatherName').val(),
                        FathersOccupation:          $('#eieFatherOccupation').val(),
                        MothersName:                $('#eieMotherName').val(),
                        MothersOccupation:          $('#eieMotherOccupation').val(),
                        ParentsAddress:             $('#eieParentAddress').val(),
                        ParentsContactNumber:       $('#eieParentContactNumber').val(),
                        ElementaryName:             $('#eieElementaryName').val(),
                        ElementaryAddress:          $('#eieElementaryAddress').val(),
                        ElementarySchoolYearStart:  $('#eiElemStart').val(),
                        ElementarySchoolYearEnd:    $('#eiElemEnd').val(),
                        JuniorHighschoolName:       $('#eiJuniorHighSchoolName').val(),
                        JuniorHighschoolAddress:    $('#eieJuniorHighSchoolAddress').val(),
                        JuniorHighSchoolYearStart:  $('#eiElemStart').val(),
                        JuniorHighSchoolYearEnd:    $('#eiElemEnd').val(),
                        SeniorHighschoolName:       $('#eieSeniorHighSchoolName').val(),
                        SeniorHighschoolAddress:    $('#eieSeniorHighSchoolAddress').val(),
                        SeniorHighSchoolYearStart:  $('#eiElemStart').val(),
                        SeniorHighSchoolYearEnd:    $('#eiElemEnd').val(),
                        CollegeName:                $('#eieCollegeName').val(),
                        CollegeAddress:             $('#eieCollegeAddress').val(),
                        CollegeYearStart:           $('#eiElemStart').val(),
                        CollegeYearEnd:             $('#eiElemEnd').val(),
                        CollegeCourse:              $('#eieCourseName').val(),
                        ContactDetails:             [],
                        Children:                   [],
                        EmergencyDetail:            [],
                        CharacterReference:         [],
                        Employment:                 []   
                        
                    }
                    $('.eieContactNumber').each(function(detail, index) {
                        employeedata.ContactDetails.push({
                            ContactNumber: $(this).find('.eiePersonalContactNumber').val()
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
                            ContactNumber: $(this).find('.eieeContactNumber').val(),
                            Relationship: $(this).find('.eieeRelationship').val()
                        })
                    });

                    $('.eiEmploymentRecord').each(function() {
                        employeedata.Employment.push({
                            erCompany: $(this).find('.eierCompanyName').val(),
                            erPosition:  $(this).find('.eierPosition').val(),
                            erFrom: $(this).find('.eierFrom').val(),
                            erTo: $(this).find('.eierTo').val(),
                        })
                        
                    });
                    $('.eiCharacterReference').each(function() {
                        employeedata.CharacterReference.push({
                            crName: $(this).find('.eiReferenceName').val(),
                            eiReferenceOccupation: $(this).find('.eiReferenceOccupation').val(),
                            crContactNumber: $(this).find('.eiReferenceContact').val()
                        })
                    });
                    console.log(employeedata);
                    
                    // var crudiAjaxResult = crudiAjax(employeedata, "/employees/create/view", "Post")
                    // $('#eicEdit')[0].reset();
                    // // // close modal   
                    // $('#eEditEmployee').modal('toggle'); // fix modal toggle method
                    // $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // // // show toast
                    // $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    // $(".toast").find(".toast-title").text("New Client")

                    resolve()
                }

            })

        } catch(error) {
            reject(error)
        }
    })
}