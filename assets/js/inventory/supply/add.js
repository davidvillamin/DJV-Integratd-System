//with serial number
//==================================================================
function addSupplyWithSerial(supplierCode,productId) {
    return new Promise (function(resolve, reject){
        try {
            // set product code in modal
            $("#isawProductCode").val(supplierCode);
            
            // adding event listener
            listenerAddSerial();
            listenerRemoveSerial();

            $('#isawAddSerialForm').on('submit', function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    // loop all serial and add supplier and accounting info
                    var data = [];
                    $('.isawSerialGroup').each(function(i){
                        data.push({
                            Serial: $(this).find('.isawSerial').val(),
                            ProductCode: supplierCode,
                            Product: productId,
                            Supplier: {
                                Name: $('#isawName').val(),
                                Address: $('#isawAddress').val(),
                                OR: $('#isawOR').val(),
                                ORDate: $('#isawORDate').val(),
                                Notes: $('#isawNotes').val(),
                                Warranty: $('#isawWarranty').val(),
                            },
                            Cost: parseFloat($('#isawCost').val()),
                            DateAcquired: $('#isawORDate').val(),
                            Status: 'Available'
                        })
                    });
                    var response = crudiAjax({data:data,id:productId}, "/inventory/supply/addSupply","POST");
                    // reset form
                    $('#isawAddSerialForm')[0].reset();
                    // close modal
                    $('#isaWithSerialModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(response)
                    $(".toast").find(".toast-title").text("New supply added")
                    resolve()
                }
            });
        } catch (error) {
            reject(error)
        }
    });
}
// without serial number
//==================================================================
function addSupplyWithoutSerial(supplierCode,productId) {
    return new Promise (function(resolve, reject){
        try {
            // set product code in modal
            $("#isawoProductCode").val(supplierCode);

            $('#isawoAddSerialForm').on('submit', function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    // loop all serial and add supplier and accounting info
                    var data = [];
                    for (var i = 0; i < $('#isawoQuantity').val(); i++) {
                        data.push({
                            ProductCode: supplierCode,
                            Product: productId,
                            Supplier: {
                                Name: $('#isawoName').val(),
                                Address: $('#isawoAddress').val(),
                                OR: $('#isawoOR').val(),
                                ORDate: $('#isawoORDate').val(),
                                Notes: $('#isawoNotes').val(),
                                Warranty: $('#isawoWarranty').val(),
                            },
                            Cost: parseFloat($('#isawoCost').val()),
                            DateAcquired: $('#isawoORDate').val(),
                            Status: 'Available'
                        });
                    }
                    var response = crudiAjax({data:data,id:productId}, "/inventory/supply/addSupply","POST");
                    // reset form
                    $('#isawoAddSerialForm')[0].reset();
                    // close modal
                    $('#isaWithoutSerialModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(response)
                    $(".toast").find(".toast-title").text("New supply added")
                    resolve()
                }
            });
        } catch (error) {
            reject(error)
        }
    });
}



//==================================================================
function listenerAddSerial() {
    $(".isawAddSerial").off('click').on('click', function(){
        var newSerialGroup = $('.isawSerialGroup').first().clone();
        newSerialGroup.find('input').val('');
        newSerialGroup.insertBefore($(this).closest('.isawSerialGroup'));
        listenerAddSerial(); // re-attach listener to new elements
        listenerRemoveSerial(); // re-attach delete listener to new elements
    });
}

function listenerRemoveSerial() {
    // isawRemove = Inventory Supply Add With Serial Remove
    $(".isawRemoveSerial").off('click').on('click', function(){
        if ($('.isawSerialGroup').length > 1) {
            $(this).closest('.isawSerialGroup').remove();
        }
    });
}