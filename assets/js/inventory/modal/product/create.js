
// ipc = inventory product create
function inventoryProductCreate(){
    return new Promise(function(resolve, reject){
        try {
            // toggle auto code number
            // initial toggle
            autoCodeNumberToggle();
            // event listener for toggle
            $('#ipcAutoCodeNumber').on('change', function(){
                autoCodeNumberToggle();
            })

            // toggle same as name
            // initial toggle
            sameAsNameToggle();
            // event listener for toggle
            $('#ipcSameAsName').on('change', function(){
                sameAsNameToggle();
            })

            // toggle no brand
            // initial toggle
            noBrandToggle();
            // event listener for toggle
            $('#ipcWithBrand').on('change', function(){
                noBrandToggle();
            })

            // toggle no model
            // initial toggle
            noModelToggle();
            // event listener for toggle
            $('#ipcWithModel').on('change', function(){
                noModelToggle();
            })

            noQuantityToggle();
            // event listener for toggle
            $('#ipcNoQuantity').on('change', function(){
                noQuantityToggle();
            })


            $('#ipCreate').on('submit', async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    
                    // Add is-valid class to all valid inputs for visual feedback
                    $(this).find('input[required], textarea[required], select[required]').each(function() {
                        if (this.checkValidity()) {
                            $(this).addClass('is-valid');
                        }
                    });
                    
                    // verify code number exist
                    var codeExists = await crudiAjax({codeNumber: $('#ipcCode').val()}, "/inventory/product/verifyCodeNumber", "POST");
                    if (codeExists) {
                        $(".toast").toast("show").find(".toast-body").text("The code number you entered already exists. Please use a different code number.");
                        $(".toast").find(".toast-title").text("Duplicate Code Number")
                        // add custom validation classes
                        $('#ipcCode').addClass('force-invalid');
                        $('#ipcCode').closest('.input-group').addClass('custom-invalid');
                        // remove is-valid from the code field since it's invalid
                        $('#ipcCode').removeClass('is-valid');
                        return;
                    } else {
                        // remove custom validation classes
                        $('#ipcCode').removeClass('force-invalid');
                        $('#ipcCode').closest('.input-group').removeClass('custom-invalid');
                        var data = {
                            Code: $('#ipcCode').val(),
                            Name: $('#ipcName').val(),
                            Description: $('#ipcDescription').val(),
                            Type: $('#ipcType').val(),
                            noBrand: $('#ipcWithBrand').is(':checked'),
                            // if no brand is checked, set brand to ""
                            Brand: $('#ipcWithBrand').is(':checked') ? "" : $('#ipcBrand').val(),
                            noModel: $('#ipcWithModel').is(':checked'),
                            Model: $('#ipcWithModel').is(':checked') ? "" : $('#ipcModel').val(),
                            withSerial: $('#ipcWithSerial').is(':checked'),
                            Status: "Available",
                            DateAcquired: new Date(),
                        };
                        console.log(data);
                        var toastMessage = crudiAjax(data, "/inventory/product/create", 'Post');
                        $('#ipCreate')[0].reset();
                        $('#ipCreateModal').modal('toggle'); // fix modal toggle method
                        $('.modal-backdrop').remove(); // ensure backdrop is removed
                        // show toast
                        $(".toast").toast("show").find(".toast-body").text(toastMessage)
                        $(".toast").find(".toast-title").text("New product created")
                        resolve()
                    }
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
function noQuantityToggle(){
    if ($('#ipcNoQuantity').is(':checked')){
        $('#ipcQuantity').prop('disabled', true);
        //clear serial input
        $('#ipcQuantity').val('No quantity');
    } else {
        $('#ipcQuantity').prop('disabled', false);
        $('#ipcQuantity').val('');
    }
}
function noModelToggle(){
    if ($('#ipcWithModel').is(':checked')){
        $('#ipcModel').prop('disabled', true);
        //clear serial input
        $('#ipcModel').val('No Model');
    } else {
        $('#ipcModel').prop('disabled', false);
        $('#ipcModel').val('');
    }
}

function noBrandToggle(){
    if ($('#ipcWithBrand').is(':checked')){
        $('#ipcBrand').prop('disabled', true);
        //clear serial input
        $('#ipcBrand').val('No Brand');
    } else {
        $('#ipcBrand').prop('disabled', false);
        $('#ipcBrand').val('');
    }
}
async function autoCodeNumberToggle(){
    if ($('#ipcAutoCodeNumber').is(':checked')){
        $('#ipcCode').prop('disabled', true);
        //generate own code number
        $('#ipcCode').val(''); // clear value first
        
        var generatedCode = await crudiAjax({}, "/inventory/product/generateCodeNumber", 'Get');
        $('#ipcCode').val(generatedCode);
    } else {
        $('#ipcCode').prop('disabled', false);
        $('#ipcCode').val('');
    }
}

function sameAsNameToggle(){
    if ($('#ipcSameAsName').is(':checked')){
        $('#ipcDescription').prop('disabled', true);
        //add listener on ipcName to sync to description

        $("#ipcName").off('.nameSync').on('input.nameSync', function(){
            $("#ipcDescription").val($(this).val());
        }).trigger('input.nameSync');

    } else {
        $('#ipcDescription').prop('disabled', false);
    }
}