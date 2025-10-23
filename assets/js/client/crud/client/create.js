//in this file all codes need for creating client using modal \views\client\modal\create.ejs
//just call this create client function
// legend prefix :
// cc - Client Create

// need to put datatable variable for repopulating of table (if needed)
// kaso ang problem nito kapag ginamit mo ito sa ibang file di na ma detect ung dTable kasi
// hindi naman lahat ng files may datatable
function createClient(){
    return new Promise(function(resolve, reject) {
        try {
            // Create Client
            // adding event listener
            listenerContactNumberAdd();
            listenerContactNumberDelete();
            
            // create transaction
            $('#cCreateClient :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var contactNumbers = [];
                    // populate all contact number and compress it to an array
                    $('.ccContactNumber').each(function() {
                        contactNumbers.push($(this).val());
                    });
                    // populate address
                    var clientAddress = {
                        FullAddress: $('#ccAddressLine').val() + ' ' + $('#ccCity').val() + ' ' + $('#ccZip').val(),
                        AddressLine: $('#ccAddressLine').val(),
                        City: $('#ccCity').val(),
                        Zip: $('#ccZip').val(),
                    }
        
                    var data = {
                        CreatedDate: new Date(),
                        FirstName:$('#ccFristName').val(),
                        LastName:$('#ccLastName').val(),
                        FullName:$('#ccFristName').val() + ' ' + $('#ccLastName').val(),
                        BusinessName: $('#ccBusinessName').val(),
                        Email:$('#ccEmail').val(),
                        Notes: $("#ccNotes").val(),
                        ContactDetails: contactNumbers,
                        Address: clientAddress,
                        ContactDetails: contactNumbers
                    }
                    // save data on a variable for confirmation
                    var crudiAjaxResult = crudiAjax(data, "/client/create", "Post")
                    // clear form
                    $('#cCreateClient')[0].reset();
                    // close modal   
                    $('#cCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("New Client")
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
//==================================================================
function listenerContactNumberAdd() {
    //cciContactNumberAdd = Client Create Individual Contact Number
    $(".ccContactNumberAdd").off('click').on('click', function(){
        var newContactGroup = $('.ccContactNumberGroup').first().clone();
        newContactGroup.find('input').val('');
        newContactGroup.insertBefore($(this).closest('.ccContactNumberGroup'));
        listenerContactNumberAdd(); // re-attach listener to new elements
        listenerContactNumberDelete(); // re-attach delete listener to new elements
    });
}

function listenerContactNumberDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".ccContactNumberDelete").off('click').on('click', function(){
        if ($('.ccContactNumberGroup').length > 1) {
            $(this).closest('.ccContactNumberGroup').remove();
        }
    });
}
