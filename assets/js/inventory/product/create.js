
// ipc = inventory product create
function inventoryProductCreate(){
    return new Promise(function(resolve, reject){
        try {
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


            $('#ipCreate').on('submit',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Code: $('#ipcCode').val(),
                        Name: $('#ipcName').val(),
                        Description: $('#ipcDescription').val(),
                        Type: $('#ipcType').val(),
                        withBrand: $('#ipcWithBrand').is(':checked'),
                        Brand: $('#ipcBrand').val(),
                        withModel: $('#ipcWithModel').is(':checked'),
                        Model: $('#ipcModel').val(),
                        withSerial: $('#ipcWithSerial').is(':checked'),
                        Status: "Available",
                        DateAcquired: new Date(),
                    };

                    var toastMessage = crudiAjax(data, "/inventory/product/create", 'Post');
                    $('#ipCreate')[0].reset();
                    $('#ipCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("New product created")
                    resolve()
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