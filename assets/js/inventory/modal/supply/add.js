
function inventorySupplyCreate(productId){
    return new Promise (async function(resolve, reject){
        try {
            // get product information
            var productData = await crudiAjax({productId:productId}, "/inventory/product/getOneData","POST");
            if (productData.withSerial){
                inventorySupplyWithSerialAdd(productData).then( function(){
                    resolve()
                });
            } else {
                inventorySupplyWithoutSerialAdd(productData).then( function(){
                    resolve()
                });
            }
        } catch (error) {
            reject(error)
        }
    });
}
//with serial number
//==================================================================
//isaws = inventory supply add with serial
function inventorySupplyWithSerialAdd(productData) {
    return new Promise (function(resolve, reject){
        try {
            // set product code in modal
            $("#isawsProductCode").val(productData.Code);
            // create supply code number
            // adding event listener
            listenerAddSerial();
            listenerRemoveSerial();
            
            $('#isawsAddSerialForm').on('submit', async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    // loop all serial and add supplier and accounting info
                    var data = [];
                    var serialCount = parseInt(await crudiAjax({}, "/inventory/supply/generateCodeNumber","GET"));
                    $('.isawsSerialGroup').each(function(i){
                        var serialCode = "SUP" + String(serialCount + 1 + i).padStart(5, '0'); // simple unique code
                        data.push({
                            Serial: $(this).find('.isawsSerial').val(),
                            Code: serialCode,
                            ProductCode: productData.Code,
                            Product: productData._id,
                            Supplier: {
                                Name: $('#isawsName').val(),
                                Address: $('#isawsAddress').val(),
                                OR: $('#isawsOR').val(),
                                ORDate: $('#isawsORDate').val(),
                                Notes: $('#isawsNotes').val(),
                                Warranty: $('#isawsWarranty').val(),
                            },
                            Cost: parseFloat($('#isawsCost').val()),
                            DateAcquired: $('#isawsORDate').val(),
                            Status: 'Available'
                        })
                    });
                    var response = crudiAjax({data:data,id:productData._id}, "/inventory/supply/addSupply","POST");
                    // reset form
                    $('#isawsAddSerialForm')[0].reset();
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
// isawos = inventory supply add without serial
function inventorySupplyWithoutSerialAdd(productData) {
    return new Promise (function(resolve, reject){
        try {
            // set product code in modal
            $("#isawosProductCode").val(productData.Code);
            $('#isawosAddSupplyForm').on('submit', async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var serialCount = parseInt(await crudiAjax({}, "/inventory/supply/generateCodeNumber","GET"));
                    // loop all serial and add supplier and accounting info
                    var data = [];
                    for (var i = 0; i < $('#isawosQuantity').val(); i++) {
                        var serialCode = "SUP" + String(serialCount + 1 + i).padStart(5, '0'); // simple unique code
                        data.push({
                            Code: serialCode,
                            ProductCode: productData.Code,
                            Product: productData._id,
                            Supplier: {
                                Name: $('#isawosName').val(),
                                Address: $('#isawosAddress').val(),
                                OR: $('#isawosOR').val(),
                                ORDate: $('#isawosORDate').val(),
                                Notes: $('#isawosNotes').val(),
                                Warranty: $('#isawosWarranty').val(),
                            },
                            Cost: parseFloat($('#isawosCost').val()),
                            DateAcquired: $('#isawosORDate').val(),
                            Status: 'Available'
                        });
                    }
                    var response = crudiAjax({data:data,id:productData._id}, "/inventory/supply/addSupply","POST");
                    // reset form
                    $('#isawosAddSupplyForm')[0].reset();
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
    $(".isawsAddSerial").off('click').on('click', function(){
        var newSerialGroup = $('.isawsSerialGroup').first().clone();
        newSerialGroup.find('input').val('');
        newSerialGroup.insertBefore($(this).closest('.isawsSerialGroup'));
        listenerAddSerial(); // re-attach listener to new elements
        listenerRemoveSerial(); // re-attach delete listener to new elements
    });
}

function listenerRemoveSerial() {
    // isawRemove = Inventory Supply Add With Serial Remove
    $(".isawsRemoveSerial").off('click').on('click', function(){
        if ($('.isawsSerialGroup').length > 1) {
            $(this).closest('.isawsSerialGroup').remove();
        }
    });
}