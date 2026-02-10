//in this file all codes need for creating client using modal \views\client\modal\create.ejs
//just call this create client function
// legend prefix :
// cc - Client Create

function createClient(){
    return new Promise(function(resolve, reject) {
        try {

            // toggle auto code number
            // initial toggle
            autoCodeNumberToggle();
            // event listener for toggle
            $('#ccAutoCodeNumber').on('change', function(){
                autoCodeNumberToggle();
            })

            // Create Client
            // adding event listener
            listenerCreateContactNumberAdd();
            listenerCreateContactNumberDelete();
            
            // create transaction
            $('#cCreateClient :submit').on('click',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();

                    // Add is-valid class to all valid inputs for visual feedback
                    $(this).closest('form').find('input[required], textarea[required], select[required]').each(function() {
                        if (this.checkValidity()) {
                            $(this).addClass('is-valid');
                        }
                    });

                    // verify code number exist
                    var codeExists = await crudiAjax({codeNumber: $('#ccCode').val()}, "/client/verifyCodeNumber", "POST");
                    if (codeExists) {
                        $(".toast").toast("show").find(".toast-body").text("The code number you entered already exists. Please use a different code number.");
                        $(".toast").find(".toast-title").text("Duplicate Code Number")
                        // add custom validation classes
                        $('#ccCode').addClass('force-invalid');
                        $('#ccCode').closest('.input-group').addClass('custom-invalid');
                        // remove is-valid from the code field since it's invalid
                        $('#ccCode').removeClass('is-valid');
                        return;
                    } else {
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
                            Code: $('#ccCode').val(),
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
                        var crudiAjaxResult = await crudiAjax(data, "/client/create", "Post")
                        // clear form
                        $('#cCreateClient')[0].reset();
                        // close modal   
                        $('#cCreateModal').modal('toggle'); // fix modal toggle method
                        $('.modal-backdrop').remove(); // ensure backdrop is removed
                        // show toast
                        toastr.success("New Client", crudiAjaxResult);
                        resolve()
                    }
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
//==================================================================
function listenerCreateContactNumberAdd() {
    //cciContactNumberAdd = Client Create Individual Contact Number
    $(".ccContactNumberAdd").off('click').on('click', function(){
        var newContactGroup = $('.ccContactNumberGroup').first().clone();
        newContactGroup.find('input').val('');
        newContactGroup.insertBefore($(this).closest('.ccContactNumberGroup'));
        listenerCreateContactNumberAdd(); // re-attach listener to new elements
        listenerCreateContactNumberDelete(); // re-attach delete listener to new elements
    });
}

function listenerCreateContactNumberDelete() {
    // cciContactNumberDelete = Client Create Indivial Contact Number Delete
    $(".ccContactNumberDelete").off('click').on('click', function(){
        if ($('.ccContactNumberGroup').length > 1) {
            $(this).closest('.ccContactNumberGroup').remove();
        }
    });
}

async function autoCodeNumberToggle(){
    if ($('#ccAutoCodeNumber').is(':checked')){
        $('#ccCode').prop('disabled', true);
        //generate own code number
        $('#ccCode').val(''); // clear value first
        
        var generatedCode = await crudiAjax({}, "/client/generateCodeNumber", 'Get');
        $('#ccCode').val(generatedCode);
    } else {
        $('#ccCode').prop('disabled', false);
        $('#ccCode').val('');
    }
}