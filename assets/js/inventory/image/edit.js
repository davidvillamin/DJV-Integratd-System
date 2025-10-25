function initImageEditModal(images, productId) {
    return new Promise(async function(resolve, reject) {
        try {
            // populate image list
            if (images.length === 0) {
                $('#ipieImageList').html('<p class="text-muted">No images available.</p>');
            } else {
                $('#ipieImageList').empty();
                images.map(function(image){
                    var listItem = $('<li class="list-group-item list-group-item-action d-flex justify-content-between" aria-current="true">' 
                        + image.Title + '</li>');

                    listItem.on('click', function(){
                        $('#ipiePreview').attr('src', image.base64String);
                        $('#ipieTitle').val(image.Title);
                        $('#ipieDescription').val(image.Description);
                        $('#ipieImageId').val(image._id);
                        // unhide delete button
                        $('.ipieDelete').show();
                    });
                    $('#ipieImageList').append(listItem);
                });
            }
            // delete image
            $('.ipieDelete').off('click').on('click', async function(){
                //get image id
                var imageId = $('#ipieImageId').val()
                var data = {
                    ImageId: imageId,
                    ProductId: productId
                }
                var toastMessage = await crudiAjax(data, "/inventory/product/image/delete", "POST");
                // hide delete button
                $('.ipieDelete').hide();
                $('#ipiePreview').attr('src', '/assets/img/no-image.jpg');
                $('#ipieImageId').val('');
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
