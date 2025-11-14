//======================================================
// Edit Client
//======================================================
//individual client edit populate
// prefix legend: ce = client edit

function editClient(clientId) { // client id
    return new Promise(async function (resolve, reject){
        try {
            // get client data
            var clientData = await crudiAjax({clientId: clientId}, "/client/getOneData", "Post")

            populateData(clientData).then(function(){
                // add listeners for contact number add and delete
                listenerEditContactNumberAdd();
                listenerEditContactNumberDelete();
            });


            
            //update edit client 
            $('#cEditClient :submit').on('click', function(e) {
                if ($(this).closest('form').is(':valid') === true) {
                    e.preventDefault();
                    var contactNumbers = [];
                    var data = {};
                    data.data = {
                        FirstName: $('#ceFristName').val(),
                        LastName: $('#ceLastName').val(),
                        FullName: $('#ceFristName').val() + ' ' + $('#ceLastName').val(),
                        BusinessName: $('#ceBusinessName').val(),
                        Email: $('#ceEmail').val(),
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
                    data.data.Address = clientAddress;
                    data.data.ContactDetails = contactNumbers;
                    data.clientId = clientId;
                    console.log(data)
                    // save data on a variable for confirmation
                    var crudiAjaxResult = crudiAjax(data, "/client/edit", "Post")
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
function listenerEditContactNumberAdd() {
    var newContactGroup = "<div class='input-group input-group-sm my-3 ceContactNumberGroup'>\
        <span class='input-group-text'>Contact Number</span>\
        <input type='text' class='form-control ceContactNumber' required value=''>\
        <button class='btn btn-success ceContactNumberAdd' type='button'><i class='bi bi-plus-square'></i></button>\
        <button class='btn btn-danger ceContactNumberDelete' type='button'><i class='bi bi-trash'></i></button>\
    </div>"
    $(".ceContactNumberAdd").off('click').on('click', function(){
        $(this).closest('#ceContactNumberContainer').append(newContactGroup);

        listenerEditContactNumberAdd(); // re-attach listener to new elements
        listenerEditContactNumberDelete(); // re-attach delete listener to new elements
    });
}

function listenerEditContactNumberDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".ceContactNumberDelete").off('click').on('click', function(){
        if ($('.ceContactNumberGroup').length > 1) {
            $(this).closest('.ceContactNumberGroup').remove();
        }
    });
}

function populateData(clientData){
    return new Promise(function(resolve, reject){
        try {
            //population of data edit client
            $('#ceCode').val(clientData.Code);
            $('#ceFristName').val(clientData.FirstName);
            $('#ceLastName').val(clientData.LastName);
            $('#ceBusinessName').val(clientData.BusinessName);
            $('#ceEmail').val(clientData.Email);
            $('#ceAddressLine').val(clientData.Address.AddressLine);
            $('#ceCity').val(clientData.Address.City);
            $('#ceZip').val(clientData.Address.Zip);
            $('#ceNotes').val(clientData.Notes);
            
            // clear existing contact numbers first
            $('#ceContactNumberContainer').empty();

            // contact number
            clientData.ContactDetails.forEach(function(detail) {
                var contactTemplate = "<div class='input-group input-group-sm my-3 ceContactNumberGroup'>\
                    <span class='input-group-text'>Contact Number</span>\
                    <input type='text' class='form-control ceContactNumber' required value='" + detail + "'>\
                    <button class='btn btn-success ceContactNumberAdd' type='button'><i class='bi bi-plus-square'></i></button>\
                    <button class='btn btn-danger ceContactNumberDelete' type='button'><i class='bi bi-trash'></i></button>\
                </div>"
                $('#ceContactNumberContainer').append(contactTemplate);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });    
}