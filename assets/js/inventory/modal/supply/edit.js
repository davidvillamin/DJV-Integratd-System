function inventorySupplyEdit(supplyId) {
    return new Promise(function(resolve, reject) {
        try {

            // get product data
            var supplyData = crudiAjax({supplyId:supplyId},"/inventory/supply/getOneData","POST");
            if (supplyData.Product.withSerial) {
                // with serial number
                inventorySupplyEditWithSerial(supplyData).then(function() {
                    resolve();
                });
            } else {
                // without serial number
                inventorySupplyEditWithoutSerial(supplyData).then(function() {
                    resolve();
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

function inventorySupplyEditWithSerial(supplyData) {
    return new Promise(function(resolve, reject) {
        try{
            // populate form fields
            $('#isewsSerial').val(supplyData.Serial);
            $('#isewsProductCode').val(supplyData.Product.Code);
            $('#isewsName').val(supplyData.Supplier.Name);
            $('#isewsAddress').val(supplyData.Supplier.Address);
            $('#isewsOR').val(supplyData.Supplier.OR);
            $('#isewsORDate').val(moment(supplyData.Supplier.ORDate).format("YYYY-MM-DD"));
            $('#isewsWarranty').val(supplyData.Supplier.Warranty);
            $('#isewsNotes').val(supplyData.Supplier.Notes);
            $('#isewsCost').val(supplyData.Cost);

            // save edit 
            $("#iseWithSerialForm").off("submit").on("submit", function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {};
                    data.data = {
                        Serial: $('#isewsSerial').val(),
                        Supplier: {
                            Name: $('#isewsName').val(),
                            Address: $('#isewsAddress').val(),
                            OR: $('#isewsOR').val(),
                            ORDate: $('#isewsORDate').val(),
                            Warranty: $('#isewsWarranty').val(),
                            Notes: $('#isewsNotes').val()
                        },
                        Cost: $('#isewsCost').val(),
                    };
                    data.supplyId = supplyData._id;

                    // save edited supply data
                    var response = crudiAjax(data, "/inventory/supply/editSupply","put");
                    // reset form
                    $('#iseWithSerialForm')[0].reset();
                    // close modal
                    $('#iseWithSerialModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(response)
                    $(".toast").find(".toast-title").text("Supply edited")
                    resolve()

                }
            });

            // clear reservation button
            $('#isewsClearReservationBtn').off('click').on('click', function() {
                crudiAjax({supplyId: supplyData._id}, "/inventory/supply/clearReservation","put");
                // close modal
                $('#iseWithSerialModal').modal('toggle'); // fix modal toggle method
                $('.modal-backdrop').remove(); // ensure backdrop is removed
                // show toast
                $(".toast").toast("show").find(".toast-body").text("Reservation has been cleared.")
                $(".toast").find(".toast-title").text("Reservation Cleared")
                resolve()
            }) 
        } catch (error) {
            reject(error);
        }
    });
}

function inventorySupplyEditWithoutSerial(supplyData) {
    return new Promise(function(resolve, reject) {
        try{
            // populate form fields
            $('#isewosProductCode').val(supplyData.Product.Code);
            $('#isewosName').val(supplyData.Supplier.Name);
            $('#isewosAddress').val(supplyData.Supplier.Address);
            $('#isewosOR').val(supplyData.Supplier.OR);
            $('#isewosORDate').val(moment(supplyData.Supplier.ORDate).format("YYYY-MM-DD"));
            $('#isewosWarranty').val(supplyData.Supplier.Warranty);
            $('#isewosNotes').val(supplyData.Supplier.Notes);
            $('#isewosCost').val(supplyData.Cost);

            // save edit
            $("#iseWithoutSerialForm").off("submit").on("submit", function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {};
                    data.data = {
                        Supplier: {
                            Name: $('#isewosName').val(),
                            Address: $('#isewosAddress').val(),
                            OR: $('#isewosOR').val(),
                            ORDate: $('#isewosORDate').val(),
                            Warranty: $('#isewosWarranty').val(),
                            Notes: $('#isewosNotes').val()
                        },
                        Cost: $('#isewosCost').val(),
                    };
                    data.supplyId = supplyData._id;

                    // save edited supply data
                        var response = crudiAjax(data, "/inventory/supply/editSupply","put");
                    // reset form
                    $('#iseWithoutSerialForm')[0].reset();
                    // close modal
                    $('#iseWithoutSerialModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(response)
                    $(".toast").find(".toast-title").text("Supply edited")
                    resolve()
                }
            });

            // clear reservation button
            $('#isewosClearReservationBtn').off('click').on('click', function() {
                crudiAjax({supplyId: supplyData._id}, "/inventory/supply/clearReservation","put");
                // close modal
                $('#iseWithoutSerialModal').modal('toggle'); // fix modal toggle method
                $('.modal-backdrop').remove(); // ensure backdrop is removed
                // show toast
                $(".toast").toast("show").find(".toast-body").text("Reservation has been cleared.")
                $(".toast").find(".toast-title").text("Reservation Cleared")
                resolve()
            }) 
        } catch (error) {
            reject(error);
        }
    });
}