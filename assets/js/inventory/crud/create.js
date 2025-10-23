
// ipc = inventory product create
function inventoryProductCreate(){
    return new Promise(function(resolve, reject){
        try {
            //initialize product table
            productListTable()

            // toggle new product
            // initial toggle
            newProductToggle();

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

            // toggle no serial
            // initial toggle
            noSerialToggle();
            // event listener for toggle
            $('#ipcWithSerial').on('change', function(){
                noSerialToggle();
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

function noSerialToggle(){
    if ($('#ipcWithSerial').is(':checked')){
        $('#ipcSerial').prop('disabled', true);
        //clear serial input
        $('#ipcSerial').val('No Serial Number');
    } else {
        $('#ipcSerial').prop('disabled', false);
        $('#ipcSerial').val("");
    }
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

function productListTable(){
    // initialize datatable
    // var dTable = $('#ipcProductListTable').DataTable({
    //     data: crudiAjax({}, "/inventory/product/create/find/list", "POST"),
    //     pageLength: 10, // set to display 5 items
    //     lengthMenu: [10, 25, 50, 100], // entries per page options
    // })
    
    // clickable row to select data
    $('#ipcProductListTable tbody').on('click', 'tr', function() {
        $('#ipcCode').val(dTable.row(this).data()[0]);
        $('#ipcName').val(dTable.row(this).data()[1]);
        $('#ipcDescription').val(dTable.row(this).data()[2]);
        $('#ipcType').val(dTable.row(this).data()[3]);
        console.log(dTable.row(this).data()[4])
        if (dTable.row(this).data()[4]){ // brand
            $('#ipcWithBrand').prop('checked', true);
            noBrandToggle()
        } else {
            $('#ipcBrand').val(dTable.row(this).data()[5]);
        }

        if (dTable.row(this).data()[6]){ // model
            $('#ipcWithModel').prop('checked', true);
            noModelToggle()
        } else {
            $('#ipcModel').val(dTable.row(this).data()[7]);
        }

        if (dTable.row(this).data()[8]){ // serial
            $('#ipcWithSerial').prop('checked', true);
            noSerialToggle()
        } 

        // toggle off new product
        $('#ipcNewProduct').prop('checked', false);
    })
}

function newProductToggle(){
    $('#ipcNewProduct').on('change', function(){
        if ($('#ipcNewProduct').is(':checked')) {
            $('#ipcCode, #ipcName, #ipcDescription, #ipcType, #ipcBrand, #ipcModel').val('');
            $('#ipcWithBrand, #ipcWithModel, #ipcWithSerial ,#ipcNoQuantity ').prop('checked',false)
            noBrandToggle()
            noModelToggle()
            noSerialToggle()
            noQuantityToggle()
        }
    })
}