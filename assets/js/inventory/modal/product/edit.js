function inventoryProductEdit(productId) {
    return new Promise(async function(resolve, reject) {
        try {
            // get product data to populate edit modal
            var productData = await crudiAjax({productId:productId},"/inventory/product/getOneData","POST");
            // populate fields
            $('#ipeCode').val(productData.Code);
            $('#ipeCode').prop('disabled', true); // disable code editing

            $('#ipeName').val(productData.Name);
            $('#ipeDescription').val(productData.Description);
            $('#ipeType').val(productData.Type);

            $('#ipeNoBrand').prop('checked', productData.noBrand); 
            $('#ipeBrand').val(productData.Brand).prop('disabled', productData.noBrand);
            $('#ipeBrand').val(productData.noBrand? 'No Brand' : productData.Brand);
            
            
            $('#ipeNoModel').prop('checked', productData.noModel);
            $('#ipeModel').val(productData.Model).prop('disabled', productData.noModel);
            $('#ipeModel').val(productData.noModel? 'No Model' : productData.Model);

            // ideal pricing
            $('#ipeIdealPricing').val(productData.idealPrice ? productData.idealPrice : ''  );

            // toggle brand input
            $('#ipeNoBrand').off('change').on('change', function() {
                if ($('#ipeNoBrand').is(':checked')) {
                    $('#ipeBrand').prop('disabled', true);
                    $('#ipeBrand').val('No Brand');
                } else {
                    $('#ipeBrand').prop('disabled', false);
                    //clear brand input
                    $('#ipeBrand').val('');
                }
            });

            // toggle model input
            $('#ipeNoModel').off('change').on('change', function() {
                if ($('#ipeNoModel').is(':checked')) {
                    $('#ipeModel').prop('disabled', true);
                    $('#ipeModel').val('No Model');
                } else {
                    $('#ipeModel').prop('disabled', false);
                    //clear model input
                    $('#ipeModel').val('');
                }
            });

            // save edited product
            $("#ipEdit").on('submit', function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Code: $('#ipeCode').val(),
                        Name: $('#ipeName').val(),
                        Description: $('#ipeDescription').val(),
                        Type: $('#ipeType').val(),
                        withBrand: $('#ipeNoBrand').is(':checked'),
                        Brand: $('#ipeNoBrand').is(':checked') ? '' : $('#ipeBrand').val(),
                        withModel: $('#ipeNoModel').is(':checked'),
                        Model: $('#ipeNoModel').is(':checked') ? '' : $('#ipeModel').val(),
                        idealPrice: $('#ipeIdealPricing').val()
                    };
                    data.productId = productId;
                    var toastMessage = crudiAjax(data, "/inventory/product/edit", 'Put');
                    $('#ipEdit')[0].reset();
                    $('#ipEditModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove();
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage);
                    $(".toast").find(".toast-title").text("Product edited successfully");
                    resolve();
                }
            });
            // resolve();
        } catch (error) {
            reject(error);
        }
    });
   
}