//individual client edit populate
function clientEditIndividualPopulate(clientData) {
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
}
//save edit client individual
function clientEditIndividualUpdate(id) {
    var clientData = {}
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

    crudiAjax(clientData, "/client/edit/individual", 'Post')
}

//corporate client edit populate
function clientEditCorporatePopulate(clientData) {
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
}