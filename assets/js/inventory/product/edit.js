function initProductEditModal(product, productId) {
    return new Promise(function(resolve, reject) {
        try {
            // populate fields
            $('#ipeCode').val(product.Code);
            $('#ipeCode').prop('disabled', true); // disable code editing

            $('#ipeName').val(product.Name);
            $('#ipeDescription').val(product.Description);
            $('#ipeType').val(product.Type);

            $('#ipeWithBrand').prop('checked', product.withBrand);
            $('#ipeBrand').val(product.Brand).prop('disabled', product.withBrand);
            $('#ipeWithModel').prop('checked', product.withModel);
            $('#ipeModel').val(product.Model).prop('disabled', product.withModel);

            // ideal pricing
            $('#ipeIdealPricing').val(product.idealPrice ? product.idealPrice : ''  );

            // toggle brand input
            $('#ipeWithBrand').off('change').on('change', function() {
                if ($('#ipeWithBrand').is(':checked')) {
                    $('#ipeBrand').prop('disabled', true);
                    $('#ipeBrand').val('No Brand');
                } else {
                    $('#ipeBrand').prop('disabled', false);
                    //clear brand input
                    $('#ipeBrand').val('');
                }
            });

            // toggle model input
            $('#ipeWithModel').off('change').on('change', function() {
                if ($('#ipeWithModel').is(':checked')) {
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
                        withBrand: $('#ipeWithBrand').is(':checked'),
                        Brand: $('#ipeBrand').val(),
                        withModel: $('#ipeWithModel').is(':checked'),
                        Model: $('#ipeModel').val(),
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