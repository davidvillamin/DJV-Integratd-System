function initEditSupplyModal(supplyData) {
    return new Promise(function(resolve, reject) {
        try {
            // add click event to edit supply modal show
            $("#ivEditSupply").on("click", function() {
                // populate input fields from supply details
                if ($("#ivWithSerial").text().trim() === "Yes") {
                    // with serial number
                    $('#isewSerial').val($("#ivSerialNumber").text().trim());
                    $('#isewProductCode').val($("#ivProductCode").text().trim());
                    $('#isewName').val($("#ivSupplierName").text().trim());
                    $('#isewAddress').val($("#ivSupplierAddress").text().trim());
                    $('#isewOR').val($("#ivORNumber").text().trim());
                    $('#isewORDate').val(moment($("#ivDate").text().trim()).format("YYYY-MM-DD"));
                    $('#isewWarranty').val($("#ivWarranty").text().trim());
                    $('#isewNotes').val($("#ivNotes").text().trim());
                    // remove the pesos sign and decimal point on cents on the cost value
                    $('#isewCost').val($("#ivCost").text().trim().replace(/₱|\,|\.00/g, ''));

                } else {
                    // without serial number
                    $('#isewoProductCode').val($("#ivProductCode").text().trim());
                    $('#isewoName').val($("#ivSupplierName").text().trim());
                    $('#isewoAddress').val($("#ivSupplierAddress").text().trim());
                    $('#isewoOR').val($("#ivORNumber").text().trim());
                    $('#isewoORDate').val(moment($("#ivDate").text().trim()).format("YYYY-MM-DD"));
                    $('#isewoWarranty').val($("#ivWarranty").text().trim());
                    $('#isewoNotes').val($("#ivNotes").text().trim());
                    // remove the pesos sign and decimal point on cents on the cost value
                    $('#isewoCost').val($("#ivCost").text().trim().replace(/₱|\,|\.00/g, ''));
                }

                // update edited supply on save button click
                // with serial
                $("#iseWithSerialForm").off("submit").on("submit", function(e) {
                    if ($(this).closest('form').is(':valid') === true){
                        e.preventDefault();
                        var data = {};
                        data.data = {
                            Serial: $('#isewSerial').val(),
                            Supplier: {
                                Name: $('#isewName').val(),
                                Address: $('#isewAddress').val(),
                                OR: $('#isewOR').val(),
                                ORDate: $('#isewORDate').val(),
                                Warranty: $('#isewWarranty').val(),
                                Notes: $('#isewNotes').val()
                            },
                            Cost: $('#isewCost').val(),
                        };
                        data.supplyId = $("#ivSupplyId").val();

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

                // without serial
                $("#iseAddSerialForm").off("submit").on("submit", function(e) {
                    if ($(this).closest('form').is(':valid') === true){
                        e.preventDefault();
                        var data = {};
                        data.data = {
                            Supplier: {
                                Name: $('#isewoName').val(),
                                Address: $('#isewoAddress').val(),
                                OR: $('#isewoOR').val(),
                                ORDate: $('#isewoORDate').val(),
                                Warranty: $('#isewoWarranty').val(),
                                Notes: $('#isewoNotes').val()
                            },
                            Cost: $('#isewoCost').val(),
                        };
                        data.supplyId = $("#ivSupplyId").val();

                        // save edited supply data
                         var response = crudiAjax(data, "/inventory/supply/editSupply","put");
                        // reset form
                        $('#iseAddSerialForm')[0].reset();
                        // close modal
                        $('#iseWithoutSerialModal').modal('toggle'); // fix modal toggle method
                        $('.modal-backdrop').remove(); // ensure backdrop is removed
                        // show toast
                        $(".toast").toast("show").find(".toast-body").text(response)
                        $(".toast").find(".toast-title").text("Supply edited")
                        resolve()
                    }
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}