//======================================================
// Edit Client (Individual)
//======================================================
//individual client edit populate
// prefix legend: cie = client individual edit


function clientEditIndividual(id) { // client id
    return new Promise(async (resolve, reject) => {
        try {
            // get client data
            var clientData = await crudiAjax({ id: id }, "/client/view/ajax", 'Post');

            //population of data edit client
            $('#cieName').val(clientData.Name);
            $('#cieAddress').val(clientData.Address);
            $('#cieEmail').val(clientData.Email);
            $('#cieNotes').text(clientData.Notes);

            //gender
            if (clientData.isMale) {
                $('input[name="cieGender"][value="true"]').prop('checked', true);
            } else {
                $('input[name="cieGender"][value="false"]').prop('checked', true);
            }

            //contact number
            clientData.ContactDetails.forEach(function(detail, index) {
                if (index === 0) {
                    $('.cieContactNumberGroup').first().find('.cieContactNumber').val(detail);
                } else {
                    $('.cieContactNumberGroup').insertAfter("\
                        <div class='input-group my-3 cieContactNumberGroup'>\
                            <span class='input-group-text'>Contact Number</span>\
                            <input type='text' class='form-control cieContactNumber' val=" + detail + ">\
                            <button class='btn btn-success cieContactNumberAdd' type='button'><i class='bi bi-plus-square'></i></button>\
                            <button class='btn btn-danger cieContactNumberDelete' type='button'><i class='bi bi-trash'></i></button>\
                        </div>")
                }
            });

            //update edit client individual
            $('#ciEdit :submit').on('click', async function(e) {
                if ($(this).closest('form').is(':valid') === true) {
                    e.preventDefault();
                    clientData.data = {
                        Name: $('#cieName').val(),
                        Address: $('#cieAddress').val(),
                        Email: $('#cieEmail').val(),
                        Notes: $('#cieNotes').val(),
                        isMale: $('input[name="cieGender"]:checked').val(),
                        ContactNumber: []
                    }

                    $('.cieContactNumber').each(function() {
                        clientData.data.ContactNumber.push($(this).val());
                    });
                    clientData.id = id;

                    //save updated client
                    await crudiAjax(clientData, "/client/edit", 'Post')

                    // close modal   
                    $('#ciEditModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfuly edited a client!")
                    $(".toast").find(".toast-title").text("Edit Client")

                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

//======================================================
// Edit Client (Corporate)
//======================================================
//corporate client edit populate
// prefix legend: cce = client corporate edit
function clientEditCorporate(id) { // client id
    return new Promise(async (resolve, reject) => {
        try {
            // get client data
            var clientData = await crudiAjax({ id: id }, "/client/view/ajax", 'Post');

            //population of data edit client
            $('#cceName').val(clientData.Name);
            $('#cceAddress').val(clientData.Address);
            $('#cceEmail').val(clientData.Email);
            $('#cceNotes').text(clientData.Notes);

            //contact number and contact person
            $('.cccContactPersonGroup').not(':first').remove(); // remove all but the first contact number group
            clientData.ContactDetails.forEach(function(detail, index) {
                if (index === 0) {
                    $('.cccContactPersonGroup').first().find('.cccContactNumber').val(detail.ContactNumber);
                    $('.cccContactPersonGroup').first().find('.cccContactPerson').val(detail.ContactPerson);
                } else {
                    var newContactGroup = $('.cccContactPersonGroup').first().clone();
                    newContactGroup.find('.cccContactNumber').val(detail.ContactNumber);
                    newContactGroup.find('.cccContactPerson').val(detail.ContactPerson);
                    newContactGroup.insertBefore($('.cccContactAdd').closest('.cccContactPersonGroup'));
                    newContactGroup = null; // destroy variable
                }
            });

            //update edit client corporate
            $('#ccEdit :submit').on('click', async function(e) {
                if ($(this).closest('form').is(':valid') === true) {
                    e.preventDefault();
                    clientData.data = {
                        Name: $('#cceName').val(),
                        Address: $('#cceAddress').val(),
                        Email: $('#cceEmail').val(),
                        Notes: $('#cceNotes').val(),
                        ContactDetails: []
                    }

                    $('.cccContactPersonGroup').each(function() {
                        clientData.data.ContactDetails.push({
                            ContactNumber: $(this).find('.cccContactNumber').val(),
                            ContactPerson: $(this).find('.cccContactPerson').val()
                        });
                    });
                    clientData.id = id;


                    //save updated client
                    await crudiAjax(clientData, "/client/edit", 'Post')


                    // close modal   
                    $('#ccEditModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfuly edited a client!")
                    $(".toast").find(".toast-title").text("Edit Client")

                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}