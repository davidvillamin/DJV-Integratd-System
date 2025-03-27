var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
function editEmployee() {
    return new Promise(async(resolve, reject) =>{
        try {
            var employeedata = await crudiAjax({id: id}, "/employee/view/ajax", 'Post')
            
            console.log(employeedata);

            $('#eieName').val(employeedata.Name)
            $('#eieJob').val(employeedata.JobTitle)
            $('#eieAge').val(employeedata.Age)
            $('#eieAddress').val(employeedata.Address)
            $('#eieContactNumber').text(employeedata.ContactDetails[0].ContactNumber)
            $('#eiePlaceofBirth').val(employeedata.PlaceofBirth)
            $('#eieDateofBirth').val(moment(employeedata.DateofBirth).format("MMM-DD-YYYY")); // Set formatted date
            $('#eieGender').val(employeedata.isMale)
            $('#eieHeight').val(employeedata.Height)
            $('#eieWeight').val(employeedata.Weight)
            $('#eieReligion').val(employeedata.Religion)
            $('#eieCitizenship').val(employeedata.Citizenship)
            $('#eieCivilStatus').val(employeedata.CivilStatus)
            $('#eieSpouse').val(employeedata.Spouse)
            $('#eieChildrenName').val(employeedata.Children[0].ChildrenName)
            $('#eieMotherName').val(employeedata.MothersName)
            $('#eieMotherOccupation').val(employeedata.MothersOccupation)
            $('#eieFatherName').val(employeedata.FathersName)
            $('#eieFatherOccupation').val(employeedata.FathersOccupation)
            $('#eieParentAddress').val(employeedata.ParentsAddress)
            $('#eieParentContactNumber').val(employeedata.ParentsContactNumber)
            $('#eieeName').val(employeedata.EmergencyDetail[0].eeName)
            $('#eieeAddress').val(employeedata.EmergencyDetail[0].eeAddress)
            $('#eieeContactNumber').val(employeedata.EmergencyDetail[0].eeContactNumber)
            $('#eieeRelationship').val(employeedata.EmergencyDetail[0].eeRelationship)
            

            //population of data edit client
            // $('#cieName').val(clientData.Name);
            // $('#cieAddress').val(clientData.Address);
            // $('#cieEmail').val(clientData.Email);
            // $('#cieNotes').text(clientData.Notes);
            $('#eicEdit').on('submit', function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    
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
                        ElementarySchoolYearStart:  new Date($('#eiElemStart').val()).toDateString(),
                        ElementarySchoolYearEnd:    new Date($('#eiElemEnd').val()).toDateString(),
                        JuniorHighschoolName:       $('#eieJuniorHighSchoolName').val(),
                        JuniorHighschoolAddress:    $('#eieJuniorHighSchoolAddress').val(),
                        JuniorHighSchoolYearStart:  Date($('#eieJHSYearStart').val()),
                        JuniorHighSchoolYearEnd:    Date($('#eieJHSYearEndeieJHSYearEnd').val()),
                        SeniorHighschoolName:       $('#eieSeniorHighSchoolName').val(),
                        SeniorHighschoolAddress:    $('#eieSeniorHighSchoolAddress').val(),
                        SeniorHighSchoolYearStart:  new Date($('#eieSeniorHighStart').val()).toDateString(),
                        SeniorHighSchoolYearEnd:    new Date($('#eieSeniorHighEnd').val()).toDateString(),
                        CollegeName:                $('#eieCollegeName').val(),
                        CollegeAddress:             $('#eieCollegeAddress').val(),
                        CollegeStart:           new Date($('#eiCollegeStart').val()).toDateString(),
                        CollegeYearEnd:             new Date($('#eiCollegeEnd').val()).toDateString(),
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