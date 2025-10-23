//======================================================
// Edit Client
//======================================================
//individual client edit populate
// prefix legend: ce = client edit


function clientEdit(client) { // client id
    return new Promise(async function (resolve, reject){
        try {
            // get client data
            console.log(client)

            //population of data edit client
            $('#ceFristName').val(client.FirstName);
            $('#ceLastName').val(client.LastName);
            $('#ceBusinessName').val(client.BusinessName);
            $('#ceEmail').val(client.Email);
            $('#ceAddressLine').val(client.Address.AddressLine);
            $('#ceCity').val(client.Address.City);
            $('#ceZip').val(client.Address.Zip);
            $('#ceNotes').val(client.Notes);
            // contact number
            client.ContactDetails.forEach(function(detail) {
                var contactTemplate = "<div class='input-group input-group-sm my-3 ceContactNumberGroup'>\
                    <span class='input-group-text'>Contact Number</span>\
                    <input type='text' class='form-control ceContactNumber' required value='" + detail + "'>\
                    <button class='btn btn-success ceContactNumberAdd' type='button'><i class='bi bi-plus-square'></i></button>\
                    <button class='btn btn-danger ceContactNumberDelete' type='button'><i class='bi bi-trash'></i></button>\
                </div>"
                $('#ceContactNumberContainer').append(contactTemplate);
            });

            // add listeners for contact number add and delete
            listenerContactNumberAdd();
            listenerContactNumberDelete();

            
            //update edit client 
            $('#cEditClient :submit').on('click', function(e) {
                if ($(this).closest('form').is(':valid') === true) {
                    e.preventDefault();
                    var contactNumbers = [];
                    var data = {
                        FirstName: $('#ceFristName').val(),
                        LastName: $('#ceLastName').val(),
                        FullName: $('#ceFristName').val() + ' ' + $('#ceLastName').val(),
                        BusinessName: $('#ceBusinessName').val(),
                        Email: $('#ceEmail').val(),
                        Notes: $('#ceNotes').val(),
                    }
                    // populate address
                    var clientAddress = {
                        FullAddress: $('#ceAddressLine').val() + ' ' + $('#ceCity').val() + ' ' + $('#ceZip').val(),
                        AddressLine: $('#ceAddressLine').val(),
                        City: $('#ceCity').val(),
                        Zip: $('#ceZip').val(),
                    }

                     // populate all contact number and compress it to an array
                    $('.ceContactNumber').each(function() {
                        contactNumbers.push($(this).val());
                    });
                    data.Address = clientAddress;
                    data.ContactDetails = contactNumbers;

                    // save data on a variable for confirmation
                    var crudiAjaxResult = crudiAjax({data:data, clientId:client._id}, "/client/edit", "Post")
                    // clear form
                    $('#cEditClient')[0].reset();
                    // close modal   
                    $('#cEditModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("Edit Client")

                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

//==================================================================
function listenerContactNumberAdd() {
    //cciContactNumberAdd = Client Create Individual Contact Number
    $(".ceContactNumberAdd").off('click').on('click', function(){
        var newContactGroup = $('.ceContactNumberGroup').first().clone();
        newContactGroup.find('input').val('');
        newContactGroup.insertBefore($(this).closest('.ceContactNumberGroup'));
        listenerContactNumberAdd(); // re-attach listener to new elements
        listenerContactNumberDelete(); // re-attach delete listener to new elements
    });
}

function listenerContactNumberDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".ceContactNumberDelete").off('click').on('click', function(){
        if ($('.ceContactNumberGroup').length > 1) {
            $(this).closest('.ceContactNumberGroup').remove();
        }
    });
}
