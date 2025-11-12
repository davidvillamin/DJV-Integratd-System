function inventoryImage(productId) {
    return new Promise(async function(resolve, reject) {
        try {
            // get data to populate image modal
            var productData = await crudiAjax({productId:productId},"/inventory/product/getOneData","POST");

            // populate image list
            imageList(productData);

            // clear form
            $('#ipieClear').off('click').on('click', function(){
                $('#ipiePreview').attr('src', '/assets/img/no-image.jpg');
                $('#ipieImageId').val('');
                $('#ipiEdit')[0].reset();
                // hide delete button
                $('#ipieDelete').hide();
                $('#ipieClear').hide();
            });

            // delete image
            $('#ipieDelete').off('click').on('click', async function(){
                //get image id
                var data = {
                    ImageId: $('#ipieImageId').val(),
                    ProductId: productId
                }
                var toastMessage = await crudiAjax(data, "/inventory/product/image/delete", "POST");
                // hide delete button
                $('#ipieDelete').hide();
                $('#ipiePreview').attr('src', '/assets/img/no-image.jpg');
                $('#ipieImageId').val('');
                $('#ipieClear').hide(); // hide clear button
                // reset form
                $('#ipiEdit')[0].reset();
                var updatedProductData = await crudiAjax({productId:productId},"/inventory/product/getOneData","POST");
                // refetch updated product data and repopulate image list
                imageList(updatedProductData);
                $(".toast").toast("show").find(".toast-body").text(toastMessage)
                $(".toast").find(".toast-title").text("Product image deleted successfully!")
                resolve()
            });

            // change preview image on file select
            $('#ipieImage').off('change').on('change', function(){
                var file = this.files[0];
                img2b64(file).then(function(base64String){
                    $('#ipiePreview').attr('src', base64String);
                });
            });

            // save image 
            $('#ipiEdit').off('submit').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Title: $('#ipieTitle').val(),
                        Description: $('#ipieDescription').val(),
                        base64String: await img2b64($('#ipieImage')[0].files[0]),
                    }
                    data.ImageId = $('#ipieImageId').val();
                    data.ProductId = productId;
                    var toastMessage = await crudiAjax(data, "/inventory/product/image/edit", 'Post');
                    // show toast
                    $('#ipiePreview').attr('src', '/assets/img/no-image.jpg');
                    $('#ipieImageId').val('');
                    //reset form
                    $('#ipiEdit')[0].reset();
                    var updatedProductData = await crudiAjax({productId:productId},"/inventory/product/getOneData","POST");
                    // refetch updated product data and repopulate image list
                    imageList(updatedProductData);
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Product image updated successfully!")
                    resolve()
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function imageList(productData){
    $('#ipieImageList').empty();
    if (productData.Images.length === 0) {
        $('#ipieImageList').html('<p class="text-muted">No images available.</p>');
    } else {
        productData.Images.map(function(image){
            var listItem = $('<li class="list-group-item list-group-item-action d-flex justify-content-between" aria-current="true">' 
                + image.Title + '</li>');

            listItem.on('click', function(){
                $('#ipiePreview').attr('src', image.base64String);
                $('#ipieTitle').val(image.Title);
                $('#ipieDescription').val(image.Description);
                $('#ipieImageId').val(image._id);
                // unhide delete and clear button
                $('#ipieDelete').show();
                $('#ipieClear').show();
            });
            $('#ipieImageList').append(listItem);
        });
    }
}